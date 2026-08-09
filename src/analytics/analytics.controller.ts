import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { ReportsService, type ReportType } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

type Range = '7d' | '30d' | '90d' | '1y' | 'all';

const VALID_RANGES: Range[] = ['7d', '30d', '90d', '1y', 'all'];

function parseRange(input: unknown): Range {
  if (typeof input === 'string' && (VALID_RANGES as string[]).includes(input)) {
    return input as Range;
  }
  return '30d';
}

@Controller('api/analytics')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles('EDITOR')
export class AnalyticsController {
  constructor(
    private readonly service: AnalyticsService,
    private readonly reports: ReportsService,
  ) {}

  // ---------- Reports API (new) ----------

  @Get('reports/meta')
  reportsMeta() {
    return this.reports.meta();
  }

  @Get('reports/:type')
  runReport(
    @CurrentTenant() tenantId: string,
    @Param('type') type: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: string,
  ) {
    return this.reports.run(tenantId, type as ReportType, {
      search,
      from,
      to,
      status,
    });
  }

  @Get('reports/:type/export.csv')
  async exportReport(
    @CurrentTenant() tenantId: string,
    @Param('type') type: string,
    @Query('search') search: string | undefined,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @Query('status') status: string | undefined,
    @Query('columns') columns: string | undefined,
    @Res() res: Response,
  ) {
    try {
      const cols = (columns ?? '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const { filename, body } = await this.reports.csv(
        tenantId,
        type as ReportType,
        { search, from, to, status },
        cols,
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.send(body);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  // ---------- Legacy analytics endpoints (kept as-is below) ----------

  @Get('overview')
  overview(
    @CurrentTenant() tenantId: string,
    @Query('range') range?: string,
  ) {
    return this.service.overview(tenantId, parseRange(range));
  }

  @Get('top-articles')
  topArticles(
    @CurrentTenant() tenantId: string,
    @Query('range') range?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.topArticles(
      tenantId,
      parseRange(range),
      limit ? Math.min(100, Math.max(1, Number(limit))) : 20,
    );
  }

  @Get('by-category')
  byCategory(@CurrentTenant() tenantId: string) {
    return this.service.byCategory(tenantId);
  }

  @Get('by-author')
  byAuthor(@CurrentTenant() tenantId: string) {
    return this.service.byAuthor(tenantId);
  }

  @Get('by-status')
  byStatus(@CurrentTenant() tenantId: string) {
    return this.service.byStatus(tenantId);
  }

  @Get('comment-breakdown')
  commentBreakdown(@CurrentTenant() tenantId: string) {
    return this.service.commentBreakdown(tenantId);
  }

  @Get('publish-timeseries')
  publishTimeSeries(
    @CurrentTenant() tenantId: string,
    @Query('range') range?: string,
  ) {
    return this.service.publishTimeSeries(tenantId, parseRange(range));
  }

  /**
   * Download a CSV export for a single report.
   * GET /api/analytics/export/top-articles?range=30d
   */
  @Get('export/:report')
  async exportCsv(
    @CurrentTenant() tenantId: string,
    @Param('report') report: string,
    @Query('range') range: string | undefined,
    @Res() res: Response,
  ) {
    try {
      const { filename, body } = await this.service.csv(
        tenantId,
        report,
        parseRange(range),
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.send(body);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }
}
