export type SayfaliSonuc<T> = {
    items: T[];
    total: number;
    totalPages: number;
    page?: number;
    hasMore: boolean;
    nextCursor?: string;
};
export declare function sayfaliListe<T extends {
    id: string;
}>(opts: {
    say: () => Promise<number>;
    bul: (args: {
        take: number;
        skip?: number;
        cursor?: {
            id: string;
        };
    }) => Promise<T[]>;
    limit: number;
    page?: number;
    cursor?: string;
}): Promise<SayfaliSonuc<T>>;
