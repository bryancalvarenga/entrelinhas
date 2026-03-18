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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const DAILY_POST_LIMIT = 1;
const prisma_service_1 = require("../database/prisma.service");
const AUTHOR_SELECT = {
    id: true,
    name: true,
    username: true,
    avatarInitial: true,
    avatarUrl: true,
};
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canPost(profileId) {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);
        const count = await this.prisma.post.count({
            where: {
                authorId: profileId,
                createdAt: { gte: startOfDay },
            },
        });
        const canPost = count < DAILY_POST_LIMIT;
        const nextPostAt = new Date();
        nextPostAt.setUTCHours(24, 0, 0, 0);
        return { canPost, nextPostAt: nextPostAt.toISOString() };
    }
    async create(profileId, dto) {
        const { canPost } = await this.canPost(profileId);
        if (!canPost) {
            throw new common_1.ForbiddenException('Você já publicou hoje. Cada dia tem espaço para um registro — volte amanhã.');
        }
        const post = await this.prisma.post.create({
            data: {
                authorId: profileId,
                content: dto.content,
                intention: dto.intention,
            },
            select: {
                id: true,
                content: true,
                intention: true,
                createdAt: true,
                author: { select: AUTHOR_SELECT },
                _count: { select: { replies: true } },
            },
        });
        return post;
    }
    async findById(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            select: {
                id: true,
                content: true,
                intention: true,
                createdAt: true,
                author: { select: AUTHOR_SELECT },
                _count: { select: { replies: true } },
            },
        });
        if (!post)
            throw new common_1.NotFoundException('Registro não encontrado.');
        return post;
    }
    async delete(id, profileId) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Registro não encontrado.');
        if (post.authorId !== profileId) {
            throw new common_1.ForbiddenException('Você não pode remover este registro.');
        }
        await this.prisma.post.delete({ where: { id } });
        return { deleted: true };
    }
    async search(q) {
        return this.prisma.post.findMany({
            where: {
                content: { contains: q, mode: 'insensitive' },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                content: true,
                intention: true,
                createdAt: true,
                author: { select: AUTHOR_SELECT },
                _count: { select: { replies: true } },
            },
        });
    }
    async findRandom() {
        const count = await this.prisma.post.count();
        if (count === 0)
            return null;
        const skip = Math.floor(Math.random() * count);
        const posts = await this.prisma.post.findMany({
            take: 1,
            skip,
            select: {
                id: true,
                content: true,
                intention: true,
                createdAt: true,
                author: { select: AUTHOR_SELECT },
                _count: { select: { replies: true } },
            },
        });
        return posts[0] ?? null;
    }
    buildPostSelect() {
        return {
            id: true,
            content: true,
            intention: true,
            createdAt: true,
            author: { select: AUTHOR_SELECT },
            _count: { select: { replies: true } },
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map