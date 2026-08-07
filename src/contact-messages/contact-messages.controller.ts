import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Controller('api/contact-messages')
@UseGuards(TenantGuard)
export class ContactMessagesController {
  constructor(private readonly service: ContactMessagesService) {}

  // Public — throttled to prevent spam
  @Post()
  @UseGuards(ThrottlerGuard)
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateContactMessageDto,
    @Ip() ip: string,
    @Req() req: any,
  ) {
    return this.service.create(tenantId, dto, {
      ipAddress: ip,
      userAgent: req.headers?.['user-agent'],
    });
  }

  // ── Admin ──

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.service.findAll(tenantId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      cursor,
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  stats(@CurrentTenant() tenantId: string) {
    return this.service.stats(tenantId);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  markRead(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body('read') read?: boolean,
  ) {
    return this.service.markRead(tenantId, id, read !== false);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }
}
