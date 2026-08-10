import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
export declare class AuthorsController {
    private readonly authorsService;
    constructor(authorsService: AuthorsService);
    findAll(tenantId: string): Promise<{
        id: string;
        slug: string;
        name: string;
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
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
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
        slug: string;
        name: string;
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
        slug: string;
        name: string;
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
        slug: string;
        name: string;
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
}
