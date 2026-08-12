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
            tenantId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            slug: string;
            bio: string | null;
            image: string | null;
            birthDate: string | null;
            social: import("@prisma/client/runtime/client").JsonValue;
        }[];
        nextCursor: string | null;
        hasMore: boolean;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        slug: string;
        bio: string | null;
        image: string | null;
        birthDate: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        slug: string;
        bio: string | null;
        image: string | null;
        birthDate: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    create(tenantId: string, dto: CreatePersonProfileDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        slug: string;
        bio: string | null;
        image: string | null;
        birthDate: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    update(tenantId: string, id: string, dto: UpdatePersonProfileDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        slug: string;
        bio: string | null;
        image: string | null;
        birthDate: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        slug: string;
        bio: string | null;
        image: string | null;
        birthDate: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
    }>;
    private ensureExists;
    private generateUniqueSlug;
}
