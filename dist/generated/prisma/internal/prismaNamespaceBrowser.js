"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.JsonNullValueFilter = exports.QueryMode = exports.NullableJsonNullValueInput = exports.JsonNullValueInput = exports.SortOrder = exports.AuditLogScalarFieldEnum = exports.PageScalarFieldEnum = exports.WidgetScalarFieldEnum = exports.NewsletterSubscriberScalarFieldEnum = exports.PopupScalarFieldEnum = exports.AnnouncementScalarFieldEnum = exports.ArticlePersonScalarFieldEnum = exports.PersonProfileScalarFieldEnum = exports.RedirectScalarFieldEnum = exports.MenuScalarFieldEnum = exports.AdScalarFieldEnum = exports.BreakingNewsScalarFieldEnum = exports.CommentScalarFieldEnum = exports.ArticleMediaScalarFieldEnum = exports.MediaScalarFieldEnum = exports.ArticleTagScalarFieldEnum = exports.ArticleCategoryScalarFieldEnum = exports.ArticleScalarFieldEnum = exports.AuthorScalarFieldEnum = exports.TagScalarFieldEnum = exports.CategoryScalarFieldEnum = exports.UserScalarFieldEnum = exports.TenantScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Tenant: 'Tenant',
    User: 'User',
    Category: 'Category',
    Tag: 'Tag',
    Author: 'Author',
    Article: 'Article',
    ArticleCategory: 'ArticleCategory',
    ArticleTag: 'ArticleTag',
    Media: 'Media',
    ArticleMedia: 'ArticleMedia',
    Comment: 'Comment',
    BreakingNews: 'BreakingNews',
    Ad: 'Ad',
    Menu: 'Menu',
    Redirect: 'Redirect',
    PersonProfile: 'PersonProfile',
    ArticlePerson: 'ArticlePerson',
    Announcement: 'Announcement',
    Popup: 'Popup',
    NewsletterSubscriber: 'NewsletterSubscriber',
    Widget: 'Widget',
    Page: 'Page',
    AuditLog: 'AuditLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.TenantScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    domain: 'domain',
    subdomain: 'subdomain',
    logo: 'logo',
    favicon: 'favicon',
    theme: 'theme',
    locale: 'locale',
    timezone: 'timezone',
    settings: 'settings',
    plan: 'plan',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    avatar: 'avatar',
    role: 'role',
    active: 'active',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CategoryScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    parentId: 'parentId',
    name: 'name',
    slug: 'slug',
    description: 'description',
    image: 'image',
    color: 'color',
    sortOrder: 'sortOrder',
    active: 'active',
    seoTitle: 'seoTitle',
    seoDesc: 'seoDesc',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TagScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    slug: 'slug'
};
exports.AuthorScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    slug: 'slug',
    bio: 'bio',
    avatar: 'avatar',
    email: 'email',
    social: 'social',
    active: 'active',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ArticleScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    type: 'type',
    title: 'title',
    slug: 'slug',
    spot: 'spot',
    content: 'content',
    featuredImage: 'featuredImage',
    status: 'status',
    publishedAt: 'publishedAt',
    scheduledAt: 'scheduledAt',
    authorId: 'authorId',
    createdById: 'createdById',
    approvedById: 'approvedById',
    viewCount: 'viewCount',
    commentCount: 'commentCount',
    readingTime: 'readingTime',
    featured: 'featured',
    breakingLabel: 'breakingLabel',
    seoTitle: 'seoTitle',
    seoDesc: 'seoDesc',
    canonicalUrl: 'canonicalUrl',
    ogImage: 'ogImage',
    source: 'source',
    sourceUrl: 'sourceUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ArticleCategoryScalarFieldEnum = {
    articleId: 'articleId',
    categoryId: 'categoryId',
    primary: 'primary'
};
exports.ArticleTagScalarFieldEnum = {
    articleId: 'articleId',
    tagId: 'tagId'
};
exports.MediaScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    type: 'type',
    filename: 'filename',
    originalName: 'originalName',
    mimeType: 'mimeType',
    size: 'size',
    url: 'url',
    thumbnailUrl: 'thumbnailUrl',
    width: 'width',
    height: 'height',
    alt: 'alt',
    credit: 'credit',
    createdAt: 'createdAt'
};
exports.ArticleMediaScalarFieldEnum = {
    articleId: 'articleId',
    mediaId: 'mediaId',
    sortOrder: 'sortOrder',
    caption: 'caption'
};
exports.CommentScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    articleId: 'articleId',
    parentId: 'parentId',
    name: 'name',
    email: 'email',
    content: 'content',
    ipAddress: 'ipAddress',
    status: 'status',
    createdAt: 'createdAt'
};
exports.BreakingNewsScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    title: 'title',
    url: 'url',
    active: 'active',
    sortOrder: 'sortOrder',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.AdScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    position: 'position',
    code: 'code',
    imageUrl: 'imageUrl',
    targetUrl: 'targetUrl',
    active: 'active',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    impressions: 'impressions',
    clicks: 'clicks',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.MenuScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    location: 'location',
    items: 'items',
    updatedAt: 'updatedAt'
};
exports.RedirectScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    source: 'source',
    target: 'target',
    permanent: 'permanent'
};
exports.PersonProfileScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    slug: 'slug',
    bio: 'bio',
    image: 'image',
    birthDate: 'birthDate',
    title: 'title',
    social: 'social',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ArticlePersonScalarFieldEnum = {
    articleId: 'articleId',
    personId: 'personId'
};
exports.AnnouncementScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    title: 'title',
    content: 'content',
    type: 'type',
    active: 'active',
    pinned: 'pinned',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.PopupScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    title: 'title',
    content: 'content',
    imageUrl: 'imageUrl',
    targetUrl: 'targetUrl',
    trigger: 'trigger',
    delayMs: 'delayMs',
    active: 'active',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    createdAt: 'createdAt'
};
exports.NewsletterSubscriberScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    email: 'email',
    name: 'name',
    confirmed: 'confirmed',
    unsubscribed: 'unsubscribed',
    createdAt: 'createdAt'
};
exports.WidgetScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    type: 'type',
    config: 'config',
    active: 'active',
    sortOrder: 'sortOrder',
    cache: 'cache',
    cachedAt: 'cachedAt'
};
exports.PageScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    title: 'title',
    slug: 'slug',
    content: 'content',
    seoTitle: 'seoTitle',
    seoDesc: 'seoDesc',
    published: 'published',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    userId: 'userId',
    action: 'action',
    entity: 'entity',
    entityId: 'entityId',
    changes: 'changes',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map