export declare class CreatePageDto {
    title: string;
    slug?: string;
    content: string | Record<string, any>;
    seoTitle?: string;
    seoDesc?: string;
    published?: boolean;
}
export declare class UpdatePageDto {
    title?: string;
    slug?: string;
    content?: string | Record<string, any>;
    seoTitle?: string;
    seoDesc?: string;
    published?: boolean;
}
