import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';

@Controller('api/media')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryMediaDto,
  ) {
    return this.mediaService.findAll(tenantId, query);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @CurrentTenant() tenantId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.create(tenantId, file, dto);
  }

  @Patch(':id')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.mediaService.remove(tenantId, id);
  }
}
