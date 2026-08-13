import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { RevalidationModule } from './common/revalidation/revalidation.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthorsModule } from './authors/authors.module';
import { MediaModule } from './media/media.module';
import { CommentsModule } from './comments/comments.module';
import { BreakingNewsModule } from './breaking-news/breaking-news.module';
import { AdsModule } from './ads/ads.module';
import { WidgetsModule } from './widgets/widgets.module';
import { RedirectsModule } from './redirects/redirects.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { PagesModule } from './pages/pages.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GalleriesModule } from './galleries/galleries.module';
import { VideosModule } from './videos/videos.module';
import { SettingsModule } from './settings/settings.module';
import { PopupsModule } from './popups/popups.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthorCategoriesModule } from './author-categories/author-categories.module';
import { PersonProfilesModule } from './person-profiles/person-profiles.module';
import { TagsModule } from './tags/tags.module';
import { MenusModule } from './menus/menus.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { ContactMessagesModule } from './contact-messages/contact-messages.module';
import { OfficialNoticesModule } from './official-notices/official-notices.module';
import { AuditModule } from './common/audit/audit.module';
import { SeoModule } from './seo/seo.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RssImportModule } from './rss-import/rss-import.module';
import { ReadersModule } from './readers/readers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    PrismaModule,
    RevalidationModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    AuthorsModule,
    MediaModule,
    CommentsModule,
    BreakingNewsModule,
    AdsModule,
    WidgetsModule,
    RedirectsModule,
    NewslettersModule,
    PagesModule,
    AuditLogModule,
    HealthModule,
    DashboardModule,
    AnalyticsModule,
    GalleriesModule,
    VideosModule,
    SettingsModule,
    PopupsModule,
    AnnouncementsModule,
    AuthorCategoriesModule,
    PersonProfilesModule,
    TagsModule,
    MenusModule,
    SuperAdminModule,
    ContactMessagesModule,
    OfficialNoticesModule,
    AuditModule,
    SeoModule,
    NotificationsModule,
    RssImportModule,
    ReadersModule,
  ],
  providers: [
    // Global rate limit: 100 istek/dakika default, endpoint bazlı @Throttle ile
    // sıkılaştırılır (örn. /auth/login = 5/dakika).
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
