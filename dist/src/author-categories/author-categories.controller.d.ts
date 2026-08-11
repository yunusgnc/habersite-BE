import { AuthorCategoriesService } from './author-categories.service';
import { CreateAuthorCategoryDto } from './dto/create-author-category.dto';
import { UpdateAuthorCategoryDto } from './dto/update-author-category.dto';
export declare class AuthorCategoriesController {
    private readonly authorCategoriesService;
    constructor(authorCategoriesService: AuthorCategoriesService);
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
    reorder(tenantId: string, body: {
        items: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        sortOrder: number;
        name: string;
        slug: string;
        createdAt: Date;
    }[]>;
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
}
