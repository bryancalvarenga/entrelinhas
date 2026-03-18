import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Feed limitado e intencional — sem ordenação por popularidade, sem feed infinito.
// limitedFeed=true → teto de 12 posts por sessão
// limitedFeed=false → teto de 20 posts por sessão
// Composição: posts do próprio usuário + pessoas seguidas + complemento recente

const LIMITED_FEED_MAX = 12;
const STANDARD_FEED_MAX = 20;

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
  // touches NÃO incluído — métrica privada
} as const;

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeed(profileId: string) {
    const settings = await this.prisma.wellbeingSettings.findUnique({
      where: { userId: await this.getUserIdFromProfile(profileId) },
      select: { limitedFeed: true, silentMode: true },
    });

    const limit = settings?.limitedFeed ? LIMITED_FEED_MAX : STANDARD_FEED_MAX;

    // IDs de quem o usuário segue
    const following = await this.prisma.follow.findMany({
      where: { followerId: profileId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    // Posts do próprio usuário + pessoas seguidas (ordenados por data)
    const primaryIds = [profileId, ...followingIds];
    const primaryPosts = await this.prisma.post.findMany({
      where: { authorId: { in: primaryIds } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: POST_SELECT,
    });

    // Complementar com posts recentes de quem o usuário ainda não segue
    let posts = primaryPosts;

    if (posts.length < limit) {
      const needed = limit - posts.length;
      const existingIds = posts.map((p) => p.id);

      const discoverPosts = await this.prisma.post.findMany({
        where: {
          id: { notIn: existingIds },
          authorId: { notIn: primaryIds },
        },
        orderBy: { createdAt: 'desc' },
        take: needed,
        select: POST_SELECT,
      });

      posts = [...posts, ...discoverPosts];
    }

    // Batch-query touch e save status — apenas para o usuário atual (privado)
    const postIds = posts.map((p) => p.id);
    const [touches, saves] = await Promise.all([
      this.prisma.touch.findMany({
        where: { profileId, postId: { in: postIds } },
        select: { postId: true },
      }),
      this.prisma.savedPost.findMany({
        where: { profileId, postId: { in: postIds } },
        select: { postId: true },
      }),
    ]);

    const touchedSet = new Set(touches.map((t) => t.postId));
    const savedSet = new Set(saves.map((s) => s.postId));

    const postsWithStatus = posts.map((p) => ({
      ...p,
      touched: touchedSet.has(p.id),
      saved: savedSet.has(p.id),
    }));

    return { posts: postsWithStatus, total: postsWithStatus.length };
  }

  private async getUserIdFromProfile(profileId: string): Promise<string> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });
    return profile!.userId;
  }
}
