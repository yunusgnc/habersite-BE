import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
export declare class AuthorsService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string | null;
        avatar: string | null;
        sortOrder: number;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    findWithLatest(tenantId: string, limit?: number): Promise<{
        latestArticle: {
            id: string;
            slug: string;
            title: string;
            spot: string | null;
            featuredImage: string | null;
            publishedAt: Date | null;
        } | null;
        id: string;
        name: string;
        slug: string;
        avatar: string | null;
        bio: string | null;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string | null;
        avatar: string | null;
        sortOrder: number;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    create(tenantId: string, dto: CreateAuthorDto): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string | null;
        avatar: string | null;
        sortOrder: number;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    update(tenantId: string, id: string, dto: UpdateAuthorDto): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string | null;
        avatar: string | null;
        sortOrder: number;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string | null;
        avatar: string | null;
        sortOrder: number;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    private ensureExists;
    private generateUniqueSlug;
}
