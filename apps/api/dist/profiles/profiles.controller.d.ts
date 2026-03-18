import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private profilesService;
    constructor(profilesService: ProfilesService);
    getMe(req: any): Promise<{
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
    updateMe(req: any, dto: UpdateProfileDto): Promise<{
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
    getMyPosts(req: any): Promise<{
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
    }[]> | never[];
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
}
