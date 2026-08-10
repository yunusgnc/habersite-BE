import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

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
    const result = await this.prisma.tag.create({
      data: { ...dto, tenantId },
    });
    this.revalidation.revalidateTenant(tenantId, ['tags']);
    return result;
  }

  async update(tenantId: string, id: string, dto: UpdateTagDto) {
    await this.findOne(tenantId, id);
    if (dto.slug) {
      const existing = await this.prisma.tag.findFirst({
        where: { tenantId, slug: dto.slug, NOT: { id } },
      });
      if (existing) throw new ConflictException('Bu slug zaten kullanılıyor');
    }
    const result = await this.prisma.tag.update({ where: { id }, data: dto });
    this.revalidation.revalidateTenant(tenantId, ['tags']);
    return result;
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    const result = await this.prisma.tag.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, ['tags']);
    return result;
  }
}
