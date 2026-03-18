import { FollowsService } from './follows.service';
export declare class FollowsController {
    private followsService;
    constructor(followsService: FollowsService);
    getStatus(username: string, req: any): Promise<{
        following: boolean;
    }>;
    follow(username: string, req: any): Promise<{
        following: boolean;
    }>;
    unfollow(username: string, req: any): Promise<{
        following: boolean;
    }>;
}
