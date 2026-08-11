/**
 * Eski sitenin görsel yollarını yeni CDN adresine çevirir.
 *
 * Diskteki `storage/app/public/images/` ağacı R2'ye olduğu gibi
 * `uploads/{tenantId}/legacy/` altına kopyalanıyor. Bu yüzden eşleme
 * bire bir: `images/haberler/2020/10/x.jpg` → `legacy/haberler/2020/10/x.jpg`
 *
 * Tablo → klasör eşleşmesi 193.341 kayıt üzerinde ölçülerek doğrulandı (%99,8):
 *   haberler    → images/haberler
 *   makaleler   → images/makaleler
 *   yazarlar    → images/yazarlar
 *   haberresim  → images/habergaleri
 *   galeriresim → images/galeri
 *   videolar    → images/videogaleri, images/video
 */

export type MediaResolver = {
  /** Tablo kolonundaki göreli yolu tam CDN adresine çevirir. */
  file(folder: string, relPath: string | null | undefined): string | null;
  /** Haber içeriği HTML'indeki kendi-sunucu adreslerini CDN'e çevirir. */
  rewriteHtml(html: string): string;
};

/**
 * Sitenin geçmişte kullandığı alan adları. İçerik HTML'inde her ikisi de
 * geçiyor (site gastepress.com iken yazılan haberler kayseritimes.com'a
 * taşınmış ama gövdedeki mutlak adresler güncellenmemiş).
 */
const LEGACY_HOSTS = ['kayseritimes.com', 'gastepress.com'];

export function createMediaResolver(opts: {
  cdnBaseUrl: string;
  tenantId: string;
  /** R2'de dosyaların bulunduğu önek — rclone hedefiyle aynı olmalı. */
  prefix?: string;
}): MediaResolver {
  const base = opts.cdnBaseUrl.replace(/\/+$/, '');
  const prefix = (opts.prefix ?? 'legacy').replace(/^\/+|\/+$/g, '');
  const root = `${base}/uploads/${opts.tenantId}/${prefix}`;

  const file = (folder: string, relPath: string | null | undefined) => {
    const p = (relPath ?? '').trim();
    if (!p) return null;
    // Zaten mutlak adresse (harici ajans görseli) dokunma.
    if (/^https?:\/\//i.test(p)) return p;
    const clean = p.replace(/^\/+/, '');
    const dir = folder.replace(/^\/+|\/+$/g, '');
    return dir ? `${root}/${dir}/${clean}` : `${root}/${clean}`;
  };

  // Kendi alan adlarımızdan gelen /images/... adreslerini yakala.
  // Örn: https://www.kayseritimes.com/images/files/2020/10/x.jpg
  //   →  {root}/files/2020/10/x.jpg
  const hostGroup = LEGACY_HOSTS.map((h) => h.replace(/\./g, '\\.')).join('|');
  const absolutePattern = new RegExp(
    `https?://(?:www\\.)?(?:${hostGroup})/images/([^"'\\s>)]+)`,
    'gi',
  );
  // Alan adı olmadan yazılmış göreli adresler: src="/images/haberler/..."
  const relativePattern = /(["'(])\/images\/([^"'\s>)]+)/gi;

  const rewriteHtml = (html: string) => {
    if (!html) return html;
    return html
      .replace(absolutePattern, (_m, path) => `${root}/${path}`)
      .replace(relativePattern, (_m, quote, path) => `${quote}${root}/${path}`);
  };

  return { file, rewriteHtml };
}
