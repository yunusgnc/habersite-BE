"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTenantHost = normalizeTenantHost;
exports.canonicalTenantDomain = canonicalTenantDomain;
exports.tenantDomainCandidates = tenantDomainCandidates;
exports.tenantHostMatches = tenantHostMatches;
exports.corsHostCandidates = corsHostCandidates;
function normalizeTenantHost(value) {
    const raw = value?.trim();
    if (!raw)
        return '';
    try {
        const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
        return url.hostname.toLowerCase().replace(/\.$/, '');
    }
    catch {
        return raw.split('/')[0].split(':')[0].toLowerCase().replace(/\.$/, '');
    }
}
function canonicalTenantDomain(value) {
    return normalizeTenantHost(value).replace(/^www\./, '');
}
function tenantDomainCandidates(value) {
    const host = normalizeTenantHost(value);
    if (!host)
        return [];
    const canonical = canonicalTenantDomain(host);
    const candidates = new Set([host, canonical]);
    if (canonical.includes('.') && !/^\d+(?:\.\d+){3}$/.test(canonical)) {
        candidates.add(`www.${canonical}`);
    }
    return [...candidates];
}
function tenantHostMatches(storedDomain, requestHost) {
    const stored = canonicalTenantDomain(storedDomain);
    const gelen = canonicalTenantDomain(requestHost);
    if (!stored || !gelen)
        return false;
    if (stored === gelen)
        return true;
    return gelen.startsWith('admin.') && gelen.slice('admin.'.length) === stored;
}
function corsHostCandidates(value) {
    const adaylar = tenantDomainCandidates(value);
    const canonical = canonicalTenantDomain(value);
    if (canonical.includes('.') && !/^\d+(?:\.\d+){3}$/.test(canonical)) {
        adaylar.push(`admin.${canonical}`);
    }
    return [...new Set(adaylar)];
}
//# sourceMappingURL=tenant-domain.js.map