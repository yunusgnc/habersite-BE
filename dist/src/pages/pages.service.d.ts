import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto, UpdatePageDto } from './dto/create-page.dto';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }[]>;
    findPublished(tenantId: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    create(tenantId: string, dto: CreatePageDto): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    update(tenantId: string, id: string, dto: UpdatePageDto): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    private ensureUniqueSlug;
    private normalizeContent;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
}
