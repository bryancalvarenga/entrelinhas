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
exports.SavedPostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const POST_SELECT = {
    id: true,
    content: true,
    intention: true,
    createdAt: true,
    author: {
        select: {
            id: true,
            name: true,
            username: true,
            avatarInitial: true,
            avatarUrl: true,
        },
    },
    _count: { select: { replies: true } },
};
let SavedPostsService = class SavedPostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(profileId) {
        const saved = await this.prisma.savedPost.findMany({
            where: { profileId },
            orderBy: { savedAt: 'desc' },
            select: {
                savedAt: true,
                post: { select: POST_SELECT },
            },
        });
        return saved.map(({ savedAt, post }) => ({ ...post, savedAt }));
    }
    async save(postId, profileId) {
        await this.assertPostExists(postId);
        await this.prisma.savedPost.upsert({
            where: { profileId_postId: { profileId, postId } },
            create: { profileId, postId },
            update: {},
        });
        return { saved: true };
    }
    async unsave(postId, profileId) {
        await this.assertPostExists(postId);
        await this.prisma.savedPost.deleteMany({
            where: { profileId, postId },
        });
        return { saved: false };
    }
    async getStatus(postId, profileId) {
        const entry = await this.prisma.savedPost.findUnique({
            where: { profileId_postId: { profileId, postId } },
            select: { profileId: true },
        });
        return { saved: !!entry };
    }
    async assertPostExists(postId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { id: true },
        });
        if (!post)
            throw new common_1.NotFoundException('Registro não encontrado.');
    }
};
exports.SavedPostsService = SavedPostsService;
exports.SavedPostsService = SavedPostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavedPostsService);
//# sourceMappingURL=saved-posts.service.js.map