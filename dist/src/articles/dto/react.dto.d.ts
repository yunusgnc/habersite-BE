import { ReactionType } from '@prisma/client';
export declare class ReactDto {
    type: ReactionType;
    previous?: ReactionType;
}
export declare class UnreactDto {
    type: ReactionType;
}
