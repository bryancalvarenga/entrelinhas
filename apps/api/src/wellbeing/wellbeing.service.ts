import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateWellbeingDto } from './dto/update-wellbeing.dto';

@Injectable()
export class WellbeingService {
  constructor(private prisma: PrismaService) {}

  async find(userId: string) {
    const settings = await this.prisma.wellbeingSettings.findUnique({
      where: { userId },
      select: {
        reducedNotifications: true,
        hideInteractions: true,
        limitedFeed: true,
        silentMode: true,
        darkMode: true,
      },
    });

    if (!settings) throw new NotFoundException('Configurações não encontradas.');

    return settings;
  }

  async update(userId: string, dto: UpdateWellbeingDto) {
    return this.prisma.wellbeingSettings.update({
      where: { userId },
      data: dto,
      select: {
        reducedNotifications: true,
        hideInteractions: true,
        limitedFeed: true,
        silentMode: true,
        darkMode: true,
      },
    });
  }
}
