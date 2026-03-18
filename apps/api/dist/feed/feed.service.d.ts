import { PrismaService } from '../database/prisma.service';
export declare class FeedService {
    private prisma;
    constructor(prisma: PrismaService);
    getFeed(profileId: string): Promise<{
        posts: {
            touched: boolean;
            saved: boolean;
            id: string;
            createdAt: Date;
            _count: {
                replies: number;
            };
            content: string;
            intention: import(".prisma/client").$Enums.PostIntention;
            author: {
                id: string;
                name: string;
                username: string;
                avatarInitial: string;
                avatarUrl: string | null;
            };
        }[];
        total: number;
    }>;
    private getUserIdFromProfile;
}
