import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<({
        _count: {
            articles: number;
        };
    } & {
        id: string;
        slug: string;
        name: string;
        tenantId: string;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        _count: {
            articles: number;
        };
    } & {
        id: string;
        slug: string;
        name: string;
        tenantId: string;
    }>;
    create(tenantId: string, dto: CreateTagDto): Promise<{
        id: string;
        slug: string;
        name: string;
        tenantId: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateTagDto): Promise<{
        id: string;
        slug: string;
        name: string;
        tenantId: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        tenantId: string;
    }>;
}
