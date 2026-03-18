import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

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

    // Compute unread: messages since my lastSeenAt that were sent by the other
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

  async findMessages(conversationId: string, profileId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_profileId: { conversationId, profileId },
      },
    });
    if (!participant) throw new ForbiddenException('Você não faz parte desta conversa.');

    // Mark as seen
    await this.prisma.conversationParticipant.update({
      where: { conversationId_profileId: { conversationId, profileId } },
      data: { lastSeenAt: new Date() },
    });

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
  ): Promise<{ canSend: boolean; unlocksAt?: string }> {
    const lastFromOther = await this.prisma.message.findFirst({
      where: {
        conversationId,
        senderId: { not: senderId },
        deletedAt: null,
      },
      orderBy: { sentAt: 'desc' },
      select: { sentAt: true },
    });

    if (!lastFromOther) return { canSend: true };

    const elapsed = Date.now() - lastFromOther.sentAt.getTime();
    if (elapsed >= THREE_HOURS_MS) return { canSend: true };

    const unlocksAt = new Date(lastFromOther.sentAt.getTime() + THREE_HOURS_MS);
    return { canSend: false, unlocksAt: unlocksAt.toISOString() };
  }

  async send(conversationId: string, senderId: string, content: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_profileId: { conversationId, profileId: senderId } },
    });
    if (!participant) throw new ForbiddenException('Você não faz parte desta conversa.');

    const { canSend, unlocksAt } = await this.canSend(conversationId, senderId);
    if (!canSend) {
      const t = new Date(unlocksAt!).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      });
      throw new ForbiddenException(
        `Você poderá responder a partir das ${t}. Cada conversa tem seu próprio ritmo.`,
      );
    }

    return this.prisma.message.create({
      data: { conversationId, senderId, content },
      select: MESSAGE_SELECT,
    });
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
      data: { content, editedAt: new Date() },
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
