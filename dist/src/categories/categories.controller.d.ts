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
                tenantId: string;
                parentId: string | null;
                name: string;
                slug: string;
                description: string | null;
                image: string | null;
                color: string | null;
                sortOrder: number;
                active: boolean;
                seoTitle: string | null;
                seoDesc: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            tenantId: string;
            parentId: string | null;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            active: boolean;
            seoTitle: string | null;
            seoDesc: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        id: string;
        tenantId: string;
        parentId: string | null;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        active: boolean;
        seoTitle: string | null;
        seoDesc: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        parent: {
            id: string;
            tenantId: string;
            parentId: string | null;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            active: boolean;
            seoTitle: string | null;
            seoDesc: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        children: {
            id: string;
            tenantId: string;
            parentId: string | null;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            active: boolean;
            seoTitle: string | null;
            seoDesc: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        tenantId: string;
        parentId: string | null;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        active: boolean;
        seoTitle: string | null;
        seoDesc: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(tenantId: string, dto: CreateCategoryDto): Promise<{
        children: {
            id: string;
            tenantId: string;
            parentId: string | null;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            active: boolean;
            seoTitle: string | null;
            seoDesc: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        tenantId: string;
        parentId: string | null;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        active: boolean;
        seoTitle: string | null;
        seoDesc: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateCategoryDto): Promise<{
        children: {
            id: string;
            tenantId: string;
            parentId: string | null;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            color: string | null;
            sortOrder: number;
            active: boolean;
            seoTitle: string | null;
            seoDesc: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        tenantId: string;
        parentId: string | null;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        active: boolean;
        seoTitle: string | null;
        seoDesc: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        parentId: string | null;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        active: boolean;
        seoTitle: string | null;
        seoDesc: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reorder(tenantId: string, dto: {
        items: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload[]>;
}
