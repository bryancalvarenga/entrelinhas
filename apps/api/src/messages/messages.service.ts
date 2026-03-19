import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { sanitizeText } from '../common/utils/sanitize';

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const MAX_MESSAGES_PER_TURN = 3;

const SENDER_SELECT = {
  id: true,
  name: true,
  username: true,
  avatarInitial: true,
  avatarUrl: true,
} as const;

const MESSAGE_SELECT = {
  id: true,
  content: true,
  sentAt: true,
  editedAt: true,
  senderId: true,
  sender: { select: SENDER_SELECT },
} as const;

interface Turn {
  senderId: string;
  count: number;
  lastSentAt: Date;
}

function buildTurns(messages: { senderId: string; sentAt: Date }[]): Turn[] {
  const turns: Turn[] = [];
  for (const msg of messages) {
    const last = turns[turns.length - 1];
    if (last && last.senderId === msg.senderId) {
      last.count++;
      last.lastSentAt = msg.sentAt;
    } else {
      turns.push({ senderId: msg.senderId, count: 1, lastSentAt: msg.sentAt });
    }
  }
  return turns;
}

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(myProfileId: string, recipientUsername: string) {
    const recipient = await this.prisma.profile.findUnique({
      where: { username: recipientUsername },
      select: { id: true },
    });

    if (!recipient) throw new NotFoundException('Usuário não encontrado.');
    if (recipient.id === myProfileId) {
      throw new ForbiddenException(
        'Você não pode iniciar uma conversa consigo mesmo.',
      );
    }

    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { profileId: myProfileId } } },
          { participants: { some: { profileId: recipient.id } } },
        ],
      },
      select: { id: true },
    });

    if (existing) return { conversationId: existing.id };

    const created = await this.prisma.conversation.create({
      data: {
        participants: {
          create: [
            { profileId: myProfileId },
            { profileId: recipient.id },
          ],
        },
      },
      select: { id: true },
    });

    return { conversationId: created.id };
  }

  async findAll(profileId: string) {
    const rows = await this.prisma.conversation.findMany({
      where: { participants: { some: { profileId } } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        participants: {
          where: { profileId: { not: profileId } },
          select: {
            profile: { select: SENDER_SELECT },
            lastSeenAt: true,
          },
        },
        messages: {
          where: { deletedAt: null },
          orderBy: { sentAt: 'desc' },
          take: 1,
          select: { id: true, content: true, sentAt: true, senderId: true },
        },
      },
    });

    const withUnread = await Promise.all(
      rows.map(async (c) => {
        const me = await this.prisma.conversationParticipant.findUnique({
          where: {
            conversationId_profileId: {
              conversationId: c.id,
              profileId,
            },
          },
          select: { lastSeenAt: true },
        });

        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: c.id,
            senderId: { not: profileId },
            deletedAt: null,
            ...(me?.lastSeenAt
              ? { sentAt: { gt: me.lastSeenAt } }
              : undefined),
          },
        });

        return {
          id: c.id,
          createdAt: c.createdAt,
          otherProfile: c.participants[0]?.profile ?? null,
          lastMessage: c.messages[0] ?? null,
          unread: unreadCount > 0,
        };
      }),
    );

    return withUnread;
  }

  async hasUnreadMessages(profileId: string): Promise<{ hasUnread: boolean }> {
    const count = await this.prisma.notification.count({
      where: {
        recipientId: profileId,
        type: 'new_message',
        read: false,
      },
    });
    return { hasUnread: count > 0 };
  }

  async findMessages(conversationId: string, profileId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_profileId: { conversationId, profileId },
      },
    });
    if (!participant) throw new ForbiddenException('Você não faz parte desta conversa.');

    // Mark conversation as seen and clear message notifications
    await Promise.all([
      this.prisma.conversationParticipant.update({
        where: { conversationId_profileId: { conversationId, profileId } },
        data: { lastSeenAt: new Date() },
      }),
      this.prisma.notification.updateMany({
        where: {
          recipientId: profileId,
          type: 'new_message',
          referenceId: conversationId,
          read: false,
        },
        data: { read: true },
      }),
    ]);

    const messages = await this.prisma.message.findMany({
      where: { conversationId, deletedAt: null },
      orderBy: { sentAt: 'asc' },
      select: MESSAGE_SELECT,
    });

    const other = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, profileId: { not: profileId } },
      select: { profile: { select: SENDER_SELECT } },
    });

    const canSendStatus = await this.canSend(conversationId, profileId);

    return {
      conversationId,
      otherProfile: other?.profile ?? null,
      messages,
      canSend: canSendStatus.canSend,
      unlocksAt: canSendStatus.unlocksAt ?? null,
    };
  }

  async canSend(
    conversationId: string,
    senderId: string,
  ): Promise<{ canSend: boolean; reason?: string; unlocksAt?: string }> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { cooldownUntil: true },
    });

    // Check stored cooldown
    const now = new Date();
    if (conversation?.cooldownUntil && conversation.cooldownUntil > now) {
      return {
        canSend: false,
        reason: 'conversation_in_cooldown',
        unlocksAt: conversation.cooldownUntil.toISOString(),
      };
    }

    // Get messages since last cooldown ended (or all if no previous cooldown)
    const sinceDate = conversation?.cooldownUntil ?? new Date(0);
    const messages = await this.prisma.message.findMany({
      where: { conversationId, deletedAt: null, sentAt: { gt: sinceDate } },
      orderBy: { sentAt: 'asc' },
      select: { senderId: true, sentAt: true },
    });

    const turns = buildTurns(messages);

    if (turns.length === 0) return { canSend: true };

    const lastTurn = turns[turns.length - 1];

    if (lastTurn.senderId === senderId) {
      // It's currently our turn — check message limit
      if (lastTurn.count >= MAX_MESSAGES_PER_TURN) {
        return { canSend: false, reason: 'limit_reached' };
      }
      return { canSend: true };
    }

    // The other person spoke last
    if (turns.length === 1) {
      // Only one turn so far (by the other), it's our turn to respond
      return { canSend: true };
    }

    // turns.length >= 2: both have sent → cycle complete, set cooldown lazily
    // Base cooldown from when the other person last sent in their turn
    const cooldownUntil = new Date(
      lastTurn.lastSentAt.getTime() + THREE_HOURS_MS,
    );

    // Persist the cooldown so it's stable for both participants
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { cooldownUntil },
    });

    return {
      canSend: false,
      reason: 'conversation_in_cooldown',
      unlocksAt: cooldownUntil.toISOString(),
    };
  }

  async send(conversationId: string, senderId: string, content: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_profileId: { conversationId, profileId: senderId } },
    });
    if (!participant) throw new ForbiddenException('Você não faz parte desta conversa.');

    const { canSend, reason, unlocksAt } = await this.canSend(
      conversationId,
      senderId,
    );

    if (!canSend) {
      if (reason === 'limit_reached') {
        throw new ForbiddenException(
          'Você já enviou 3 mensagens seguidas. Aguarde uma resposta para continuar.',
        );
      }

      const t = unlocksAt
        ? new Date(unlocksAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : null;

      throw new ForbiddenException(
        t
          ? `Essa conversa está em pausa. Você poderá continuar às ${t}.`
          : 'Essa conversa está em pausa por enquanto.',
      );
    }

    const message = await this.prisma.message.create({
      data: { conversationId, senderId, content: sanitizeText(content) },
      select: MESSAGE_SELECT,
    });

    // After sending, check if the cycle just completed (turn 2 sender hit their limit)
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { cooldownUntil: true },
    });
    const sinceDate = conversation?.cooldownUntil ?? new Date(0);

    const allMessages = await this.prisma.message.findMany({
      where: { conversationId, deletedAt: null, sentAt: { gt: sinceDate } },
      orderBy: { sentAt: 'asc' },
      select: { senderId: true, sentAt: true },
    });

    const turns = buildTurns(allMessages);
    if (
      turns.length === 2 &&
      turns[1].count >= MAX_MESSAGES_PER_TURN &&
      !conversation?.cooldownUntil
    ) {
      // Eagerly set cooldown when turn 2 sender reaches their limit
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { cooldownUntil: new Date(Date.now() + THREE_HOURS_MS) },
      });
    }

    // Notify the other participant
    const recipient = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, profileId: { not: senderId } },
      select: { profileId: true },
    });

    if (recipient) {
      await this.prisma.notification.create({
        data: {
          recipientId: recipient.profileId,
          type: 'new_message',
          referenceId: conversationId,
        },
      });
    }

    return message;
  }

  async edit(
    conversationId: string,
    messageId: string,
    senderId: string,
    content: string,
  ) {
    const msg = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!msg || msg.conversationId !== conversationId) {
      throw new NotFoundException('Mensagem não encontrada.');
    }
    if (msg.senderId !== senderId) {
      throw new ForbiddenException('Você não pode editar esta mensagem.');
    }
    if (msg.deletedAt) {
      throw new ForbiddenException('Mensagem já removida.');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { content: sanitizeText(content), editedAt: new Date() },
      select: MESSAGE_SELECT,
    });
  }

  async softDelete(conversationId: string, messageId: string, senderId: string) {
    const msg = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!msg || msg.conversationId !== conversationId) {
      throw new NotFoundException('Mensagem não encontrada.');
    }
    if (msg.senderId !== senderId) {
      throw new ForbiddenException('Você não pode remover esta mensagem.');
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });

    return { deleted: true };
  }
}
