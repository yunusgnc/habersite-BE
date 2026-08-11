import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/create-page.dto';
export declare class PagesController {
    private pagesService;
    constructor(pagesService: PagesService);
    findPublished(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }[]>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        tenantId: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    create(tenantId: string, dto: CreatePageDto): Promise<{
        id: string;
        tenantId: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    update(tenantId: string, id: string, dto: UpdatePageDto): Promise<{
        id: string;
        tenantId: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        published: boolean;
    }>;
}
