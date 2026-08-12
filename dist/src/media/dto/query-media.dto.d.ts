import { MediaType } from '@prisma/client';
export declare class QueryMediaDto {
    cursor?: string;
    limit?: number;
    type?: MediaType;
    search?: string;
}
