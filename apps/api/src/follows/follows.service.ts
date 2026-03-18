import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Follows são usados internamente para montar o feed.
// Nenhum endpoint retorna contagem de seguidores ou seguindo.

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async getStatus(
    username: string,
    followerId: string,
  ): Promise<{ following: boolean }> {
    const target = await this.findProfileByUsername(username);

    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: target.id,
        },
      },
      select: { followerId: true },
    });

    return { following: !!follow };
  }

  async follow(
    username: string,
    followerId: string,
  ): Promise<{ following: boolean }> {
    const target = await this.findProfileByUsername(username);

    if (target.id === followerId) {
      throw new BadRequestException('Você não pode se seguir.');
    }

    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId: target.id,
        },
      },
      create: { followerId, followingId: target.id },
      update: {},
    });

    // Notificar o usuário seguido
    await this.prisma.notification.create({
      data: {
        recipientId: target.id,
        type: 'new_follower',
        referenceId: followerId,
      },
    });

    return { following: true };
  }

  async unfollow(
    username: string,
    followerId: string,
  ): Promise<{ following: boolean }> {
    const target = await this.findProfileByUsername(username);

    await this.prisma.follow.deleteMany({
      where: { followerId, followingId: target.id },
    });

    return { following: false };
  }

  private async findProfileByUsername(username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!profile) throw new NotFoundException('Perfil não encontrado.');
    return profile;
  }
}
