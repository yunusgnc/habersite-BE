import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(tenantId: string): Promise<{
        children: ({
            children: {
                id: string;
                slug: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                tenantId: string;
                parentId: string | null;
                image: string | null;
                color: string | null;
                sortOrder: number;
                seoTitle: string | null;
                seoDesc: string | null;
            }[];
        } & {
            id: string;
            slug: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
            parentId: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            seoTitle: string | null;
            seoDesc: string | null;
        })[];
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tenantId: string;
        parentId: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        seoTitle: string | null;
        seoDesc: string | null;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        parent: {
            id: string;
            slug: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
            parentId: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            seoTitle: string | null;
            seoDesc: string | null;
        } | null;
        children: {
            id: string;
            slug: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
            parentId: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            seoTitle: string | null;
            seoDesc: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tenantId: string;
        parentId: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        seoTitle: string | null;
        seoDesc: string | null;
    }>;
    create(tenantId: string, dto: CreateCategoryDto): Promise<{
        children: {
            id: string;
            slug: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
            parentId: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            seoTitle: string | null;
            seoDesc: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tenantId: string;
        parentId: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        seoTitle: string | null;
        seoDesc: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateCategoryDto): Promise<{
        children: {
            id: string;
            slug: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
            parentId: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            seoTitle: string | null;
            seoDesc: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tenantId: string;
        parentId: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        seoTitle: string | null;
        seoDesc: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tenantId: string;
        parentId: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        seoTitle: string | null;
        seoDesc: string | null;
    }>;
    reorder(tenantId: string, dto: {
        items: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload[]>;
}
