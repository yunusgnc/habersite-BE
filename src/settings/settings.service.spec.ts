import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { encryptSecret } from '../common/crypto/secret-box';

/**
 * Ayar servisi — sırların sızmaması ve silinebilmesi.
 *
 * Buradaki testlerin iki gerçek gerekçesi var:
 *
 *  1. Gizli anahtarların `getAll()` sonucuna hiç girmemesi güvenlik duruşunun
 *     TEMELİ. Herkese açık ayar ucu bu metot üzerinden çalışıyor; sır oraya
 *     girerse internete açılır. Bir gün biri optimizasyon niyetiyle bu filtreyi
 *     kaldırırsa test kırılmalı.
 *  2. "Boş değer = kaydı sil" davranışı canlıda ÇALIŞMIYORDU — servis doğruydu
 *     ama DTO doğrulaması boş değeri servise hiç ulaştırmıyordu. Aşağıdaki
 *     silme testleri o hatanın nöbetçisi.
 */
describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: {
    setting: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      upsert: jest.Mock;
      deleteMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let revalidation: { revalidateTenant: jest.Mock };

  const KIRACI = 'tenant-1';
  const ORIJINAL_ANAHTAR = process.env.SETTINGS_ENCRYPTION_KEY;

  beforeEach(async () => {
    process.env.SETTINGS_ENCRYPTION_KEY = 'a'.repeat(64);

    prisma = {
      setting: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        upsert: jest.fn().mockResolvedValue({ id: '1' }),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      $transaction: jest.fn().mockResolvedValue([]),
    };
    revalidation = { revalidateTenant: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: prisma },
        { provide: RevalidationService, useValue: revalidation },
      ],
    }).compile();

    service = module.get(SettingsService);
  });

  afterEach(() => {
    if (ORIJINAL_ANAHTAR === undefined) delete process.env.SETTINGS_ENCRYPTION_KEY;
    else process.env.SETTINGS_ENCRYPTION_KEY = ORIJINAL_ANAHTAR;
  });

  describe('sır sızdırmama', () => {
    it('getAll gizli anahtarları hiç döndürmez', async () => {
      prisma.setting.findMany.mockResolvedValue([
        { key: 'siteTitle', value: 'Kayseri Times' },
        { key: 'openaiApiKey', value: encryptSecret('sk-gizli-1234') },
        { key: 'anthropicApiKey', value: encryptSecret('sk-ant-5678') },
        { key: 'primaryColor', value: '#004cff' },
      ]);

      const sonuc = await service.getAll(KIRACI);

      expect(Object.keys(sonuc).sort()).toEqual(['primaryColor', 'siteTitle']);
      // Şifreli hâli bile dönmemeli.
      expect(JSON.stringify(sonuc)).not.toContain('sk-');
      expect(JSON.stringify(sonuc)).not.toContain('v1:');
    });

    it('get tek tek okumada da gizli anahtarı vermez ve veritabanına gitmez', async () => {
      const sonuc = await service.get(KIRACI, 'openaiApiKey');

      expect(sonuc).toBeNull();
      // Sorgu hiç yapılmamalı: sır o kod yoluna ulaşmıyor.
      expect(prisma.setting.findUnique).not.toHaveBeenCalled();
    });

    it('getSecretStatus yalnızca son 4 karakteri döndürür', async () => {
      prisma.setting.findMany.mockResolvedValue([
        { key: 'siteTitle', value: 'Kayseri Times' },
        { key: 'openaiApiKey', value: encryptSecret('sk-proj-ABCD1234WXYZ') },
      ]);

      const sonuc = await service.getSecretStatus(KIRACI);

      expect(sonuc.openaiApiKey).toEqual({ configured: true, hint: '••••WXYZ' });
      // Gizli olmayan ayarlar bu yanıtta hiç yer almamalı.
      expect(sonuc.siteTitle).toBeUndefined();
      expect(JSON.stringify(sonuc)).not.toContain('sk-proj');
    });

    it('upsert gizli anahtarda kaydın kendisini yanıta koymaz', async () => {
      prisma.setting.upsert.mockResolvedValue({
        id: '1',
        key: 'openaiApiKey',
        value: 'v1:sifreli:veri:burada',
      });

      const sonuc = await service.upsert(KIRACI, 'openaiApiKey', 'sk-yeni-anahtar');

      expect(sonuc).toEqual({ tenantId: KIRACI, key: 'openaiApiKey', saved: true });
      expect(JSON.stringify(sonuc)).not.toContain('v1:');
    });
  });

  describe('sır okuma', () => {
    it('getSecret çözülmüş değeri döndürür', async () => {
      prisma.setting.findUnique.mockResolvedValue({
        value: encryptSecret('sk-gercek-anahtar'),
      });

      expect(await service.getSecret(KIRACI, 'openaiApiKey')).toBe(
        'sk-gercek-anahtar',
      );
    });

    it('kayıt bozuksa yanlış değer yerine null döner', async () => {
      // Şifreleme anahtarı değişmiş senaryosu: sessizce çöp döndürmek yerine
      // "anahtar yok" demek doğru davranış.
      prisma.setting.findUnique.mockResolvedValue({
        value: 'v1:bozuk:veri:burada',
      });

      expect(await service.getSecret(KIRACI, 'openaiApiKey')).toBeNull();
    });

    it('kayıt yoksa null döner', async () => {
      prisma.setting.findUnique.mockResolvedValue(null);
      expect(await service.getSecret(KIRACI, 'openaiApiKey')).toBeNull();
    });
  });

  describe('silme — canlıda 400 veren yol', () => {
    it('boş değer gizli anahtarın kaydını siler', async () => {
      const sonuc = await service.upsert(KIRACI, 'openaiApiKey', '');

      expect(prisma.setting.deleteMany).toHaveBeenCalledWith({
        where: { tenantId: KIRACI, key: 'openaiApiKey' },
      });
      expect(prisma.setting.upsert).not.toHaveBeenCalled();
      expect(sonuc).toEqual({ tenantId: KIRACI, key: 'openaiApiKey', removed: true });
    });

    it('yalnızca boşluktan oluşan değer de siler', async () => {
      await service.upsert(KIRACI, 'openaiApiKey', '   ');
      expect(prisma.setting.deleteMany).toHaveBeenCalled();
    });

    it('null her ayar için silme demek', async () => {
      await service.upsert(KIRACI, 'siteTitle', null);
      expect(prisma.setting.deleteMany).toHaveBeenCalledWith({
        where: { tenantId: KIRACI, key: 'siteTitle' },
      });
    });

    it('şifreleme yapılandırılmamışken bile silme çalışır', async () => {
      // Önemli: sunucuda şifreleme anahtarı yoksa kullanıcı yeni sır KAYDEDEMEZ
      // ama mevcut olanı SİLEBİLMELİ. Aksi halde kilitli kalırdı.
      delete process.env.SETTINGS_ENCRYPTION_KEY;

      await expect(service.upsert(KIRACI, 'openaiApiKey', '')).resolves.toEqual({
        tenantId: KIRACI,
        key: 'openaiApiKey',
        removed: true,
      });
    });
  });

  describe('şifreleme zorunluluğu', () => {
    it('sunucuda anahtar yoksa sır kaydetmeyi reddeder', async () => {
      delete process.env.SETTINGS_ENCRYPTION_KEY;

      await expect(
        service.upsert(KIRACI, 'openaiApiKey', 'sk-anahtar'),
      ).rejects.toBeInstanceOf(BadRequestException);
      // Sessizce düz metin yazmak en kötü sonuç olurdu.
      expect(prisma.setting.upsert).not.toHaveBeenCalled();
    });

    it('sır veritabanına şifrelenmiş gider', async () => {
      await service.upsert(KIRACI, 'openaiApiKey', 'sk-duz-metin-anahtar');

      const yazilan = prisma.setting.upsert.mock.calls[0][0].create.value;
      expect(yazilan).not.toContain('sk-duz-metin-anahtar');
      expect(yazilan.startsWith('v1:')).toBe(true);
    });

    it('gizli olmayan ayar şifrelenmeden yazılır', async () => {
      await service.upsert(KIRACI, 'siteTitle', 'Kayseri Times');

      expect(prisma.setting.upsert.mock.calls[0][0].create.value).toBe(
        'Kayseri Times',
      );
    });
  });

  describe('toplu kaydetme', () => {
    it('boş değerleri silmeye, dolu olanları yazmaya ayırır', async () => {
      const sonuc = await service.bulkUpsert(KIRACI, {
        siteTitle: 'Kayseri Times',
        openaiApiKey: '',
        primaryColor: '#004cff',
      });

      expect(sonuc.updated.sort()).toEqual(['primaryColor', 'siteTitle']);
      expect(sonuc.removed).toEqual(['openaiApiKey']);
      // Yanıtta yalnızca anahtar adları — değerler değil.
      expect(JSON.stringify(sonuc)).not.toContain('#004cff');
    });
  });

  describe('önbellek tazeleme', () => {
    it('kaydetme sitenin ayar önbelleğini düşürür', async () => {
      await service.upsert(KIRACI, 'siteTitle', 'Yeni Ad');
      expect(revalidation.revalidateTenant).toHaveBeenCalledWith(KIRACI, [
        'settings',
      ]);
    });

    it('silme de düşürür', async () => {
      await service.upsert(KIRACI, 'siteTitle', '');
      expect(revalidation.revalidateTenant).toHaveBeenCalledWith(KIRACI, [
        'settings',
      ]);
    });
  });
});
