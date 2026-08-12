import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(tenantId: string, query: QueryMediaDto): Promise<{
        data: {
            type: import("@prisma/client").$Enums.MediaType;
            id: string;
            tenantId: string;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            url: string;
            thumbnailUrl: string | null;
            width: number | null;
            height: number | null;
            title: string | null;
            alt: string | null;
            credit: string | null;
            createdAt: Date;
        }[];
        nextCursor: string | null;
        total: number;
    }>;
    upload(tenantId: string, file: Express.Multer.File, dto: UploadMediaDto): Promise<{
        type: import("@prisma/client").$Enums.MediaType;
        id: string;
        tenantId: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string | null;
        width: number | null;
        height: number | null;
        title: string | null;
        alt: string | null;
        credit: string | null;
        createdAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UploadMediaDto): Promise<{
        type: import("@prisma/client").$Enums.MediaType;
        id: string;
        tenantId: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string | null;
        width: number | null;
        height: number | null;
        title: string | null;
        alt: string | null;
        credit: string | null;
        createdAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        type: import("@prisma/client").$Enums.MediaType;
        id: string;
        tenantId: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string | null;
        width: number | null;
        height: number | null;
        title: string | null;
        alt: string | null;
        credit: string | null;
        createdAt: Date;
    }>;
}
