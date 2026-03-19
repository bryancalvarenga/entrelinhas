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
exports.FollowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let FollowsService = class FollowsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatus(username, followerId) {
        const target = await this.findProfileByUsername(username);
        const follow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId: target.id,
                },
            },
            select: { followerId: true },
        });
        return { following: !!follow };
    }
    async follow(username, followerId) {
        const target = await this.findProfileByUsername(username);
        if (target.id === followerId) {
            throw new common_1.BadRequestException('Você não pode se seguir.');
        }
        const existing = await this.prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId: target.id } },
            select: { followerId: true },
        });
        if (!existing) {
            await this.prisma.follow.create({
                data: { followerId, followingId: target.id },
            });
            await this.prisma.notification.create({
                data: {
                    recipientId: target.id,
                    type: 'new_follower',
                    referenceId: followerId,
                },
            });
        }
        return { following: true };
    }
    async unfollow(username, followerId) {
        const target = await this.findProfileByUsername(username);
        await this.prisma.follow.deleteMany({
            where: { followerId, followingId: target.id },
        });
        return { following: false };
    }
    async findProfileByUsername(username) {
        const profile = await this.prisma.profile.findUnique({
            where: { username },
            select: { id: true },
        });
        if (!profile)
            throw new common_1.NotFoundException('Perfil não encontrado.');
        return profile;
    }
};
exports.FollowsService = FollowsService;
exports.FollowsService = FollowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowsService);
//# sourceMappingURL=follows.service.js.map