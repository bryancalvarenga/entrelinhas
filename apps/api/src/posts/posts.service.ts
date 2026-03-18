import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

const DAILY_POST_LIMIT = 1;
import { PrismaService } from '../database/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

// Selects de author usados em múltiplos pontos — nunca expor follower count
const AUTHOR_SELECT = {
  id: true,
  name: true,
  username: true,
  avatarInitial: true,
  avatarUrl: true,
} as const;

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async canPost(profileId: string): Promise<{ canPost: boolean; nextPostAt: string }> {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const count = await this.prisma.post.count({
      where: {
        authorId: profileId,
        createdAt: { gte: startOfDay },
      },
    });

    const canPost = count < DAILY_POST_LIMIT;
    const nextPostAt = new Date();
    nextPostAt.setUTCHours(24, 0, 0, 0);
    return { canPost, nextPostAt: nextPostAt.toISOString() };
  }

  async create(profileId: string, dto: CreatePostDto) {
    const { canPost } = await this.canPost(profileId);
    if (!canPost) {
      throw new ForbiddenException(
        'Você já publicou hoje. Cada dia tem espaço para um registro — volte amanhã.',
      );
    }

    const post = await this.prisma.post.create({
      data: {
        authorId: profileId,
        content: dto.content,
        intention: dto.intention,
      },
      select: {
        id: true,
        content: true,
        intention: true,
        createdAt: true,
        author: { select: AUTHOR_SELECT },
        _count: { select: { replies: true } },
      },
    });

    return post;
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        intention: true,
        createdAt: true,
        author: { select: AUTHOR_SELECT },
        _count: { select: { replies: true } },
        // touches NÃO incluído — interação privada
      },
    });

    if (!post) throw new NotFoundException('Registro não encontrado.');

    return post;
  }

  async delete(id: string, profileId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new NotFoundException('Registro não encontrado.');
    if (post.authorId !== profileId) {
      throw new ForbiddenException('Você não pode remover este registro.');
    }

    await this.prisma.post.delete({ where: { id } });

    return { deleted: true };
  }

  async search(q: string) {
    return this.prisma.post.findMany({
      where: {
        content: { contains: q, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        content: true,
        intention: true,
        createdAt: true,
        author: { select: AUTHOR_SELECT },
        _count: { select: { replies: true } },
      },
    });
  }

  async findRandom() {
    const count = await this.prisma.post.count();
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const posts = await this.prisma.post.findMany({
      take: 1,
      skip,
      select: {
        id: true,
        content: true,
        intention: true,
        createdAt: true,
        author: { select: AUTHOR_SELECT },
        _count: { select: { replies: true } },
      },
    });
    return posts[0] ?? null;
  }

  // Usado internamente por outros serviços (feed, saved-posts)
  buildPostSelect() {
    return {
      id: true,
      content: true,
      intention: true,
      createdAt: true,
      author: { select: AUTHOR_SELECT },
      _count: { select: { replies: true } },
    } as const;
  }
}
