import { SavedPostsService } from './saved-posts.service';
export declare class SavedPostsController {
    private savedPostsService;
    constructor(savedPostsService: SavedPostsService);
    findAll(req: any): Promise<{
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
