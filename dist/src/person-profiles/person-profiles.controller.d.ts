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
}
