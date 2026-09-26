import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { UpdatePersonProfileDto } from './dto/update-person-profile.dto';
export declare class PersonProfilesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, options?: {
        cursor?: string;
        limit?: number;
        search?: string;
    }): Promise<{
        items: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            image: string | null;
            title: string | null;
            bio: string | null;
            social: import("@prisma/client/runtime/client").JsonValue;
            birthDate: string | null;
        }[];
        nextCursor: string | null;
        hasMore: boolean;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string | null;
        title: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        birthDate: string | null;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string | null;
        title: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        birthDate: string | null;
    }>;
    create(tenantId: string, dto: CreatePersonProfileDto): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string | null;
        title: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        birthDate: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdatePersonProfileDto): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string | null;
        title: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        birthDate: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string | null;
        title: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        birthDate: string | null;
    }>;
    private ensureExists;
    private generateUniqueSlug;
}
