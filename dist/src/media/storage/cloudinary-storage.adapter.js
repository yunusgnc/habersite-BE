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
var CloudinaryStorageAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryStorageAdapter = void 0;
const fs = __importStar(require("fs"));
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
let CloudinaryStorageAdapter = CloudinaryStorageAdapter_1 = class CloudinaryStorageAdapter {
    logger = new common_1.Logger(CloudinaryStorageAdapter_1.name);
    sdk;
    async getSdk() {
        if (this.sdk)
            return this.sdk;
        let mod;
        try {
            mod = await import('cloudinary');
        }
        catch {
            throw new Error('CloudinaryStorageAdapter requires "cloudinary" — run `npm i cloudinary`');
        }
        const { v2 } = mod;
        v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        this.sdk = v2;
        return this.sdk;
    }
    async put(opts) {
        const sdk = await this.getSdk();
        const folder = `habersite/${opts.tenantId}`;
        const os = await import('os');
        let uploadPath;
        let tempCreated = false;
        if (opts.sourcePath) {
            uploadPath = opts.sourcePath;
        }
        else if (opts.buffer) {
            const tmp = `${os.tmpdir()}/gp-upload-${Date.now()}-${(0, crypto_1.randomUUID)()}`;
            fs.writeFileSync(tmp, opts.buffer);
            uploadPath = tmp;
            tempCreated = true;
        }
        else {
            throw new Error('CloudinaryStorageAdapter: buffer veya sourcePath gerekli');
        }
        const result = await sdk.uploader.upload(uploadPath, {
            folder,
            resource_type: opts.mimeType.startsWith('video/') ? 'video' : 'image',
        });
        if (tempCreated || opts.sourcePath) {
            try {
                fs.unlinkSync(uploadPath);
            }
            catch { }
        }
        return {
            url: result.secure_url,
            key: result.public_id,
        };
    }
    async delete(key) {
        try {
            const sdk = await this.getSdk();
            await sdk.uploader.destroy(key);
        }
        catch (e) {
            this.logger.warn(`Cloudinary delete failed for ${key}: ${e?.message ?? e}`);
        }
    }
};
exports.CloudinaryStorageAdapter = CloudinaryStorageAdapter;
exports.CloudinaryStorageAdapter = CloudinaryStorageAdapter = CloudinaryStorageAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], CloudinaryStorageAdapter);
//# sourceMappingURL=cloudinary-storage.adapter.js.map