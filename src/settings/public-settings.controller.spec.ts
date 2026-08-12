import { Test, TestingModule } from '@nestjs/testing';
import { PublicSettingsController } from './public-settings.controller';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PublicSettingsController', () => {
  let controller: PublicSettingsController;
  let settingsService: jest.Mocked<SettingsService>;
  let tenantFindUnique: jest.Mock;

  beforeEach(async () => {
    const mockSettingsService = { getAll: jest.fn() };
    tenantFindUnique = jest
      .fn()
      .mockResolvedValue({ name: 'Test Tenant', locale: 'tr', timezone: 'Europe/Istanbul' });
    const mockPrisma = { tenant: { findUnique: tenantFindUnique } };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicSettingsController],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<PublicSettingsController>(PublicSettingsController);
    settingsService = module.get(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublic', () => {
    it('returns all settings and injects tenant meta', async () => {
      settingsService.getAll.mockResolvedValue({
        siteTitle: 'Test Site',
        primaryColor: '#ff0000',
        contactEmail: 'test@test.com',
      });

      const result = await controller.getPublic('tenant-1');

      expect(settingsService.getAll).toHaveBeenCalledWith('tenant-1');
      expect(result).toMatchObject({
        siteTitle: 'Test Site',
        primaryColor: '#ff0000',
        contactEmail: 'test@test.com',
        locale: 'tr',
        timezone: 'Europe/Istanbul',
      });
    });

    it('filters out sensitive keys', async () => {
      settingsService.getAll.mockResolvedValue({
        siteTitle: 'Test Site',
        oneSignalAppId: 'secret-onesignal-id',
        appStoreUrl: 'https://apps.apple.com/secret',
        playStoreUrl: 'https://play.google.com/secret',
        primaryColor: '#bc1010',
      });

      const result = await controller.getPublic('tenant-1');

      expect(result.siteTitle).toBe('Test Site');
      expect(result.primaryColor).toBe('#bc1010');
      expect(result).not.toHaveProperty('oneSignalAppId');
      expect(result).not.toHaveProperty('appStoreUrl');
      expect(result).not.toHaveProperty('playStoreUrl');
    });

    it('falls back to tenant name when siteTitle is empty', async () => {
      settingsService.getAll.mockResolvedValue({});
      const result = await controller.getPublic('tenant-1');
      // Beyaz etikette bir müşteriye başka müşterinin markasını yansıtmamak
      // için siteTitle boşsa tenant adına düşülür.
      expect(result.siteTitle).toBe('Test Tenant');
    });

    it('keeps configured siteTitle even when tenant name differs', async () => {
      settingsService.getAll.mockResolvedValue({ siteTitle: 'Elle Girilmiş Başlık' });
      const result = await controller.getPublic('tenant-1');
      expect(result.siteTitle).toBe('Elle Girilmiş Başlık');
    });

    it('passes the correct tenant ID to service', async () => {
      settingsService.getAll.mockResolvedValue({});
      await controller.getPublic('my-tenant-id');
      expect(settingsService.getAll).toHaveBeenCalledWith('my-tenant-id');
      expect(tenantFindUnique).toHaveBeenCalledWith({
        where: { id: 'my-tenant-id' },
        select: { name: true, locale: true, timezone: true },
      });
    });
  });
});
