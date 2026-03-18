import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesService {
    private prisma;
    constructor(prisma: PrismaService);
    search(q: string): Promise<{
        id: string;
        name: string;
        username: string;
        bio: string | null;
        avatarInitial: string;
        avatarUrl: string | null;
        joinedAt: Date;
        interests: {
            interest: import(".prisma/client").$Enums.Interest;
        }[];
    }[]>;
    findByUsername(username: string): Promise<{
        id: string;
        name: string;
        username: string;
        bio: string | null;
        avatarInitial: string;
        avatarUrl: string | null;
        joinedAt: Date;
        interests: {
            interest: import(".prisma/client").$Enums.Interest;
        }[];
    }>;
    findMe(profileId: string): Promise<{
        id: string;
        name: string;
        username: string;
        bio: string | null;
        avatarInitial: string;
        avatarUrl: string | null;
        joinedAt: Date;
        onboardingDone: boolean;
        interests: {
            interest: import(".prisma/client").$Enums.Interest;
        }[];
    }>;
    update(profileId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        username: string;
        bio: string | null;
        avatarInitial: string;
        avatarUrl: string | null;
        joinedAt: Date;
        interests: {
            interest: import(".prisma/client").$Enums.Interest;
        }[];
    }>;
    getMyPosts(profileId: string): Promise<{
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
    getPostsByUsername(username: string): Promise<{
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
}
