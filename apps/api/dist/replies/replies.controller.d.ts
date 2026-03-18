import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
export declare class RepliesController {
    private repliesService;
    constructor(repliesService: RepliesService);
    findAll(postId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        author: {
            id: string;
            name: string;
            username: string;
            avatarInitial: string;
            avatarUrl: string | null;
        };
    }[]>;
    create(postId: string, req: any, dto: CreateReplyDto): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        author: {
            id: string;
            name: string;
            username: string;
            avatarInitial: string;
            avatarUrl: string | null;
        };
    }>;
    remove(replyId: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
