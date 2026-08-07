import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { PersonProfilesService } from './person-profiles.service';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { UpdatePersonProfileDto } from './dto/update-person-profile.dto';

@Controller('api/person-profiles')
export class PersonProfilesController {
  constructor(private readonly personProfilesService: PersonProfilesService) {}

  @Get()
  @UseGuards(TenantGuard)
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.personProfilesService.findAll(tenantId, {
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
    });
  }

  @Get('slug/:slug')
  @UseGuards(TenantGuard)
  findBySlug(
    @CurrentTenant() tenantId: string,
    @Param('slug') slug: string,
  ) {
    return this.personProfilesService.findBySlug(tenantId, slug);
  }

  @Get(':id')
  @UseGuards(TenantGuard)
  findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.personProfilesService.findOne(tenantId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreatePersonProfileDto,
  ) {
    return this.personProfilesService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePersonProfileDto,
  ) {
    return this.personProfilesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.personProfilesService.remove(tenantId, id);
  }
}
