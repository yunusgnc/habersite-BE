import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
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
