import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorCategoryDto } from './dto/create-author-category.dto';
import { UpdateAuthorCategoryDto } from './dto/update-author-category.dto';
export declare class AuthorCategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
    create(tenantId: string, dto: CreateAuthorCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
    update(tenantId: string, id: string, dto: UpdateAuthorCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
    reorder(tenantId: string, items: {
        id: string;
        sortOrder: number;
    }[]): Promise<{
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }[]>;
    private ensureExists;
    private generateUniqueSlug;
}
