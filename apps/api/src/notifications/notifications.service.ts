import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Notificações discretas — apenas new_reply e new_follower.
// Sem notificação de touch (interação privada).
// Sem badge de contagem agressiva no cliente.

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findUnread(profileId: string) {
    return this.prisma.notification.findMany({
      where: { recipientId: profileId, read: false },
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
      where: { recipientId: profileId, read: false },
      data: { read: true },
    });

    return { done: true };
  }

  async markOneRead(id: string, profileId: string) {
    await this.prisma.notification.updateMany({
      where: { id, recipientId: profileId },
      data: { read: true },
    });

    return { done: true };
  }
}
