import { ReadersService } from './readers.service';
import { LoginReaderDto, RegisterReaderDto, UpdateReaderDto } from './dto/reader.dto';
export declare class ReadersController {
    private readonly service;
    constructor(service: ReadersService);
    register(tenantId: string, dto: RegisterReaderDto): Promise<{
        token?: string | undefined;
        id: string;
        email: string;
        name: string;
        active: boolean;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    login(tenantId: string, dto: LoginReaderDto): Promise<{
        token?: string | undefined;
        id: string;
        email: string;
        name: string;
        active: boolean;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    me(user: {
        readerId: string;
    }): Promise<{
        token?: string | undefined;
        id: string;
        email: string;
        name: string;
        active: boolean;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    updateMe(user: {
        readerId: string;
    }, dto: UpdateReaderDto): Promise<{
        token?: string | undefined;
        id: string;
        email: string;
        name: string;
        active: boolean;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    listBookmarks(user: {
        readerId: string;
        tenantId: string;
    }): Promise<({
        article: {
            id: string;
            slug: string;
            categories: {
                category: {
                    slug: string;
                    name: string;
                };
            }[];
            title: string;
            spot: string | null;
            featuredImage: string | null;
            publishedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        articleId: string;
        readerId: string;
    })[]>;
    addBookmark(user: {
        readerId: string;
        tenantId: string;
    }, body: {
        articleId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        articleId: string;
        readerId: string;
    }>;
    removeBookmark(user: {
        readerId: string;
    }, articleId: string): Promise<{
        deleted: boolean;
    }>;
    check(user: {
        readerId: string;
    }, articleId: string): Promise<{
        bookmarked: boolean;
    }>;
}
