import { PersonProfilesService } from './person-profiles.service';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { UpdatePersonProfileDto } from './dto/update-person-profile.dto';
export declare class PersonProfilesController {
    private readonly personProfilesService;
    constructor(personProfilesService: PersonProfilesService);
    findAll(tenantId: string, cursor?: string, limit?: string, search?: string): Promise<{
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
}
