import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreatePageDto, UpdatePageDto } from './dto/create-page.dto';
export declare class PagesService {
    private prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        seoTitle: string | null;
        seoDesc: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findPublished(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        seoTitle: string | null;
        seoDesc: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        seoTitle: string | null;
        seoDesc: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(tenantId: string, dto: CreatePageDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        seoTitle: string | null;
        seoDesc: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdatePageDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        seoTitle: string | null;
        seoDesc: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private ensureUniqueSlug;
    private normalizeContent;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        seoTitle: string | null;
        seoDesc: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
