"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdPosition = exports.CommentStatus = exports.MediaType = exports.ArticleType = exports.ArticleStatus = exports.UserRole = void 0;
exports.UserRole = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
    REPORTER: 'REPORTER',
    COLUMNIST: 'COLUMNIST'
};
exports.ArticleStatus = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED'
};
exports.ArticleType = {
    NEWS: 'NEWS',
    COLUMN: 'COLUMN',
    PHOTO_GALLERY: 'PHOTO_GALLERY',
    VIDEO: 'VIDEO'
};
exports.MediaType = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    DOCUMENT: 'DOCUMENT'
};
exports.CommentStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    SPAM: 'SPAM',
    REJECTED: 'REJECTED'
};
exports.AdPosition = {
    HEADER_BANNER: 'HEADER_BANNER',
    SIDEBAR: 'SIDEBAR',
    IN_ARTICLE: 'IN_ARTICLE',
    FOOTER: 'FOOTER',
    POPUP: 'POPUP',
    BETWEEN_NEWS: 'BETWEEN_NEWS'
};
//# sourceMappingURL=enums.js.map