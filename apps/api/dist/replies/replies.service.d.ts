import { PrismaService } from '../database/prisma.service';
import { CreateReplyDto } from './dto/create-reply.dto';
export declare class RepliesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByPost(postId: string): Promise<{
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
    create(postId: string, profileId: string, dto: CreateReplyDto): Promise<{
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
    delete(replyId: string, profileId: string): Promise<{
        deleted: boolean;
    }>;
}
