/** Domain alanlarını protokol, port, yol ve www farkından arındırır. */
export function normalizeTenantHost(value: string | null | undefined): string {
  const raw = value?.trim();
  if (!raw) return '';

  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`,
    );
    return url.hostname.toLowerCase().replace(/\.$/, '');
  } catch {
    return raw.split('/')[0].split(':')[0].toLowerCase().replace(/\.$/, '');
  }
}

/** Veritabanında apex domaini saklarız; www aynı tenant'ın takma adıdır. */
export function canonicalTenantDomain(
  value: string | null | undefined,
): string {
  return normalizeTenantHost(value).replace(/^www\./, '');
}

export function tenantDomainCandidates(
  value: string | null | undefined,
): string[] {
  const host = normalizeTenantHost(value);
  if (!host) return [];

  const canonical = canonicalTenantDomain(host);
  const candidates = new Set([host, canonical]);
  if (canonical.includes('.') && !/^\d+(?:\.\d+){3}$/.test(canonical)) {
    candidates.add(`www.${canonical}`);
  }
  return [...candidates];
}

/**
 * İstek bu kiracıya mı geldi?
 *
 * Aynı kullanıcı adı birden çok kiracıda varsa giriş, isteğin geldiği
 * Host'a bakarak doğru kiracıyı seçiyor. Panel her müşteriye kendi
 * `admin.<alanadı>` adresinden sunulduğu için bu ön eki de tanımalıyız;
 * tanımazsa kullanıcı "birden fazla hesap eşleşti" hatasıyla karşılaşır
 * ve kendi panel adresinden giriş yaptığı hâlde içeri giremez.
 */
export function tenantHostMatches(
  storedDomain: string | null | undefined,
  requestHost: string | null | undefined,
): boolean {
  const stored = canonicalTenantDomain(storedDomain);
  const gelen = canonicalTenantDomain(requestHost);
  if (!stored || !gelen) return false;
  if (stored === gelen) return true;
  return gelen.startsWith('admin.') && gelen.slice('admin.'.length) === stored;
}

/**
 * CORS izin listesi için aday hostlar — kiracının alan adları + `admin.<alanadı>`.
 *
 * Yönetim paneli her müşteriye kendi alt alan adından sunuluyor
 * (admin.ornek.com) ve tarayıcıdan doğrudan API'ye çağrı yapıyor. Alt alan
 * adı bu listeye girmezse panel açılır, ama hiçbir veri gelmez ve hata da
 * yalnızca tarayıcı konsolunda görünür.
 *
 * Neden `tenantDomainCandidates`e eklenmiyor: o fonksiyon kiracı
 * çözümlemede (hangi Host hangi müşteri) ve süper-admin'deki alan adı
 * çakışma denetiminde de kullanılıyor. Admin alt alan adını oraya katmak,
 * yeni müşteri eklerken "bu alan adı zaten kullanılıyor" gibi yanlış
 * hatalar üretirdi. Bu liste yalnızca CORS içindir.
 */
export function corsHostCandidates(value: string | null | undefined): string[] {
  const adaylar = tenantDomainCandidates(value);
  const canonical = canonicalTenantDomain(value);
  // IP adresine alt alan adı eklenmez.
  if (canonical.includes('.') && !/^\d+(?:\.\d+){3}$/.test(canonical)) {
    adaylar.push(`admin.${canonical}`);
  }
  return [...new Set(adaylar)];
}
