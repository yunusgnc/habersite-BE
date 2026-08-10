import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
export declare class AuthorsController {
    private readonly authorsService;
    constructor(authorsService: AuthorsService);
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
}
