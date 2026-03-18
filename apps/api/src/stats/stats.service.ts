import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, posts] = await Promise.all([
      this.prisma.profile.count({ where: { onboardingDone: true } }),
      this.prisma.post.count(),
    ]);
    return { users, posts };
  }
}
