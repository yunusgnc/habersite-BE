import {
  canonicalTenantDomain,
  corsHostCandidates,
  normalizeTenantHost,
  tenantDomainCandidates,
  tenantHostMatches,
} from './tenant-domain';

describe('tenant domain helpers', () => {
  it('protokol, port ve yolu temizler', () => {
    expect(normalizeTenantHost(' HTTPS://WWW.KudusAnaHaber.com:443/foo ')).toBe(
      'www.kudusanahaber.com',
    );
  });

  it('www ve apex alan adını aynı tenant olarak kabul eder', () => {
    expect(canonicalTenantDomain('www.kudusanahaber.com')).toBe(
      'kudusanahaber.com',
    );
    expect(
      tenantHostMatches('kudusanahaber.com', 'www.kudusanahaber.com'),
    ).toBe(true);
    expect(
      tenantHostMatches('www.kudusanahaber.com', 'kudusanahaber.com'),
    ).toBe(true);
  });

  it('veritabanı sorgusu için her iki alan adı biçimini üretir', () => {
    expect(tenantDomainCandidates('https://www.kudusanahaber.com')).toEqual([
      'www.kudusanahaber.com',
      'kudusanahaber.com',
    ]);
    expect(tenantDomainCandidates('kudusanahaber.com')).toEqual([
      'kudusanahaber.com',
      'www.kudusanahaber.com',
    ]);
  });

  /**
   * Panel her müşteriye kendi alt alan adından sunuluyor; o origin CORS
   * listesine girmezse panel açılır ama hiçbir veri gelmez.
   */
  it('CORS listesine admin alt alan adını da ekler', () => {
    expect(corsHostCandidates('https://www.kudusanahaber.com')).toEqual([
      'www.kudusanahaber.com',
      'kudusanahaber.com',
      'admin.kudusanahaber.com',
    ]);
    expect(corsHostCandidates('kudusanahaber.com')).toContain(
      'admin.kudusanahaber.com',
    );
  });

  it('kiracı çözümlemesi admin alt alan adından ETKİLENMEZ', () => {
    // Çakışma denetimi ve Host eşlemesi bu listeyi kullanıyor; admin
    // alt alan adı buraya sızarsa yeni müşteri eklerken yanlış
    // "alan adı kullanılıyor" hatası çıkar.
    expect(tenantDomainCandidates('kudusanahaber.com')).not.toContain(
      'admin.kudusanahaber.com',
    );
  });

  it('IP adresine admin alt alan adı eklemez', () => {
    expect(corsHostCandidates('91.108.121.75')).toEqual(['91.108.121.75']);
  });

  it('giriş, admin alt alan adından gelen isteği de kiracıya eşler', () => {
    expect(
      tenantHostMatches('kudusanahaber.com', 'admin.kudusanahaber.com'),
    ).toBe(true);
    // Başka bir müşterinin paneli bu kiracıya eşleşmemeli.
    expect(
      tenantHostMatches('kudusanahaber.com', 'admin.kayseritimes.com'),
    ).toBe(false);
    expect(tenantHostMatches('kudusanahaber.com', 'admin.com')).toBe(false);
  });

  it('boş alan adında boş liste döner', () => {
    expect(corsHostCandidates(null)).toEqual([]);
    expect(corsHostCandidates('')).toEqual([]);
  });
});
