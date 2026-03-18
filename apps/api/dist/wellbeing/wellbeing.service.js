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
exports.WellbeingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let WellbeingService = class WellbeingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async find(userId) {
        const settings = await this.prisma.wellbeingSettings.findUnique({
            where: { userId },
            select: {
                reducedNotifications: true,
                hideInteractions: true,
                limitedFeed: true,
                silentMode: true,
                darkMode: true,
            },
        });
        if (!settings)
            throw new common_1.NotFoundException('Configurações não encontradas.');
        return settings;
    }
    async update(userId, dto) {
        return this.prisma.wellbeingSettings.update({
            where: { userId },
            data: dto,
            select: {
                reducedNotifications: true,
                hideInteractions: true,
                limitedFeed: true,
                silentMode: true,
                darkMode: true,
            },
        });
    }
};
exports.WellbeingService = WellbeingService;
exports.WellbeingService = WellbeingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WellbeingService);
//# sourceMappingURL=wellbeing.service.js.map