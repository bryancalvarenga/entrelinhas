"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepliesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const AUTHOR_SELECT = {
    id: true,
    name: true,
    username: true,
    avatarInitial: true,
    avatarUrl: true,
};
let RepliesService = class RepliesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByPost(postId) {
        const postExists = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { id: true },
        });
        if (!postExists)
            throw new common_1.NotFoundException('Registro não encontrado.');
        return this.prisma.reply.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: { select: AUTHOR_SELECT },
            },
        });
    }
    async create(postId, profileId, dto) {
        const postExists = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { id: true, authorId: true },
        });
        if (!postExists)
            throw new common_1.NotFoundException('Registro não encontrado.');
        const reply = await this.prisma.reply.create({
            data: {
                postId,
                authorId: profileId,
                content: dto.content,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: { select: AUTHOR_SELECT },
            },
        });
        if (postExists.authorId !== profileId) {
            await this.prisma.notification.create({
                data: {
                    recipientId: postExists.authorId,
                    type: 'new_reply',
                    referenceId: postId,
                },
            });
        }
        return reply;
    }
    async delete(replyId, profileId) {
        const reply = await this.prisma.reply.findUnique({
            where: { id: replyId },
            select: { authorId: true },
        });
        if (!reply)
            throw new common_1.NotFoundException('Resposta não encontrada.');
        if (reply.authorId !== profileId) {
            throw new common_1.ForbiddenException('Você não pode remover esta resposta.');
        }
        await this.prisma.reply.delete({ where: { id: replyId } });
        return { deleted: true };
    }
};
exports.RepliesService = RepliesService;
exports.RepliesService = RepliesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RepliesService);
//# sourceMappingURL=replies.service.js.map