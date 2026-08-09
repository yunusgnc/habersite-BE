"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const tenants_module_1 = require("./tenants/tenants.module");
const users_module_1 = require("./users/users.module");
const articles_module_1 = require("./articles/articles.module");
const categories_module_1 = require("./categories/categories.module");
const authors_module_1 = require("./authors/authors.module");
const media_module_1 = require("./media/media.module");
const comments_module_1 = require("./comments/comments.module");
const breaking_news_module_1 = require("./breaking-news/breaking-news.module");
const ads_module_1 = require("./ads/ads.module");
const widgets_module_1 = require("./widgets/widgets.module");
const redirects_module_1 = require("./redirects/redirects.module");
const newsletters_module_1 = require("./newsletters/newsletters.module");
const pages_module_1 = require("./pages/pages.module");
const audit_log_module_1 = require("./audit-log/audit-log.module");
const health_module_1 = require("./health/health.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const analytics_module_1 = require("./analytics/analytics.module");
const galleries_module_1 = require("./galleries/galleries.module");
const videos_module_1 = require("./videos/videos.module");
const settings_module_1 = require("./settings/settings.module");
const popups_module_1 = require("./popups/popups.module");
const announcements_module_1 = require("./announcements/announcements.module");
const author_categories_module_1 = require("./author-categories/author-categories.module");
const person_profiles_module_1 = require("./person-profiles/person-profiles.module");
const tags_module_1 = require("./tags/tags.module");
const menus_module_1 = require("./menus/menus.module");
const super_admin_module_1 = require("./super-admin/super-admin.module");
const contact_messages_module_1 = require("./contact-messages/contact-messages.module");
const audit_module_1 = require("./common/audit/audit.module");
const seo_module_1 = require("./seo/seo.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
                serveStaticOptions: { index: false },
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            users_module_1.UsersModule,
            articles_module_1.ArticlesModule,
            categories_module_1.CategoriesModule,
            authors_module_1.AuthorsModule,
            media_module_1.MediaModule,
            comments_module_1.CommentsModule,
            breaking_news_module_1.BreakingNewsModule,
            ads_module_1.AdsModule,
            widgets_module_1.WidgetsModule,
            redirects_module_1.RedirectsModule,
            newsletters_module_1.NewslettersModule,
            pages_module_1.PagesModule,
            audit_log_module_1.AuditLogModule,
            health_module_1.HealthModule,
            dashboard_module_1.DashboardModule,
            analytics_module_1.AnalyticsModule,
            galleries_module_1.GalleriesModule,
            videos_module_1.VideosModule,
            settings_module_1.SettingsModule,
            popups_module_1.PopupsModule,
            announcements_module_1.AnnouncementsModule,
            author_categories_module_1.AuthorCategoriesModule,
            person_profiles_module_1.PersonProfilesModule,
            tags_module_1.TagsModule,
            menus_module_1.MenusModule,
            super_admin_module_1.SuperAdminModule,
            contact_messages_module_1.ContactMessagesModule,
            audit_module_1.AuditModule,
            seo_module_1.SeoModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map