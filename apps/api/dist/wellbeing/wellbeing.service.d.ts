import { PrismaService } from '../database/prisma.service';
import { UpdateWellbeingDto } from './dto/update-wellbeing.dto';
export declare class WellbeingService {
    private prisma;
    constructor(prisma: PrismaService);
    find(userId: string): Promise<{
        reducedNotifications: boolean;
        hideInteractions: boolean;
        limitedFeed: boolean;
        silentMode: boolean;
        darkMode: boolean;
    }>;
    update(userId: string, dto: UpdateWellbeingDto): Promise<{
        reducedNotifications: boolean;
        hideInteractions: boolean;
        limitedFeed: boolean;
        silentMode: boolean;
        darkMode: boolean;
    }>;
}
