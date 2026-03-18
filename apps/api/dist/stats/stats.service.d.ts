import { PrismaService } from '../database/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        users: number;
        posts: number;
    }>;
}
