import { AdPosition } from '@prisma/client';
export declare class CreateAdDto {
    name: string;
    position: AdPosition;
    code?: string;
    imageUrl?: string;
    mobileImageUrl?: string;
    targetUrl?: string;
    active?: boolean;
    startsAt?: string;
    endsAt?: string;
    sortOrder?: number;
}
