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

export function tenantHostMatches(
  storedDomain: string | null | undefined,
  requestHost: string | null | undefined,
): boolean {
  const stored = canonicalTenantDomain(storedDomain);
  return Boolean(stored && stored === canonicalTenantDomain(requestHost));
}
