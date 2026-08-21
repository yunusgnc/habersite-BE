"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var VideoUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoUploadService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const file_type_1 = require("file-type");
const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
const TARGET_MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIMES = new Set([
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
]);
let VideoUploadService = class VideoUploadService {
    static { VideoUploadService_1 = this; }
    logger = new common_1.Logger(VideoUploadService_1.name);
    uploadRoot;
    constructor() {
        this.uploadRoot = process.env.UPLOAD_DIR
            ? path.resolve(process.env.UPLOAD_DIR)
            : path.resolve(process.cwd(), 'uploads');
    }
    async uploadAndCompress(tenantId, file) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            throw new common_1.BadRequestException(`Dosya çok büyük (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB).`);
        }
        const detected = await (0, file_type_1.fileTypeFromBuffer)(file.buffer).catch(() => null);
        const effectiveMime = detected?.mime ?? file.mimetype;
        if (!ALLOWED_MIMES.has(effectiveMime)) {
            throw new common_1.BadRequestException(`Desteklenmeyen video formatı: ${effectiveMime}. .mp4 / .webm / .mov / .mkv kabul edilir.`);
        }
        const tenantDir = path.join(this.uploadRoot, 'videos', tenantId);
        await fs.promises.mkdir(tenantDir, { recursive: true });
        const stamp = Date.now();
        const rand = Math.random().toString(36).slice(2, 8);
        const tempPath = path.join(tenantDir, `.tmp-${stamp}-${rand}`);
        const finalName = `${stamp}-${rand}.mp4`;
        const finalPath = path.join(tenantDir, finalName);
        await fs.promises.writeFile(tempPath, file.buffer);
        try {
            if (!ffmpeg_static_1.default) {
                this.logger.warn('ffmpeg-static binary not found — saving raw upload.');
                await fs.promises.rename(tempPath, finalPath);
            }
            else {
                await this.transcodeToH264(ffmpeg_static_1.default, tempPath, finalPath);
                await fs.promises.unlink(tempPath).catch(() => { });
            }
            const stat = await fs.promises.stat(finalPath);
            const durationSec = await this.probeDuration(finalPath).catch(() => undefined);
            return {
                url: `/uploads/videos/${tenantId}/${finalName}`,
                absolutePath: finalPath,
                size: stat.size,
                durationSec,
            };
        }
        catch (err) {
            await fs.promises.unlink(tempPath).catch(() => { });
            await fs.promises.unlink(finalPath).catch(() => { });
            this.logger.error('Video upload failed', err);
            throw new common_1.InternalServerErrorException('Video işlenirken bir hata oluştu.');
        }
    }
    transcodeToH264(ffmpeg, input, output) {
        return new Promise((resolve, reject) => {
            const args = [
                '-y',
                '-i', input,
                '-c:v', 'libx264',
                '-preset', 'veryfast',
                '-crf', '28',
                '-pix_fmt', 'yuv420p',
                '-vf', "scale='min(1280,iw)':'-2'",
                '-c:a', 'aac',
                '-b:a', '128k',
                '-movflags', '+faststart',
                '-max_muxing_queue_size', '9999',
                output,
            ];
            const proc = (0, child_process_1.spawn)(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] });
            let stderr = '';
            proc.stderr.on('data', (d) => {
                stderr += d.toString();
            });
            proc.once('error', reject);
            proc.once('exit', (code) => {
                if (code === 0)
                    resolve();
                else
                    reject(new Error(`ffmpeg exit ${code}: ${stderr.slice(-500)}`));
            });
        });
    }
    probeDuration(file) {
        if (!ffmpeg_static_1.default)
            return Promise.resolve(undefined);
        return new Promise((resolve) => {
            const proc = (0, child_process_1.spawn)(ffmpeg_static_1.default, ['-i', file], {
                stdio: ['ignore', 'ignore', 'pipe'],
            });
            let stderr = '';
            proc.stderr.on('data', (d) => (stderr += d.toString()));
            proc.once('exit', () => {
                const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
                if (!m)
                    return resolve(undefined);
                const h = Number(m[1]);
                const min = Number(m[2]);
                const s = Number(m[3]);
                resolve(Math.round(h * 3600 + min * 60 + s));
            });
            proc.once('error', () => resolve(undefined));
        });
    }
    static LIMITS = {
        maxUploadBytes: MAX_UPLOAD_BYTES,
        targetMaxBytes: TARGET_MAX_BYTES,
        allowedMimes: [...ALLOWED_MIMES],
    };
};
exports.VideoUploadService = VideoUploadService;
exports.VideoUploadService = VideoUploadService = VideoUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VideoUploadService);
//# sourceMappingURL=video-upload.service.js.map