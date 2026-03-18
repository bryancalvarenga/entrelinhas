import { PrismaService } from '../database/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(profileId: string, dto: CreatePostDto): Promise<{
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
    }>;
    findById(id: string): Promise<{
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
    }>;
    delete(id: string, profileId: string): Promise<{
        deleted: boolean;
    }>;
    search(q: string): Promise<{
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
    buildPostSelect(): {
        readonly id: true;
        readonly content: true;
        readonly intention: true;
        readonly createdAt: true;
        readonly author: {
            readonly select: {
                readonly id: true;
                readonly name: true;
                readonly username: true;
                readonly avatarInitial: true;
                readonly avatarUrl: true;
            };
        };
        readonly _count: {
            readonly select: {
                readonly replies: true;
            };
        };
    };
}
