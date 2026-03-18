import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Touch é uma interação estritamente privada.
// Nenhum contador é exposto — nem para o autor do post, nem em endpoints públicos.
// O único dado retornado é { touched: boolean } para o próprio usuário.

@Injectable()
export class TouchesService {
  constructor(private prisma: PrismaService) {}

  async getStatus(postId: string, profileId: string): Promise<{ touched: boolean }> {
    await this.assertPostExists(postId);

    const touch = await this.prisma.touch.findUnique({
      where: { profileId_postId: { profileId, postId } },
      select: { profileId: true },
    });

    return { touched: !!touch };
  }

  async touch(postId: string, profileId: string): Promise<{ touched: boolean }> {
    await this.assertPostExists(postId);

    await this.prisma.touch.upsert({
      where: { profileId_postId: { profileId, postId } },
      create: { profileId, postId },
      update: {},
    });

    return { touched: true };
  }

  async untouch(postId: string, profileId: string): Promise<{ touched: boolean }> {
    await this.assertPostExists(postId);

    await this.prisma.touch.deleteMany({
      where: { profileId, postId },
    });

    return { touched: false };
  }

  private async assertPostExists(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Registro não encontrado.');
  }
}
