import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Notificações do sino: new_reply e new_follower.
// new_message é separado — aparece apenas no ícone de mensagens.
// Touches nunca geram notificações.

const BELL_TYPES: ('new_reply' | 'new_follower')[] = ['new_reply', 'new_follower'];

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findUnread(profileId: string) {
    return this.prisma.notification.findMany({
      where: {
        recipientId: profileId,
        read: false,
        type: { in: BELL_TYPES },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        referenceId: true,
        createdAt: true,
      },
    });
  }

  async markAllRead(profileId: string) {
    await this.prisma.notification.updateMany({
      where: {
        recipientId: profileId,
        read: false,
        type: { in: BELL_TYPES },
      },
      data: { read: true },
    });

    return { done: true };
  }

  async countUnread(profileId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: {
        recipientId: profileId,
        read: false,
        type: { in: BELL_TYPES },
      },
    });
    return { count };
  }

  async markOneRead(id: string, profileId: string) {
    await this.prisma.notification.updateMany({
      where: { id, recipientId: profileId },
      data: { read: true },
    });

    return { done: true };
  }
}
