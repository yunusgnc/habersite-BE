import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { BulkArticleDto } from './dto/bulk-article.dto';
import { ReactDto, UnreactDto } from './dto/react.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ArticleStatus } from '@prisma/client';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('api/articles')
@UseGuards(TenantGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Bu uç noktayı hem panel hem de herkese açık site kullanıyor. Panel bütün
   * durumları görmek zorunda (taslak listesi, "Tümü" sekmesi), ziyaretçi ise
   * yalnızca yayınlanmışları görmeli. Ayrım kimlik doğrulamayla yapılıyor:
   * token yoksa `status` isteğe bakılmaksızın PUBLISHED'a sabitlenir.
   *
   * Daha önce filtre yoktu; taslak haberler ana sayfada manşete kadar
   * çıkıyordu.
   */
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryArticlesDto,
    @CurrentUser() user?: { id: string },
  ) {
    if (!user) {
      return this.articlesService.findAll(tenantId, {
        ...query,
        status: ArticleStatus.PUBLISHED,
      });
    }
    return this.articlesService.findAll(tenantId, query);
  }

  @Get(':id/detail')
  findById(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.articlesService.findById(tenantId, id);
  }

  /**
   * Sitemap üretimi için hafif bir uç nokta. Genel liste 50 satırla sınırlı;
   * arama motoruna 42 binin üzerinde haber sunmak için 100 istek atmak
   * makul değil. Burası yalnızca slug + tarih döner (kapak, spot, içerik
   * yok) ve sayfa başına 5.000 kayıt verir.
   *
   * Herkese açık: taslakları göstermez, kimlik doğrulama gerektirmez.
   */
  @Get('sitemap')
  sitemap(
    @CurrentTenant() tenantId: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const p = Math.max(1, parseInt(page ?? '1', 10) || 1);
    const pp = Math.min(5000, Math.max(1, parseInt(perPage ?? '5000', 10) || 5000));
    return this.articlesService.sitemap(tenantId, p, pp);
  }

  /**
   * Google News sitemap'i ve RSS için son 48 saatteki haberler. Herkese açık.
   * Google News 2 günden eski haberi kabul etmediği için aralık sabit.
   */
  @Get('recent-for-news')
  recentForNews(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
  ) {
    const n = Math.min(1000, Math.max(1, parseInt(limit ?? '1000', 10) || 1000));
    return this.articlesService.recentForNews(tenantId, n);
  }

  @Get('most-read')
  getMostRead(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: number,
  ) {
    return this.articlesService.getMostRead(tenantId, limit ? +limit : 10);
  }

  // Alias: /articles/trending — son 7 günün en çok okunanları
  @Get('trending')
  getTrending(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: number,
  ) {
    return this.articlesService.getMostRead(tenantId, limit ? +limit : 10);
  }

  // Arşiv sayfasının yıl/ay gezintisi. ':slug' rotasından ÖNCE tanımlı
  // olmalı, aksi halde "archive-facets" bir haber slug'ı sanılır.
  @Get('archive-facets')
  archiveFacets(@CurrentTenant() tenantId: string) {
    return this.articlesService.archiveFacets(tenantId);
  }

  /**
   * TEPKİLER — herkese açık, giriş İSTEMEZ. Okuyucu emojiyle tepki verir,
   * sayaçlar herkese görünür. Kişi kaydı tutulmadığı için tek koruma IP
   * başına hız sınırı: 20 tepki/dakika bir insan için bol, bir script için
   * caydırıcı.
   */
  @Get(':id/reactions')
  getReactions(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.articlesService.getReactions(tenantId, id);
  }

  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post(':id/reactions')
  react(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: ReactDto,
  ) {
    return this.articlesService.react(tenantId, id, dto.type, dto.previous);
  }

  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Delete(':id/reactions')
  unreact(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UnreactDto,
  ) {
    return this.articlesService.unreact(tenantId, id, dto.type);
  }

  @Get(':id/related')
  getRelated(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return this.articlesService.getRelated(tenantId, id, limit ? +limit : 5);
  }

  @Get(':slug')
  async findBySlug(
    @CurrentTenant() tenantId: string,
    @Param('slug') slug: string,
  ) {
    const article = await this.articlesService.findBySlug(tenantId, slug);
    // Increment view count in background, don't await
    this.articlesService.incrementViewCount(tenantId, article.id);
    return article;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLUMNIST')
  create(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateArticleDto,
  ) {
    return this.articlesService.create(tenantId, user.userId, dto, user?.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLUMNIST')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.update(tenantId, id, dto, user?.userId, user?.role);
  }

  @Get(':id/revisions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  listRevisions(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.articlesService.listRevisions(tenantId, id);
  }

  @Post(':id/revisions/:revisionId/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  restoreRevision(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Param('revisionId') revisionId: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.restoreRevision(tenantId, id, revisionId, user?.userId);
  }

  /**
   * SIRA ÖNEMLİ: `:id` rotasından ÖNCE olmak zorunda.
   *
   * Aşağıdaydı ve Express rotaları bildirim sırasına göre eşleştirdiği için
   * `DELETE /articles/bulk` isteği buraya hiç ulaşmıyordu — "bulk" bir haber
   * kimliği sanılıyor, istek 404 dönüyordu. Panelde toplu silme fiilen
   * çalışmıyordu ve hata bir uyarı balonuna dönüştüğü için sebebi görünmüyordu.
   */
  @Delete('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  bulkDelete(
    @CurrentTenant() tenantId: string,
    @Body() dto: { ids: string[] },
  ) {
    return this.articlesService.bulkDelete(tenantId, dto.ids);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.remove(tenantId, id, user?.userId);
  }

  @Patch('bulk/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  bulkUpdateStatus(
    @CurrentTenant() tenantId: string,
    @Body() dto: BulkArticleDto,
  ) {
    return this.articlesService.bulkUpdateStatus(tenantId, dto.ids, dto.status);
  }

  @Patch('bulk/category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  bulkUpdateCategory(
    @CurrentTenant() tenantId: string,
    @Body() dto: { ids: string[]; categoryId: string },
  ) {
    return this.articlesService.bulkUpdateCategory(tenantId, dto.ids, dto.categoryId);
  }

  // ---------- editorial workflow ----------

  @Get('workflow/my-tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLUMNIST')
  myTasks(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.myTasks(tenantId, user.userId);
  }

  @Get('workflow/review-queue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  reviewQueue(@CurrentTenant() tenantId: string) {
    return this.articlesService.reviewQueue(tenantId);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLUMNIST')
  submitForReview(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.submitForReview(tenantId, id, user.userId);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  approve(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.approve(tenantId, id, user.userId, user.role);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  reject(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { note: string },
    @CurrentUser() user: any,
  ) {
    return this.articlesService.reject(
      tenantId,
      id,
      user.userId,
      user.role,
      body.note,
    );
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  assign(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { assignedToId: string | null; deadline?: string | null },
    @CurrentUser() user: any,
  ) {
    return this.articlesService.assign(
      tenantId,
      id,
      user.userId,
      user.role,
      body,
    );
  }
}
