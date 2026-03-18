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
exports.RepliesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const replies_service_1 = require("./replies.service");
const create_reply_dto_1 = require("./dto/create-reply.dto");
let RepliesController = class RepliesController {
    constructor(repliesService) {
        this.repliesService = repliesService;
    }
    findAll(postId) {
        return this.repliesService.findByPost(postId);
    }
    create(postId, req, dto) {
        return this.repliesService.create(postId, req.user.profileId, dto);
    }
    remove(replyId, req) {
        return this.repliesService.delete(replyId, req.user.profileId);
    }
};
exports.RepliesController = RepliesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RepliesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_reply_dto_1.CreateReplyDto]),
    __metadata("design:returntype", void 0)
], RepliesController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':replyId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('replyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RepliesController.prototype, "remove", null);
exports.RepliesController = RepliesController = __decorate([
    (0, common_1.Controller)('posts/:postId/replies'),
    __metadata("design:paramtypes", [replies_service_1.RepliesService])
], RepliesController);
//# sourceMappingURL=replies.controller.js.map