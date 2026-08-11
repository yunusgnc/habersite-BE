import { PersonProfilesService } from './person-profiles.service';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { UpdatePersonProfileDto } from './dto/update-person-profile.dto';
export declare class PersonProfilesController {
    private readonly personProfilesService;
    constructor(personProfilesService: PersonProfilesService);
    findAll(tenantId: string, cursor?: string, limit?: string, search?: string): Promise<{
        items: {
            id: string;
            tenantId: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            bio: string | null;
            social: import("@prisma/client/runtime/client").JsonValue;
            title: string | null;
            birthDate: string | null;
        }[];
        nextCursor: string | null;
        hasMore: boolean;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        title: string | null;
        birthDate: string | null;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        title: string | null;
        birthDate: string | null;
    }>;
    create(tenantId: string, dto: CreatePersonProfileDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        title: string | null;
        birthDate: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdatePersonProfileDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        title: string | null;
        birthDate: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        bio: string | null;
        social: import("@prisma/client/runtime/client").JsonValue;
        title: string | null;
        birthDate: string | null;
    }>;
}
