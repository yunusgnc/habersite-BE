import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorCategoryDto } from './dto/create-author-category.dto';
import { UpdateAuthorCategoryDto } from './dto/update-author-category.dto';
export declare class AuthorCategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
    }>;
    create(tenantId: string, dto: CreateAuthorCategoryDto): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateAuthorCategoryDto): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
    }>;
    reorder(tenantId: string, items: {
        id: string;
        sortOrder: number;
    }[]): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
    }[]>;
    private ensureExists;
    private generateUniqueSlug;
}
