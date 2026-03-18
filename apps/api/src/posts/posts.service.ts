import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  async create(profileId: string, dto: CreatePostDto) {
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
