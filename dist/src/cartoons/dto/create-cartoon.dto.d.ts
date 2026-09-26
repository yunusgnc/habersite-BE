export declare class CreateCartoonDto {
    title: string;
    slug?: string;
    image: string;
    imageAlt?: string;
    artist?: string;
    caption?: string;
    captionSize?: 'normal' | 'large' | 'xlarge';
    publishedAt?: string;
    active?: boolean;
    seoTitle?: string;
    seoDesc?: string;
}
