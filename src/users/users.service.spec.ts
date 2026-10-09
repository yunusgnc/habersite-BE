import { ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService Süper Admin koruması', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as any;
  const service = new UsersService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('Adminin Süper Admin oluşturmasını API seviyesinde reddeder', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'ADMIN', active: true });

    await expect(
      service.create(
        'tenant-1',
        {
          name: 'Yeni Süper Admin',
          email: 'super@example.com',
          password: 'secret123',
          role: 'SUPER_ADMIN',
        },
        'actor-admin',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('Süper Adminin başka bir Süper Admin oluşturmasına izin verir', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'SUPER_ADMIN', active: true });
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'new-super' });

    await expect(
      service.create(
        'tenant-1',
        {
          name: 'Yeni Süper Admin',
          email: 'super@example.com',
          password: 'secret123',
          role: 'SUPER_ADMIN',
        },
        'actor-super',
      ),
    ).resolves.toEqual({ id: 'new-super' });
  });

  it('Adminin mevcut Süper Admin hesabını değiştirmesini reddeder', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'target-super',
      role: 'SUPER_ADMIN',
    });
    prisma.user.findUnique.mockResolvedValue({ role: 'ADMIN', active: true });

    await expect(
      service.update(
        'tenant-1',
        'target-super',
        { name: 'Değiştirildi' },
        'actor-admin',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
