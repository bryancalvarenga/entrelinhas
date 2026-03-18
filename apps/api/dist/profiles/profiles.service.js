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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const PUBLIC_PROFILE_SELECT = {
    id: true,
    name: true,
    username: true,
    bio: true,
    avatarInitial: true,
    avatarUrl: true,
    joinedAt: true,
    interests: { select: { interest: true } },
};
const PROFILE_POST_SELECT = {
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
let ProfilesService = class ProfilesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(q) {
        return this.prisma.profile.findMany({
            where: {
                onboardingDone: true,
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { username: { contains: q, mode: 'insensitive' } },
                    { bio: { contains: q, mode: 'insensitive' } },
                ],
            },
            take: 20,
            select: PUBLIC_PROFILE_SELECT,
        });
    }
    async findByUsername(username) {
        const profile = await this.prisma.profile.findUnique({
            where: { username },
            select: PUBLIC_PROFILE_SELECT,
        });
        if (!profile)
            throw new common_1.NotFoundException('Perfil não encontrado.');
        return profile;
    }
    async findMe(profileId) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            select: {
                ...PUBLIC_PROFILE_SELECT,
                onboardingDone: true,
            },
        });
        if (!profile)
            throw new common_1.NotFoundException('Perfil não encontrado.');
        return profile;
    }
    async update(profileId, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name.trim();
            data.avatarInitial = dto.name.trim().charAt(0).toUpperCase();
        }
        if (dto.bio !== undefined)
            data.bio = dto.bio?.trim() ?? null;
        if (dto.avatarUrl !== undefined)
            data.avatarUrl = dto.avatarUrl?.trim() || null;
        return this.prisma.profile.update({
            where: { id: profileId },
            data,
            select: PUBLIC_PROFILE_SELECT,
        });
    }
    async getMyPosts(profileId) {
        return this.prisma.post.findMany({
            where: { authorId: profileId },
            orderBy: { createdAt: 'desc' },
            select: PROFILE_POST_SELECT,
        });
    }
    async getPostsByUsername(username) {
        const profile = await this.prisma.profile.findUnique({
            where: { username },
            select: { id: true },
        });
        if (!profile)
            throw new common_1.NotFoundException('Perfil não encontrado.');
        return this.prisma.post.findMany({
            where: { authorId: profile.id },
            orderBy: { createdAt: 'desc' },
            select: PROFILE_POST_SELECT,
        });
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map