type CompressResult = {
    url: string;
    absolutePath: string;
    size: number;
    durationSec?: number;
};
export declare class VideoUploadService {
    private readonly logger;
    private readonly uploadRoot;
    constructor();
    uploadAndCompress(tenantId: string, file: Express.Multer.File): Promise<CompressResult>;
    private transcodeToH264;
    private probeDuration;
    static readonly LIMITS: {
        maxUploadBytes: number;
        targetMaxBytes: number;
        allowedMimes: string[];
    };
}
export {};
