import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/create-page.dto';
export declare class PagesController {
    private pagesService;
    constructor(pagesService: PagesService);
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
