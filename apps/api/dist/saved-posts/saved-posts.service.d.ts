import { PrismaService } from '../database/prisma.service';
export declare class SavedPostsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(profileId: string): Promise<{
        savedAt: Date;
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
    }[]>;
    save(postId: string, profileId: string): Promise<{
        saved: boolean;
    }>;
    unsave(postId: string, profileId: string): Promise<{
        saved: boolean;
    }>;
    getStatus(postId: string, profileId: string): Promise<{
        saved: boolean;
    }>;
    private assertPostExists;
}
