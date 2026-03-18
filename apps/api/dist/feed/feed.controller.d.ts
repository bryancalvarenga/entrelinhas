import { FeedService } from './feed.service';
export declare class FeedController {
    private feedService;
    constructor(feedService: FeedService);
    getFeed(req: any): Promise<{
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
}
