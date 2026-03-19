import { MessagesService } from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    findOrCreate(req: any, dto: CreateConversationDto): Promise<{
        conversationId: string;
    }>;
    findAll(req: any): Promise<{
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
    hasUnread(req: any): Promise<{
        hasUnread: boolean;
    }>;
    findMessages(id: string, req: any): Promise<{
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
    canSend(id: string, req: any): Promise<{
        canSend: boolean;
        reason?: string;
        unlocksAt?: string;
    }>;
    send(id: string, req: any, dto: CreateMessageDto): Promise<{
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
    edit(id: string, messageId: string, req: any, dto: UpdateMessageDto): Promise<{
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
    softDelete(id: string, messageId: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
