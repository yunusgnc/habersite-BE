export declare const UserRole: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly EDITOR: "EDITOR";
    readonly REPORTER: "REPORTER";
    readonly COLUMNIST: "COLUMNIST";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const ArticleStatus: {
    readonly DRAFT: "DRAFT";
    readonly SCHEDULED: "SCHEDULED";
    readonly PUBLISHED: "PUBLISHED";
    readonly ARCHIVED: "ARCHIVED";
};
export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus];
export declare const ArticleType: {
    readonly NEWS: "NEWS";
    readonly COLUMN: "COLUMN";
    readonly PHOTO_GALLERY: "PHOTO_GALLERY";
    readonly VIDEO: "VIDEO";
};
export type ArticleType = (typeof ArticleType)[keyof typeof ArticleType];
export declare const MediaType: {
    readonly IMAGE: "IMAGE";
    readonly VIDEO: "VIDEO";
    readonly DOCUMENT: "DOCUMENT";
};
export type MediaType = (typeof MediaType)[keyof typeof MediaType];
export declare const CommentStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly SPAM: "SPAM";
    readonly REJECTED: "REJECTED";
};
export type CommentStatus = (typeof CommentStatus)[keyof typeof CommentStatus];
export declare const AdPosition: {
    readonly HEADER_BANNER: "HEADER_BANNER";
    readonly SIDEBAR: "SIDEBAR";
    readonly IN_ARTICLE: "IN_ARTICLE";
    readonly FOOTER: "FOOTER";
    readonly POPUP: "POPUP";
    readonly BETWEEN_NEWS: "BETWEEN_NEWS";
};
export type AdPosition = (typeof AdPosition)[keyof typeof AdPosition];
