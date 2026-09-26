import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginReaderDto, RegisterReaderDto, UpdateReaderDto } from './dto/reader.dto';
export declare class ReadersService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    private issueToken;
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
    me(readerId: string): Promise<{
        token?: string | undefined;
        id: string;
        email: string;
        name: string;
        active: boolean;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    updateMe(readerId: string, dto: UpdateReaderDto): Promise<{
        token?: string | undefined;
        id: string;
        email: string;
        name: string;
        active: boolean;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    listBookmarks(readerId: string, tenantId: string): Promise<({
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
    addBookmark(readerId: string, tenantId: string, articleId: string): Promise<{
        id: string;
        createdAt: Date;
        articleId: string;
        readerId: string;
    }>;
    removeBookmark(readerId: string, articleId: string): Promise<{
        deleted: boolean;
    }>;
    isBookmarked(readerId: string, articleId: string): Promise<{
        bookmarked: boolean;
    }>;
    private serialize;
}
