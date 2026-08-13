export interface FeedItem {
    guid: string;
    title: string;
    description: string;
    link: string | null;
    publishedAt: Date | null;
    imageUrl: string | null;
}
export declare function parseFeed(xml: string): FeedItem[];
