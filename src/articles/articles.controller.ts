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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { BulkArticleDto } from './dto/bulk-article.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('api/articles')
@UseGuards(TenantGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryArticlesDto,
  ) {
    return this.articlesService.findAll(tenantId, query);
  }

  @Get(':id/detail')
  findById(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.articlesService.findById(tenantId, id);
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

  @Delete('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  bulkDelete(
    @CurrentTenant() tenantId: string,
    @Body() dto: { ids: string[] },
  ) {
    return this.articlesService.bulkDelete(tenantId, dto.ids);
  }
}
