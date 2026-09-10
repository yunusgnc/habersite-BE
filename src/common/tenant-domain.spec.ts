import {
  canonicalTenantDomain,
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
});
