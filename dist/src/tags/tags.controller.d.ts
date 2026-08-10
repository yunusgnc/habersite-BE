import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    findAll(tenantId: string): Promise<({
        _count: {
            articles: number;
        };
    } & {
        id: string;
        tenantId: string;
        name: string;
        slug: string;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        _count: {
            articles: number;
        };
    } & {
        id: string;
        tenantId: string;
        name: string;
        slug: string;
    }>;
    create(tenantId: string, dto: CreateTagDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateTagDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
    }>;
}
