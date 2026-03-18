import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { sanitizeText, sanitizeUrl } from '../common/utils/sanitize';

// Campos públicos de um perfil — nunca incluir contagem de seguidores
const PUBLIC_PROFILE_SELECT = {
  id: true,
  name: true,
  username: true,
  bio: true,
  avatarInitial: true,
  avatarUrl: true,
  joinedAt: true,
  interests: { select: { interest: true } },
} as const;

// Posts retornados pelo perfil — sem touchedCount, sem saveCount
const PROFILE_POST_SELECT = {
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
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async search(q: string) {
    return this.prisma.profile.findMany({
      where: {
        onboardingDone: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
          { bio: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
      select: PUBLIC_PROFILE_SELECT,
    });
  }

  async findByUsername(username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      select: PUBLIC_PROFILE_SELECT,
    });

    if (!profile) throw new NotFoundException('Perfil não encontrado.');

    return profile;
  }

  async findMe(profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        ...PUBLIC_PROFILE_SELECT,
        onboardingDone: true,
      },
    });

    if (!profile) throw new NotFoundException('Perfil não encontrado.');

    return profile;
  }

  async update(profileId: string, dto: UpdateProfileDto) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) {
      const name = sanitizeText(dto.name);
      data.name = name;
      data.avatarInitial = name.charAt(0).toUpperCase();
    }
    if (dto.bio !== undefined) data.bio = dto.bio ? sanitizeText(dto.bio) : null;
    if (dto.avatarUrl !== undefined) data.avatarUrl = sanitizeUrl(dto.avatarUrl);

    return this.prisma.profile.update({
      where: { id: profileId },
      data,
      select: PUBLIC_PROFILE_SELECT,
    });
  }

  async getMyPosts(profileId: string) {
    return this.prisma.post.findMany({
      where: { authorId: profileId },
      orderBy: { createdAt: 'desc' },
      select: PROFILE_POST_SELECT,
    });
  }

  async getPostsByUsername(username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!profile) throw new NotFoundException('Perfil não encontrado.');

    return this.prisma.post.findMany({
      where: { authorId: profile.id },
      orderBy: { createdAt: 'desc' },
      select: PROFILE_POST_SELECT,
    });
  }
}
