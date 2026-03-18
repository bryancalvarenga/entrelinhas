import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    create(req: any, dto: CreatePostDto): Promise<{
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
    canPost(req: any): Promise<{
        canPost: boolean;
        nextPostAt: string;
    }>;
    search(q: string): never[] | Promise<{
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
    findRandom(): Promise<{
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
    } | null>;
    findOne(id: string): Promise<{
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
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
