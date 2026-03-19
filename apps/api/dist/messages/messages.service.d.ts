import { PrismaService } from '../database/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    findOrCreate(myProfileId: string, recipientUsername: string): Promise<{
        conversationId: string;
    }>;
    findAll(profileId: string): Promise<{
        id: string;
        createdAt: Date;
        otherProfile: {
            id: string;
            name: string;
            username: string;
            avatarInitial: string;
            avatarUrl: string | null;
        };
        lastMessage: {
            id: string;
            content: string;
            sentAt: Date;
            senderId: string;
        };
        unread: boolean;
    }[]>;
    hasUnreadMessages(profileId: string): Promise<{
        hasUnread: boolean;
    }>;
    findMessages(conversationId: string, profileId: string): Promise<{
        conversationId: string;
        otherProfile: {
            id: string;
            name: string;
            username: string;
            avatarInitial: string;
            avatarUrl: string | null;
        } | null;
        messages: {
            id: string;
            content: string;
            sentAt: Date;
            senderId: string;
            editedAt: Date | null;
            sender: {
                id: string;
                name: string;
                username: string;
                avatarInitial: string;
                avatarUrl: string | null;
            };
        }[];
        canSend: boolean;
        unlocksAt: string | null;
    }>;
    canSend(conversationId: string, senderId: string): Promise<{
        canSend: boolean;
        reason?: string;
        unlocksAt?: string;
    }>;
    send(conversationId: string, senderId: string, content: string): Promise<{
        id: string;
        content: string;
        sentAt: Date;
        senderId: string;
        editedAt: Date | null;
        sender: {
            id: string;
            name: string;
            username: string;
            avatarInitial: string;
            avatarUrl: string | null;
        };
    }>;
    edit(conversationId: string, messageId: string, senderId: string, content: string): Promise<{
        id: string;
        content: string;
        sentAt: Date;
        senderId: string;
        editedAt: Date | null;
        sender: {
            id: string;
            name: string;
            username: string;
            avatarInitial: string;
            avatarUrl: string | null;
        };
    }>;
    softDelete(conversationId: string, messageId: string, senderId: string): Promise<{
        deleted: boolean;
    }>;
}
