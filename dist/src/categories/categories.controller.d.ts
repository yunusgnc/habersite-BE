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
                active: boolean;
                sortOrder: number;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                parentId: string | null;
                image: string | null;
                color: string | null;
                seoTitle: string | null;
                seoDesc: string | null;
            }[];
        } & {
            id: string;
            tenantId: string;
            active: boolean;
            sortOrder: number;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            image: string | null;
            color: string | null;
            seoTitle: string | null;
            seoDesc: string | null;
        })[];
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        image: string | null;
        color: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        parent: {
            id: string;
            tenantId: string;
            active: boolean;
            sortOrder: number;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            image: string | null;
            color: string | null;
            seoTitle: string | null;
            seoDesc: string | null;
        } | null;
        children: {
            id: string;
            tenantId: string;
            active: boolean;
            sortOrder: number;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            image: string | null;
            color: string | null;
            seoTitle: string | null;
            seoDesc: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        image: string | null;
        color: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
    }>;
    create(tenantId: string, dto: CreateCategoryDto): Promise<{
        children: {
            id: string;
            tenantId: string;
            active: boolean;
            sortOrder: number;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            image: string | null;
            color: string | null;
            seoTitle: string | null;
            seoDesc: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        image: string | null;
        color: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateCategoryDto): Promise<{
        children: {
            id: string;
            tenantId: string;
            active: boolean;
            sortOrder: number;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            image: string | null;
            color: string | null;
            seoTitle: string | null;
            seoDesc: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        image: string | null;
        color: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        image: string | null;
        color: string | null;
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
