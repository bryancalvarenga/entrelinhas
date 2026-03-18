import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Notificações limitadas a new_reply.
// Follows e touches não geram notificações.

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findUnread(profileId: string) {
    return this.prisma.notification.findMany({
      where: { recipientId: profileId, read: false, type: 'new_reply' },
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
      where: { recipientId: profileId, read: false, type: 'new_reply' },
      data: { read: true },
    });

    return { done: true };
  }

  async countUnread(profileId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: { recipientId: profileId, read: false, type: 'new_reply' },
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
