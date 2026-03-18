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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPostsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const saved_posts_service_1 = require("./saved-posts.service");
let SavedPostsController = class SavedPostsController {
    constructor(savedPostsService) {
        this.savedPostsService = savedPostsService;
    }
    findAll(req) {
        return this.savedPostsService.findAll(req.user.profileId);
    }
    getSaveStatus(postId, req) {
        return this.savedPostsService.getStatus(postId, req.user.profileId);
    }
    save(postId, req) {
        return this.savedPostsService.save(postId, req.user.profileId);
    }
    unsave(postId, req) {
        return this.savedPostsService.unsave(postId, req.user.profileId);
    }
};
exports.SavedPostsController = SavedPostsController;
__decorate([
    (0, common_1.Get)('saved'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('posts/:postId/save'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "getSaveStatus", null);
__decorate([
    (0, common_1.Post)('posts/:postId/save'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)('posts/:postId/save'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SavedPostsController.prototype, "unsave", null);
exports.SavedPostsController = SavedPostsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [saved_posts_service_1.SavedPostsService])
], SavedPostsController);
//# sourceMappingURL=saved-posts.controller.js.map