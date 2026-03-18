import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OnboardingDto } from './dto/onboarding.dto';
import { sanitizeText } from '../common/utils/sanitize';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async complete(profileId: string, dto: OnboardingDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) throw new BadRequestException('Perfil não encontrado.');
    if (profile.onboardingDone) {
      throw new ConflictException('Onboarding já foi concluído.');
    }

    const usernameInUse = await this.prisma.profile.findFirst({
      where: { username: dto.username, NOT: { id: profileId } },
    });

    if (usernameInUse) {
      throw new ConflictException('Este nome de usuário já está em uso.');
    }

    const cleanName = sanitizeText(dto.name);
    const avatarInitial = cleanName.charAt(0).toUpperCase();

    await this.prisma.profile.update({
      where: { id: profileId },
      data: {
        name: cleanName,
        username: sanitizeText(dto.username).toLowerCase(),
        bio: dto.bio ? sanitizeText(dto.bio) : null,
        avatarInitial,
        onboardingDone: true,
        interests: {
          createMany: {
            data: dto.interests.map((interest) => ({ interest })),
            skipDuplicates: true,
          },
        },
        intentions: {
          createMany: {
            data: dto.intentions.map((intention) => ({ intention })),
            skipDuplicates: true,
          },
        },
      },
    });

    return { done: true };
  }
}
