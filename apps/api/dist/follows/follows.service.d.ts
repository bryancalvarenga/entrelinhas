import { PrismaService } from '../database/prisma.service';
export declare class FollowsService {
    private prisma;
    constructor(prisma: PrismaService);
    getStatus(username: string, followerId: string): Promise<{
        following: boolean;
    }>;
    follow(username: string, followerId: string): Promise<{
        following: boolean;
    }>;
    unfollow(username: string, followerId: string): Promise<{
        following: boolean;
    }>;
    private findProfileByUsername;
}
