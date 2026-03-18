import { PrismaService } from '../database/prisma.service';
export declare class SavedPostsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(profileId: string): Promise<{
        savedAt: Date;
        id: string;
        content: string;
        intention: import(".prisma/client").$Enums.PostIntention;
        createdAt: Date;
        author: {
            id: string;
            name: string;
            username: string;
            avatarInitial: string;
            avatarUrl: string | null;
        };
        _count: {
            replies: number;
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
