import { PrismaService } from '../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findUnread(profileId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        referenceId: string | null;
    }[]>;
    markAllRead(profileId: string): Promise<{
        done: boolean;
    }>;
    markOneRead(id: string, profileId: string): Promise<{
        done: boolean;
    }>;
}
