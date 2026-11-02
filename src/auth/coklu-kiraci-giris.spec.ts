import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

/**
 * ORTAK PANELDEN GİRİŞ — kimlik birden çok kiracıda olabilir.
 *
 * Kritik iddialar: aynı kimlik+şifre iki sitede eşleşirse giriş REDDEDİLMEZ,
 * kiracı listesi dönülür ve kullanıcı seçer (ortak panelde Host ayrıştırması
 * hiçbir zaman tutmuyor — istek API'nin alan adına gidiyor); tek eşleşmede
 * davranış değişmez; yanlış şifre yine 401.
 */
describe('AuthService — çoklu kiracıda giriş', () => {
  let prisma: any;
  let servis: AuthService;
  const SIFRE = 'dogru-sifre';
  let hash: string;

  const hesap = (id: string, tenantId: string, tenantAdi: string) => ({
    id,
    tenantId,
    name: 'Beste Özden',
    email: 'beste@ornek.com',
    role: 'EDITOR',
    active: true,
    passwordHash: hash,
    tenant: { name: tenantAdi, domain: `${tenantAdi}.com`, subdomain: null },
  });

  beforeAll(async () => {
    hash = await bcrypt.hash(SIFRE, 4);
  });

  beforeEach(() => {
    prisma = {
      user: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    servis = new AuthService(prisma, { sign: jest.fn() } as any);
  });

  it('iki sitede eşleşen kimlik reddedilmez, siteler dönülür', async () => {
    prisma.user.findMany.mockResolvedValue([
      hesap('u1', 't1', 'kayseritimes'),
      hesap('u2', 't2', 'kayserianahaber'),
    ]);

    // Ortak panelde istek API'nin alan adına gidiyor; hiçbir kiracıyla eşleşmez.
    const hata = await servis
      .validateUserFlexible('beste@ornek.com', SIFRE, undefined, 'api.habersistesi.digital')
      .catch((e) => e);

    expect(hata).toBeInstanceOf(ConflictException);
    const govde: any = hata.getResponse();
    expect(govde.code).toBe('TENANT_SECIMI_GEREKLI');
    expect(govde.tenants).toEqual([
      { id: 't1', name: 'kayseritimes' },
      { id: 't2', name: 'kayserianahaber' },
    ]);
  });

  it('seçilen kiracı gönderilince o kiracıda giriş yapılır', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'u1',
      tenantId: 't1',
      role: 'EDITOR',
      active: true,
      passwordHash: hash,
    });

    const sonuc: any = await servis.validateUserFlexible(
      'beste@ornek.com',
      SIFRE,
      't1',
    );

    expect(sonuc.id).toBe('u1');
    // Seçim verildiyse tüm kiracılarda arama yapılmaz.
    expect(prisma.user.findMany).not.toHaveBeenCalled();
  });

  it('tek eşleşmede eski davranış sürer — seçim sorulmaz', async () => {
    prisma.user.findMany.mockResolvedValue([hesap('u1', 't1', 'kayseritimes')]);

    const sonuc: any = await servis.validateUserFlexible(
      'beste@ornek.com',
      SIFRE,
      undefined,
      'api.habersistesi.digital',
    );

    expect(sonuc.id).toBe('u1');
    expect(sonuc.passwordHash).toBeUndefined();
  });

  it('Host kiracıyla eşleşiyorsa seçim sorulmaz', async () => {
    prisma.user.findMany.mockResolvedValue([
      hesap('u1', 't1', 'kayseritimes'),
      hesap('u2', 't2', 'kayserianahaber'),
    ]);

    const sonuc: any = await servis.validateUserFlexible(
      'beste@ornek.com',
      SIFRE,
      undefined,
      'kayseritimes.com',
    );

    expect(sonuc.id).toBe('u1');
  });

  it('yanlış şifre iki sitede de eşleşse bile 401', async () => {
    prisma.user.findMany.mockResolvedValue([
      hesap('u1', 't1', 'kayseritimes'),
      hesap('u2', 't2', 'kayserianahaber'),
    ]);

    await expect(
      servis.validateUserFlexible('beste@ornek.com', 'yanlis', undefined, 'api.x'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('hiç eşleşme yoksa 401', async () => {
    await expect(
      servis.validateUserFlexible('yok@ornek.com', SIFRE, undefined, 'api.x'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
