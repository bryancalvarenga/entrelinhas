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
exports.TouchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let TouchesService = class TouchesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatus(postId, profileId) {
        await this.assertPostExists(postId);
        const touch = await this.prisma.touch.findUnique({
            where: { profileId_postId: { profileId, postId } },
            select: { profileId: true },
        });
        return { touched: !!touch };
    }
    async touch(postId, profileId) {
        await this.assertPostExists(postId);
        await this.prisma.touch.upsert({
            where: { profileId_postId: { profileId, postId } },
            create: { profileId, postId },
            update: {},
        });
        return { touched: true };
    }
    async untouch(postId, profileId) {
        await this.assertPostExists(postId);
        await this.prisma.touch.deleteMany({
            where: { profileId, postId },
        });
        return { touched: false };
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
exports.TouchesService = TouchesService;
exports.TouchesService = TouchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TouchesService);
//# sourceMappingURL=touches.service.js.map