import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    name: true,
    email: true,
    role: true,
    avatar: true,
    active: true,
    lastLoginAt: true,
    createdAt: true,
  };

  async findAll(
    tenantId: string,
    opts: { cursor?: string; limit?: number; search?: string; role?: string } = {},
  ) {
    const limit = Math.min(100, opts.limit ?? 30);
    const where: any = { tenantId };
    if (opts.search?.trim()) {
      const q = opts.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (opts.role) where.role = opts.role;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: this.selectFields,
        // id tiebreaker: createdAt unique degil, cursor pagination deterministik siralama ister.
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(opts.cursor
          ? { cursor: { id: opts.cursor }, skip: 1 }
          : {}),
      }),
      this.prisma.user.count({ where }),
    ]);

    // İmleç döndürülen son kayıt olmalı — `skip: 1` ile birlikte aksi hâlde
    // her sayfa sınırında bir kayıt atlanıyor (bkz. articles.service findAll).
    const hasMore = items.length > limit;
    if (hasMore) items.pop();
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;
    return { items, nextCursor, total };
  }

  async findById(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      select: this.selectFields,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(
    tenantId: string,
    data: { name: string; email: string; password: string; role?: UserRole; active?: boolean },
  ) {
    const existing = await this.prisma.user.findFirst({
      where: { tenantId, email: data.email },
    });
    if (existing) {
      throw new ConflictException('Bu e-posta adresi zaten kullanılıyor');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        tenantId,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role ?? 'REPORTER',
        active: data.active ?? true,
      },
      select: this.selectFields,
    });
  }

  async update(
    tenantId: string,
    id: string,
    data: { name?: string; email?: string; password?: string; role?: UserRole; active?: boolean },
  ) {
    await this.findById(tenantId, id);

    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.selectFields,
    });
  }

  async updateRole(tenantId: string, id: string, role: UserRole) {
    await this.findById(tenantId, id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async toggleActive(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, tenantId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { active: !user.active },
      select: { id: true, name: true, active: true },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.user.delete({ where: { id } });
  }
}
