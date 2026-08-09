import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuditService } from './audit.service';
import { CurrentTenant } from '../decorators/tenant.decorator';
import { TenantGuard } from '../guards/tenant.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/guards/roles.guard';

@Controller('api/audit-logs')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(
    @CurrentTenant() tenantId: string,
    @Query('entity') entity?: string,
    @Query('entityId') entityId?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.audit.list({
      tenantId,
      entity,
      entityId,
      userId,
      action,
      search,
      from,
      to,
      cursor,
      limit: limit ? Number(limit) : 50,
    });
  }

  @Get('summary')
  summary(
    @CurrentTenant() tenantId: string,
    @Query('entity') entity?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('search') search?: string,
  ) {
    return this.audit.summary({
      tenantId,
      entity,
      userId,
      action,
      from,
      to,
      search,
    });
  }

  @Get('export.csv')
  async exportCsv(
    @CurrentTenant() tenantId: string,
    @Query('entity') entity: string | undefined,
    @Query('userId') userId: string | undefined,
    @Query('action') action: string | undefined,
    @Query('search') search: string | undefined,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @Res() res: Response,
  ) {
    const rows = await this.audit.exportRows({
      tenantId,
      entity,
      userId,
      action,
      search,
      from,
      to,
    });
    const headers = [
      'Tarih',
      'Kullanıcı',
      'E-posta',
      'İşlem',
      'İçerik Tipi',
      'ID',
      'IP',
      'Değişiklik Özeti',
    ];
    const body =
      '﻿' +
      headers.map(csvEscape).join(',') +
      '\n' +
      rows
        .map((r) => {
          const summary = describeChanges(r.changes);
          return [
            formatDate(r.createdAt),
            r.user?.name ?? 'Sistem',
            r.user?.email ?? '',
            r.action,
            r.entity,
            r.entityId ?? '',
            r.ipAddress ?? '',
            summary,
          ]
            .map(csvEscape)
            .join(',');
        })
        .join('\n');

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="audit-log-${stamp}.csv"`,
    );
    res.send(body);
  }
}

function formatDate(d: Date | null | undefined): string {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function describeChanges(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return '';
  const changes = raw as Record<string, any>;
  const bits: string[] = [];
  if (typeof changes.title === 'string')
    bits.push(`title=${changes.title.slice(0, 80)}`);
  if (typeof changes.status === 'string') bits.push(`status=${changes.status}`);
  if (typeof changes.slug === 'string') bits.push(`slug=${changes.slug}`);
  if (typeof changes.email === 'string') bits.push(`email=${changes.email}`);
  return bits.join(' · ');
}
