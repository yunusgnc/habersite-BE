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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { VideosService } from './videos.service';
import { VideoUploadService } from './video-upload.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { QueryVideosDto } from './dto/query-videos.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/videos')
@UseGuards(TenantGuard)
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly videoUploadService: VideoUploadService,
  ) {}

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryVideosDto,
  ) {
    return this.videosService.findAll(tenantId, query);
  }

  @Get('limits')
  getLimits() {
    return VideoUploadService.LIMITS;
  }

  @Get(':id')
  findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.videosService.findOne(tenantId, id);
  }

  @Get('slug/:slug')
  findBySlug(
    @CurrentTenant() tenantId: string,
    @Param('slug') slug: string,
  ) {
    return this.videosService.findBySlug(tenantId, slug);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 200 * 1024 * 1024 }, // 200MB hard cap
    }),
  )
  async upload(
    @CurrentTenant() tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.videoUploadService.uploadAndCompress(tenantId, file);
    return {
      url: result.url,
      size: result.size,
      duration: result.durationSec,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateVideoDto,
  ) {
    return this.videosService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVideoDto,
  ) {
    return this.videosService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REPORTER')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.videosService.remove(tenantId, id);
  }
}
