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
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const videos_service_1 = require("./videos.service");
const video_upload_service_1 = require("./video-upload.service");
const create_video_dto_1 = require("./dto/create-video.dto");
const update_video_dto_1 = require("./dto/update-video.dto");
const query_videos_dto_1 = require("./dto/query-videos.dto");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let VideosController = class VideosController {
    videosService;
    videoUploadService;
    constructor(videosService, videoUploadService) {
        this.videosService = videosService;
        this.videoUploadService = videoUploadService;
    }
    findAll(tenantId, query) {
        return this.videosService.findAll(tenantId, query);
    }
    getLimits() {
        return video_upload_service_1.VideoUploadService.LIMITS;
    }
    findOne(tenantId, id) {
        return this.videosService.findOne(tenantId, id);
    }
    findBySlug(tenantId, slug) {
        return this.videosService.findBySlug(tenantId, slug);
    }
    async upload(tenantId, file) {
        const result = await this.videoUploadService.uploadAndCompress(tenantId, file);
        return {
            url: result.url,
            size: result.size,
            duration: result.durationSec,
        };
    }
    create(tenantId, dto) {
        return this.videosService.create(tenantId, dto);
    }
    update(tenantId, id, dto) {
        return this.videosService.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.videosService.remove(tenantId, id);
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_videos_dto_1.QueryVideosDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('limits'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "getLimits", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('REPORTER'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 200 * 1024 * 1024 },
    })),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('REPORTER'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_video_dto_1.CreateVideoDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('REPORTER'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_video_dto_1.UpdateVideoDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('REPORTER'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "remove", null);
exports.VideosController = VideosController = __decorate([
    (0, common_1.Controller)('api/videos'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [videos_service_1.VideosService,
        video_upload_service_1.VideoUploadService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map