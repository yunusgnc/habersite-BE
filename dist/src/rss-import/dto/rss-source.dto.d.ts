export declare class CreateRssSourceDto {
    name: string;
    url: string;
    defaultCategoryId?: string;
    defaultAuthorName?: string;
    active?: boolean;
    fetchIntervalMinutes?: number;
}
export declare class UpdateRssSourceDto {
    name?: string;
    url?: string;
    defaultCategoryId?: string | null;
    defaultAuthorName?: string | null;
    active?: boolean;
    fetchIntervalMinutes?: number;
}
