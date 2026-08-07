import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.tag.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { articles: true } } },
    });
  }

  async findOne(tenantId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { articles: true } } },
    });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async create(tenantId: string, dto: CreateTagDto) {
    const existing = await this.prisma.tag.findUnique({
      where: { tenantId_slug: { tenantId, slug: dto.slug } },
    });
    if (existing) throw new ConflictException('Bu slug zaten kullanılıyor');
    return this.prisma.tag.create({
      data: { ...dto, tenantId },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateTagDto) {
    await this.findOne(tenantId, id);
    if (dto.slug) {
      const existing = await this.prisma.tag.findFirst({
        where: { tenantId, slug: dto.slug, NOT: { id } },
      });
      if (existing) throw new ConflictException('Bu slug zaten kullanılıyor');
    }
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.tag.delete({ where: { id } });
  }
}
