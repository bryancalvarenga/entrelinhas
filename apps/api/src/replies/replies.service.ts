import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { sanitizeText } from '../common/utils/sanitize';

const AUTHOR_SELECT = {
  id: true,
  name: true,
  username: true,
  avatarInitial: true,
  avatarUrl: true,
} as const;

@Injectable()
export class RepliesService {
  constructor(private prisma: PrismaService) {}

  async findByPost(postId: string) {
    const postExists = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) throw new NotFoundException('Registro não encontrado.');

    return this.prisma.reply.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: { select: AUTHOR_SELECT },
      },
    });
  }

  async create(postId: string, profileId: string, dto: CreateReplyDto) {
    const postExists = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!postExists) throw new NotFoundException('Registro não encontrado.');

    const reply = await this.prisma.reply.create({
      data: {
        postId,
        authorId: profileId,
        content: sanitizeText(dto.content),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: { select: AUTHOR_SELECT },
      },
    });

    // Notificar o autor do post se for outra pessoa respondendo
    if (postExists.authorId !== profileId) {
      await this.prisma.notification.create({
        data: {
          recipientId: postExists.authorId,
          type: 'new_reply',
          referenceId: postId,
        },
      });
    }

    return reply;
  }

  async delete(replyId: string, profileId: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId },
      select: { authorId: true },
    });

    if (!reply) throw new NotFoundException('Resposta não encontrada.');
    if (reply.authorId !== profileId) {
      throw new ForbiddenException('Você não pode remover esta resposta.');
    }

    await this.prisma.reply.delete({ where: { id: replyId } });
    return { deleted: true };
  }
}
