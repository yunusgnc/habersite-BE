import {
  BadRequestException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { SettingsService } from '../settings/settings.service';
import { AiProviderError } from './ai.types';

/**
 * Yapay zekâ yardımcısı servisi.
 *
 * Kritik davranışlar:
 *  - Anahtar SADECE `getSecret` ile okunuyor. `getAll` sırları döndürmüyor;
 *    biri ileride kolaylık olsun diye `getAll` üzerinden okumaya kalkarsa
 *    sessizce çalışmayan bir özellik ortaya çıkar. Test bunu kayda geçiriyor.
 *  - Sağlayıcı hatası kullanıcıya OLDUĞU GİBİ ulaşmalı. "Bir hata oluştu"
 *    demek, geçersiz anahtar ile biten bakiyeyi aynı şeye indirger ve
 *    kullanıcı ne yapacağını bilemez.
 */
describe('AiService', () => {
  let service: AiService;
  let settings: {
    getAll: jest.Mock;
    getSecret: jest.Mock;
  };
  let gunluk: jest.SpyInstance;

  const KIRACI = 'tenant-1';

  beforeEach(async () => {
    settings = { getAll: jest.fn().mockResolvedValue({}), getSecret: jest.fn() };
    gunluk = jest.spyOn(Logger.prototype, 'warn').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService, { provide: SettingsService, useValue: settings }],
    }).compile();

    service = module.get(AiService);
  });

  afterEach(() => gunluk.mockRestore());

  /** Adaptörü sahteleyip sağlayıcıya gerçekten çağrı yapılmasını engeller. */
  function adaptoruSahtele(complete: jest.Mock) {
    jest
      .spyOn(service as any, 'resolveAdapter')
      .mockResolvedValue({ name: 'test', defaultModel: 'test-model', complete });
  }

  describe('status', () => {
    it('seçili sağlayıcının anahtarı varsa açık döner', async () => {
      settings.getAll.mockResolvedValue({ aiProvider: 'openai' });
      settings.getSecret.mockResolvedValue('sk-anahtar');

      expect(await service.status(KIRACI)).toEqual({
        enabled: true,
        provider: 'openai',
      });
      // Doğru ayar adı sorulmalı: sağlayıcı openai iken anthropic anahtarına
      // bakmak sessiz bir hata olurdu.
      expect(settings.getSecret).toHaveBeenCalledWith(KIRACI, 'openaiApiKey');
    });

    it('anahtar yoksa kapalı döner', async () => {
      settings.getSecret.mockResolvedValue(null);

      expect(await service.status(KIRACI)).toEqual({
        enabled: false,
        provider: 'anthropic',
      });
    });

    it('sağlayıcı ayarı yoksa anthropic varsayılır', async () => {
      settings.getAll.mockResolvedValue({});
      settings.getSecret.mockResolvedValue('sk-anahtar');

      const sonuc = await service.status(KIRACI);
      expect(sonuc.provider).toBe('anthropic');
      expect(settings.getSecret).toHaveBeenCalledWith(KIRACI, 'anthropicApiKey');
    });

    it('anahtarın kendisini yanıta koymaz', async () => {
      settings.getSecret.mockResolvedValue('sk-cok-gizli-anahtar');

      const sonuc = await service.status(KIRACI);
      expect(JSON.stringify(sonuc)).not.toContain('sk-cok-gizli');
    });
  });

  describe('anahtar yokken', () => {
    it('seçili sağlayıcıyı adıyla söyleyen hata verir', async () => {
      settings.getAll.mockResolvedValue({ aiProvider: 'openai' });
      settings.getSecret.mockResolvedValue(null);

      await expect(
        service.assist(KIRACI, 'spot', { title: 'Başlık' }),
      ).rejects.toThrow(/OpenAI API anahtarı tanımlı değil/);
    });

    it('anthropic seçiliyken onun adını söyler', async () => {
      settings.getSecret.mockResolvedValue(null);

      await expect(
        service.assist(KIRACI, 'spot', { title: 'Başlık' }),
      ).rejects.toThrow(/Anthropic API anahtarı tanımlı değil/);
    });
  });

  describe('girdi doğrulama', () => {
    it('bilinmeyen görevi reddeder', async () => {
      await expect(
        service.assist(KIRACI, 'olmayan-gorev' as any, { title: 'Başlık' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('başlık ve içerik boşsa sağlayıcıya hiç gitmez', async () => {
      const complete = jest.fn();
      adaptoruSahtele(complete);

      await expect(
        service.assist(KIRACI, 'spot', { title: '   ', content: '' }),
      ).rejects.toBeInstanceOf(BadRequestException);
      // Boş istek için para harcamayalım.
      expect(complete).not.toHaveBeenCalled();
    });

    it('yalnızca içerik varsa çalışır', async () => {
      const complete = jest.fn().mockResolvedValue({ spot: 'özet' });
      adaptoruSahtele(complete);

      await expect(
        service.assist(KIRACI, 'spot', { title: '', content: '<p>Metin</p>' }),
      ).resolves.toEqual({ spot: 'özet' });
    });
  });

  describe('modele giden metin', () => {
    it('HTML etiketleri temizlenir', async () => {
      const complete = jest.fn().mockResolvedValue({});
      adaptoruSahtele(complete);

      await service.assist(KIRACI, 'spot', {
        title: 'Başlık',
        content: '<p>Birinci paragraf</p><p>İkinci paragraf</p>',
      });

      const gonderilen = complete.mock.calls[0][0].user as string;
      expect(gonderilen).not.toContain('<p>');
      expect(gonderilen).toContain('Birinci paragraf');
      // Blok sonları boşluğa çevrilmeli, yoksa kelimeler birbirine yapışır.
      expect(gonderilen).not.toContain('paragrafİkinci');
    });

    it('script içeriği modele gitmez', async () => {
      const complete = jest.fn().mockResolvedValue({});
      adaptoruSahtele(complete);

      await service.assist(KIRACI, 'spot', {
        title: 'Başlık',
        content: '<script>zararli()</script><p>Gerçek metin</p>',
      });

      expect(complete.mock.calls[0][0].user).not.toContain('zararli');
    });

    it('çok uzun içerik kırpılır', async () => {
      const complete = jest.fn().mockResolvedValue({});
      adaptoruSahtele(complete);

      await service.assist(KIRACI, 'spot', {
        title: 'Başlık',
        content: 'a'.repeat(50_000),
      });

      // Maliyet öngörülebilir kalmalı: 50.000 karakterlik bir haber tek
      // istekte gönderilirse fatura sürpriz olur.
      const gonderilen = complete.mock.calls[0][0].user as string;
      expect(gonderilen.length).toBeLessThan(10_000);
    });

    it('HTML varlıkları çözülür', async () => {
      const complete = jest.fn().mockResolvedValue({});
      adaptoruSahtele(complete);

      await service.assist(KIRACI, 'spot', {
        title: 'Başlık',
        content: '<p>Kayseri&#39;de &quot;olay&quot; &amp; sonrası</p>',
      });

      const gonderilen = complete.mock.calls[0][0].user as string;
      expect(gonderilen).toContain("Kayseri'de");
      expect(gonderilen).toContain('"olay" & sonrası');
    });
  });

  describe('sağlayıcı hatası', () => {
    it('sağlayıcının mesajını kullanıcıya olduğu gibi iletir', async () => {
      const mesaj =
        'Sağlayıcı istek sınırına takıldı (You exceeded your current quota)';
      adaptoruSahtele(
        jest.fn().mockRejectedValue(new AiProviderError(mesaj, 'openai')),
      );

      await expect(
        service.assist(KIRACI, 'spot', { title: 'Başlık' }),
      ).rejects.toMatchObject({
        // 503: sorun bizde değil, sağlayıcıda.
        status: 503,
        response: { message: mesaj },
      });
    });

    it('sağlayıcı hatasını sunucu günlüğüne yazar', async () => {
      adaptoruSahtele(
        jest.fn().mockRejectedValue(new AiProviderError('kota bitti', 'openai')),
      );

      await expect(
        service.assist(KIRACI, 'spot', { title: 'Başlık' }),
      ).rejects.toBeInstanceOf(ServiceUnavailableException);

      expect(gunluk).toHaveBeenCalledWith(
        expect.stringContaining('[ai:openai]'),
      );
    });

    it('beklenmeyen hatayı 503 diye maskelemez', async () => {
      // Kodumuzdaki bir hata sağlayıcı arızası gibi görünmemeli; yoksa gerçek
      // hatayı "sağlayıcı bozuk" sanıp aramayız.
      adaptoruSahtele(
        jest.fn().mockRejectedValue(new TypeError('okunamayan özellik')),
      );

      await expect(
        service.assist(KIRACI, 'spot', { title: 'Başlık' }),
      ).rejects.toBeInstanceOf(TypeError);
    });
  });

  describe('model seçimi', () => {
    it('ayardaki model adı varsayılanı ezer', async () => {
      settings.getAll.mockResolvedValue({
        aiProvider: 'openai',
        aiModel: 'gpt-4o',
      });
      settings.getSecret.mockResolvedValue('sk-anahtar');

      const adaptor = await (service as any).resolveAdapter(KIRACI);
      expect(adaptor.model).toBe('gpt-4o');
    });

    it('model ayarı boşsa sağlayıcının varsayılanına düşer', async () => {
      settings.getAll.mockResolvedValue({ aiProvider: 'openai', aiModel: '  ' });
      settings.getSecret.mockResolvedValue('sk-anahtar');

      const adaptor = await (service as any).resolveAdapter(KIRACI);
      expect(adaptor.model).toBe('gpt-4o-mini');
    });

    it('sağlayıcı seçimi doğru adaptörü kurar', async () => {
      settings.getAll.mockResolvedValue({ aiProvider: 'anthropic' });
      settings.getSecret.mockResolvedValue('sk-ant-anahtar');

      const adaptor = await (service as any).resolveAdapter(KIRACI);
      expect(adaptor.name).toBe('anthropic');
      expect(adaptor.model).toBe('claude-haiku-4-5-20251001');
    });
  });
});
