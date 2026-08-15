import {
  decryptSecret,
  encryptSecret,
  isEncrypted,
  isEncryptionConfigured,
} from './secret-box';

/**
 * Müşteri API anahtarlarını şifreleyen katman.
 *
 * Buradaki testlerin çoğu "doğru çalışıyor mu" değil, "yanlış çalıştığında
 * SESSİZ kalıyor mu" sorusunu soruyor. Bir şifreleme katmanının en tehlikeli
 * hatası patlamak değil, kurcalanmış veriyi sorunsuzmuş gibi çözmektir.
 */
describe('secret-box', () => {
  const ORIJINAL = process.env.SETTINGS_ENCRYPTION_KEY;
  // 32 bayt = 64 hex karakter.
  const HEX_ANAHTAR = 'a'.repeat(64);

  afterEach(() => {
    if (ORIJINAL === undefined) delete process.env.SETTINGS_ENCRYPTION_KEY;
    else process.env.SETTINGS_ENCRYPTION_KEY = ORIJINAL;
  });

  describe('gidiş-dönüş', () => {
    beforeEach(() => {
      process.env.SETTINGS_ENCRYPTION_KEY = HEX_ANAHTAR;
    });

    it('şifrelenen değer aynen geri çözülür', () => {
      const anahtar = 'sk-ant-api03-ÇOK-gizli-değer';
      expect(decryptSecret(encryptSecret(anahtar))).toBe(anahtar);
    });

    it('şifreli metin düz metni içermez', () => {
      const sifreli = encryptSecret('sk-test-1234567890');
      expect(sifreli).not.toContain('sk-test');
      expect(isEncrypted(sifreli)).toBe(true);
    });

    it('aynı değer her seferinde farklı şifreli metin üretir', () => {
      // Rastgele IV olmasaydı iki müşterinin aynı anahtarı kullandığı, hatta
      // bir anahtarın değişmediği veritabanına bakarak anlaşılabilirdi.
      const a = encryptSecret('aynı-değer');
      const b = encryptSecret('aynı-değer');
      expect(a).not.toBe(b);
      expect(decryptSecret(a)).toBe(decryptSecret(b));
    });

    it('boş dizeyi de taşıyabilir', () => {
      expect(decryptSecret(encryptSecret(''))).toBe('');
    });
  });

  describe('kurcalama', () => {
    beforeEach(() => {
      process.env.SETTINGS_ENCRYPTION_KEY = HEX_ANAHTAR;
    });

    it('şifreli metin değiştirilmişse hata fırlatır, bozuk veri döndürmez', () => {
      const sifreli = encryptSecret('sk-gercek-anahtar');
      const [surum, iv, etiket, veri] = sifreli.split(':');
      // Son baytı bozuyoruz.
      const bozuk = Buffer.from(veri, 'base64');
      bozuk[bozuk.length - 1] ^= 0xff;
      const kurcalanmis = [surum, iv, etiket, bozuk.toString('base64')].join(':');

      expect(() => decryptSecret(kurcalanmis)).toThrow();
    });

    it('başka bir anahtarla çözülemez', () => {
      const sifreli = encryptSecret('sk-gercek-anahtar');
      process.env.SETTINGS_ENCRYPTION_KEY = 'b'.repeat(64);
      expect(() => decryptSecret(sifreli)).toThrow();
    });
  });

  describe('geriye dönük uyumluluk', () => {
    beforeEach(() => {
      process.env.SETTINGS_ENCRYPTION_KEY = HEX_ANAHTAR;
    });

    it('şifreleme öncesi yazılmış düz metin olduğu gibi döner', () => {
      // Mevcut kurulumlar bozulmasın diye kasıtlı: ön eki olmayan değer
      // şifrelenmemiş sayılıyor.
      expect(decryptSecret('duz-metin-eski-kayit')).toBe('duz-metin-eski-kayit');
      expect(isEncrypted('duz-metin-eski-kayit')).toBe(false);
    });
  });

  describe('anahtar biçimi', () => {
    it('hex ve base64 anahtarların ikisini de kabul eder', () => {
      const bayt = Buffer.alloc(32, 7);

      process.env.SETTINGS_ENCRYPTION_KEY = bayt.toString('hex');
      const hexIle = encryptSecret('deger');

      process.env.SETTINGS_ENCRYPTION_KEY = bayt.toString('base64');
      // Aynı baytlar, farklı yazım — aynı anahtar olmalı.
      expect(decryptSecret(hexIle)).toBe('deger');
    });

    it('anahtar 32 bayt değilse reddeder', () => {
      process.env.SETTINGS_ENCRYPTION_KEY = 'kisa';
      expect(isEncryptionConfigured()).toBe(false);
      expect(() => encryptSecret('x')).toThrow(/32 bayt/);
    });

    it('anahtar tanımlı değilse reddeder', () => {
      delete process.env.SETTINGS_ENCRYPTION_KEY;
      expect(isEncryptionConfigured()).toBe(false);
      expect(() => encryptSecret('x')).toThrow(/SETTINGS_ENCRYPTION_KEY/);
    });

    it('geçerli anahtarla yapılandırılmış sayılır', () => {
      process.env.SETTINGS_ENCRYPTION_KEY = HEX_ANAHTAR;
      expect(isEncryptionConfigured()).toBe(true);
    });
  });
});
