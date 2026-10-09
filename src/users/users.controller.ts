import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { UserRole } from '@prisma/client';

@Controller('api/users')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('cursor') cursor?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll(tenantId, {
      cursor,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      role,
    });
  }

  @Get(':id')
  findById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.usersService.findById(tenantId, id);
  }

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Req() req: any,
    @Body() body: {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
      active?: boolean;
      permissions?: unknown;
    },
  ) {
    return this.usersService.create(tenantId, body, req.user.userId);
  }

  @Patch(':id')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      active?: boolean;
      permissions?: unknown;
    },
  ) {
    return this.usersService.update(tenantId, id, body, req.user.userId);
  }

  @Patch(':id/role')
  updateRole(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { role: UserRole },
  ) {
    return this.usersService.updateRole(tenantId, id, body.role, req.user.userId);
  }

  @Patch(':id/toggle-active')
  toggleActive(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.usersService.toggleActive(tenantId, id, req.user.userId);
  }

  @Delete(':id')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.usersService.remove(tenantId, id, req.user.userId);
  }
}
