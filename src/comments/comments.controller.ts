import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../auth/guards/permissions.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CommentStatus } from '@prisma/client';
import type { Request } from 'express';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('article/:articleId')
  @UseGuards(TenantGuard)
  findByArticle(
    @CurrentTenant() tenantId: string,
    @Param('articleId') articleId: string,
  ) {
    return this.commentsService.findByArticle(tenantId, articleId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
  @RequirePermissions('COMMENTS_VIEW')
  findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentsService.findAll(tenantId, query);
  }

  // Spam koruması: 10 yorum/dakika/IP.
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post()
  @UseGuards(TenantGuard)
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      '';
    return this.commentsService.create(tenantId, dto, ipAddress);
  }

  /**
   * SIRA ÖNEMLİ: `:id/status` rotasından ÖNCE olmak zorunda.
   *
   * Altındaydı ve `PATCH /comments/bulk/status` isteği buraya hiç ulaşmıyordu
   * — "bulk" bir yorum kimliği sanılıyordu. Yorumlar ekranındaki toplu
   * onaylama/reddetme fiilen çalışmıyordu; editör onlarca yorumu seçip
   * "Onayla" diyor ve hiçbiri onaylanmıyordu.
   */
  @Patch('bulk/status')
  @UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
  @RequirePermissions('COMMENTS_MODERATE')
  bulkUpdateStatus(
    @CurrentTenant() tenantId: string,
    @Body() dto: { ids: string[]; status: CommentStatus },
  ) {
    return this.commentsService.bulkUpdateStatus(tenantId, dto.ids, dto.status);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
  @RequirePermissions('COMMENTS_MODERATE')
  updateStatus(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body('status') status: CommentStatus,
  ) {
    return this.commentsService.updateStatus(tenantId, id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
  @RequirePermissions('COMMENTS_MODERATE')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.commentsService.remove(tenantId, id);
  }
}
