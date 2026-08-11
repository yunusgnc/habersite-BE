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
        tenantId: string;
        name: string;
        slug: string;
        bio: string | null;
        avatar: string | null;
        email: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
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
        bio: string | null;
        avatar: string | null;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        bio: string | null;
        avatar: string | null;
        email: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(tenantId: string, dto: CreateAuthorDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        bio: string | null;
        avatar: string | null;
        email: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateAuthorDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        bio: string | null;
        avatar: string | null;
        email: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        bio: string | null;
        avatar: string | null;
        email: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private ensureExists;
    private generateUniqueSlug;
}
