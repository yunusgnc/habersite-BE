import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto, CreateGalleryImageDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { QueryGalleriesDto } from './dto/query-galleries.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/galleries')
@UseGuards(TenantGuard)
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryGalleriesDto,
  ) {
    return this.galleriesService.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.galleriesService.findOne(tenantId, id);
  }

  @Get('slug/:slug')
  findBySlug(
    @CurrentTenant() tenantId: string,
    @Param('slug') slug: string,
  ) {
    return this.galleriesService.findBySlug(tenantId, slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateGalleryDto,
  ) {
    return this.galleriesService.create(tenantId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateGalleryDto,
  ) {
    return this.galleriesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.galleriesService.remove(tenantId, id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  addImages(
    @CurrentTenant() tenantId: string,
    @Param('id') galleryId: string,
    @Body() images: CreateGalleryImageDto[],
  ) {
    return this.galleriesService.addImages(tenantId, galleryId, images);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  removeImage(
    @CurrentTenant() tenantId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.galleriesService.removeImage(tenantId, imageId);
  }

  @Patch(':id/images/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  reorderImages(
    @CurrentTenant() tenantId: string,
    @Param('id') galleryId: string,
    @Body() imageIds: string[],
  ) {
    return this.galleriesService.reorderImages(tenantId, galleryId, imageIds);
  }
}
