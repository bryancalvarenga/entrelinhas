import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const POST_SELECT = {
  id: true,
  content: true,
  intention: true,
  createdAt: true,
  author: {
    select: {
      id: true,
      name: true,
      username: true,
      avatarInitial: true,
      avatarUrl: true,
    },
  },
  _count: { select: { replies: true } },
} as const;

@Injectable()
export class SavedPostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(profileId: string) {
    const saved = await this.prisma.savedPost.findMany({
      where: { profileId },
      orderBy: { savedAt: 'desc' },
      select: {
        savedAt: true,
        post: { select: POST_SELECT },
      },
    });

    return saved.map(({ savedAt, post }) => ({ ...post, savedAt }));
  }

  async save(postId: string, profileId: string): Promise<{ saved: boolean }> {
    await this.assertPostExists(postId);

    await this.prisma.savedPost.upsert({
      where: { profileId_postId: { profileId, postId } },
      create: { profileId, postId },
      update: {},
    });

    return { saved: true };
  }

  async unsave(postId: string, profileId: string): Promise<{ saved: boolean }> {
    await this.assertPostExists(postId);

    await this.prisma.savedPost.deleteMany({
      where: { profileId, postId },
    });

    return { saved: false };
  }

  async getStatus(postId: string, profileId: string): Promise<{ saved: boolean }> {
    const entry = await this.prisma.savedPost.findUnique({
      where: { profileId_postId: { profileId, postId } },
      select: { profileId: true },
    });
    return { saved: !!entry };
  }

  private async assertPostExists(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Registro não encontrado.');
  }
}
