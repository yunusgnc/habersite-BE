import { MediaType } from '@prisma/client';
export declare class QueryMediaDto {
    page?: number;
    cursor?: string;
    limit?: number;
    type?: MediaType;
    search?: string;
}
