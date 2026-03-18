import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findUnread(req: any): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.NotificationType;
        referenceId: string | null;
    }[]>;
    markAllRead(req: any): Promise<{
        done: boolean;
    }>;
    markOneRead(id: string, req: any): Promise<{
        done: boolean;
    }>;
}
