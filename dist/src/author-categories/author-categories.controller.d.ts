import { AuthorCategoriesService } from './author-categories.service';
import { CreateAuthorCategoryDto } from './dto/create-author-category.dto';
import { UpdateAuthorCategoryDto } from './dto/update-author-category.dto';
export declare class AuthorCategoriesController {
    private readonly authorCategoriesService;
    constructor(authorCategoriesService: AuthorCategoriesService);
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
    create(tenantId: string, dto: CreateAuthorCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
    reorder(tenantId: string, body: {
        items: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }[]>;
    update(tenantId: string, id: string, dto: UpdateAuthorCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
    }>;
}
