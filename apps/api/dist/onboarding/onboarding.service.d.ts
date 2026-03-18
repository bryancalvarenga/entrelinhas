import { PrismaService } from '../database/prisma.service';
import { OnboardingDto } from './dto/onboarding.dto';
export declare class OnboardingService {
    private prisma;
    constructor(prisma: PrismaService);
    complete(profileId: string, dto: OnboardingDto): Promise<{
        done: boolean;
    }>;
}
