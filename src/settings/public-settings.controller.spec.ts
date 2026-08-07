import { Test, TestingModule } from '@nestjs/testing';
import { PublicSettingsController } from './public-settings.controller';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PublicSettingsController', () => {
  let controller: PublicSettingsController;
  let settingsService: jest.Mocked<SettingsService>;

  beforeEach(async () => {
    const mockSettingsService = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicSettingsController],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<PublicSettingsController>(PublicSettingsController);
    settingsService = module.get(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublic', () => {
    it('returns all settings for the tenant', async () => {
      settingsService.getAll.mockResolvedValue({
        siteTitle: 'Test Site',
        primaryColor: '#ff0000',
        contactEmail: 'test@test.com',
      });

      const result = await controller.getPublic('tenant-1');

      expect(settingsService.getAll).toHaveBeenCalledWith('tenant-1');
      expect(result).toEqual({
        siteTitle: 'Test Site',
        primaryColor: '#ff0000',
        contactEmail: 'test@test.com',
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

    it('returns empty object when no settings exist', async () => {
      settingsService.getAll.mockResolvedValue({});

      const result = await controller.getPublic('tenant-1');

      expect(result).toEqual({});
    });

    it('passes the correct tenant ID to service', async () => {
      settingsService.getAll.mockResolvedValue({});

      await controller.getPublic('my-tenant-id');

      expect(settingsService.getAll).toHaveBeenCalledWith('my-tenant-id');
    });
  });
});
