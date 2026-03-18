import { PrismaService } from '../database/prisma.service';
export declare class TouchesService {
    private prisma;
    constructor(prisma: PrismaService);
    getStatus(postId: string, profileId: string): Promise<{
        touched: boolean;
    }>;
    touch(postId: string, profileId: string): Promise<{
        touched: boolean;
    }>;
    untouch(postId: string, profileId: string): Promise<{
        touched: boolean;
    }>;
    private assertPostExists;
}
