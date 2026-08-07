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
var S3StorageAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageAdapter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let S3StorageAdapter = S3StorageAdapter_1 = class S3StorageAdapter {
    logger = new common_1.Logger(S3StorageAdapter_1.name);
    client;
    async getClient() {
        if (this.client)
            return this.client;
        let mod;
        try {
            mod = await import('@aws-sdk/client-s3');
        }
        catch (e) {
            throw new Error('S3StorageAdapter requires "@aws-sdk/client-s3" — run `npm i @aws-sdk/client-s3`');
        }
        const { S3Client } = mod;
        this.client = new S3Client({
            region: process.env.S3_REGION ?? 'auto',
            endpoint: process.env.S3_ENDPOINT || undefined,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
            },
        });
        return this.client;
    }
    async put(opts) {
        const { PutObjectCommand } = await import('@aws-sdk/client-s3');
        const client = await this.getClient();
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const ext = path.extname(opts.filename);
        const key = `uploads/${opts.tenantId}/${year}/${month}/${(0, crypto_1.randomUUID)()}${ext}`;
        const body = opts.buffer ?? (opts.sourcePath ? fs.createReadStream(opts.sourcePath) : undefined);
        if (!body) {
            throw new Error('S3StorageAdapter: buffer veya sourcePath gerekli');
        }
        await client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: body,
            ContentType: opts.mimeType,
            ACL: 'public-read',
        }));
        if (opts.sourcePath) {
            try {
                fs.unlinkSync(opts.sourcePath);
            }
            catch { }
        }
        const url = process.env.S3_PUBLIC_URL
            ? `${process.env.S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`
            : `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
        return { url, key };
    }
    async delete(key) {
        try {
            const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
            const client = await this.getClient();
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key,
            }));
        }
        catch (e) {
            this.logger.warn(`S3 delete failed for ${key}: ${e?.message ?? e}`);
        }
    }
};
exports.S3StorageAdapter = S3StorageAdapter;
exports.S3StorageAdapter = S3StorageAdapter = S3StorageAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], S3StorageAdapter);
//# sourceMappingURL=s3-storage.adapter.js.map