import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(tenantId: string, query: QueryMediaDto): Promise<{
        data: {
            url: string;
            id: string;
            createdAt: Date;
            tenantId: string;
            type: import("@prisma/client").$Enums.MediaType;
            title: string | null;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            thumbnailUrl: string | null;
            width: number | null;
            height: number | null;
            alt: string | null;
            credit: string | null;
        }[];
        nextCursor: string | null;
        total: number;
    }>;
    upload(tenantId: string, file: Express.Multer.File, dto: UploadMediaDto): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.MediaType;
        title: string | null;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        thumbnailUrl: string | null;
        width: number | null;
        height: number | null;
        alt: string | null;
        credit: string | null;
    }>;
    update(tenantId: string, id: string, dto: UploadMediaDto): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.MediaType;
        title: string | null;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        thumbnailUrl: string | null;
        width: number | null;
        height: number | null;
        alt: string | null;
        credit: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.MediaType;
        title: string | null;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        thumbnailUrl: string | null;
        width: number | null;
        height: number | null;
        alt: string | null;
        credit: string | null;
    }>;
}
