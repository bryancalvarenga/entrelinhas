import { SavedPostsService } from './saved-posts.service';
export declare class SavedPostsController {
    private savedPostsService;
    constructor(savedPostsService: SavedPostsService);
    findAll(req: any): Promise<{
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
    getSaveStatus(postId: string, req: any): Promise<{
        saved: boolean;
    }>;
    save(postId: string, req: any): Promise<{
        saved: boolean;
    }>;
    unsave(postId: string, req: any): Promise<{
        saved: boolean;
    }>;
}
