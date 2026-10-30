/**
 * Haberin gönderilebileceği sosyal ağlar. Sıra panelde de bu sırayla görünür.
 * `social-share.service` aynı adları kullanıyor (`AG_AYARLARI`).
 */
export const SOCIAL_NETWORKS = [
  'telegram',
  'facebook',
  'instagram',
  'x',
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

/** Ağ adı → o ağa paylaşım yetkisini açıp kapatan izin anahtarı. */
export const SOCIAL_NETWORK_PERMISSION = {
  telegram: 'SOCIAL_SHARE_TELEGRAM',
  facebook: 'SOCIAL_SHARE_FACEBOOK',
  instagram: 'SOCIAL_SHARE_INSTAGRAM',
  x: 'SOCIAL_SHARE_X',
} as const satisfies Record<SocialNetwork, string>;

export const USER_PERMISSIONS = [
  'COMMENTS_VIEW',
  'COMMENTS_MODERATE',
  // Ana anahtar: kapalıysa kullanıcı hiçbir ağa gönderemez.
  'SOCIAL_SHARE',
  // Ağ bazlı anahtarlar: ana anahtar açıkken tek tek kısıtlama yapar.
  'SOCIAL_SHARE_TELEGRAM',
  'SOCIAL_SHARE_FACEBOOK',
  'SOCIAL_SHARE_INSTAGRAM',
  'SOCIAL_SHARE_X',
] as const;

export type UserPermission = (typeof USER_PERMISSIONS)[number];
export type PermissionOverrides = Partial<Record<UserPermission, boolean>>;

const ROLE_LEVEL: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  EDITOR: 60,
  REPORTER: 40,
  COLUMNIST: 20,
};

/**
 * Eski hesapların davranışını değiştirmeyen rol varsayılanları. Kullanıcıya
 * özel bir boolean yazılmışsa rolün üstüne geçer; böylece bir Editörün yorum
 * onayı kapatılabilir veya bir Muhabire özellikle açılabilir.
 */
export function defaultPermission(role: string, permission: UserPermission): boolean {
  const level = ROLE_LEVEL[role] ?? 0;
  switch (permission) {
    case 'COMMENTS_VIEW':
    case 'COMMENTS_MODERATE':
      return level >= ROLE_LEVEL.EDITOR;
    case 'SOCIAL_SHARE':
    case 'SOCIAL_SHARE_TELEGRAM':
    case 'SOCIAL_SHARE_FACEBOOK':
    case 'SOCIAL_SHARE_INSTAGRAM':
    case 'SOCIAL_SHARE_X':
      // Yetki eklenmeden önce yayınlayan herkes paylaşabiliyordu; varsayılan
      // açık kalır, admin kişi bazında kapatır. Ağ anahtarları da açık gelir;
      // aksi halde yetki eklenince mevcut kullanıcıların paylaşımı kesilirdi.
      return true;
  }
}

export function normalizePermissionOverrides(value: unknown): PermissionOverrides {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const result: PermissionOverrides = {};
  for (const permission of USER_PERMISSIONS) {
    if (typeof source[permission] === 'boolean') {
      result[permission] = source[permission] as boolean;
    }
  }
  return result;
}

export function hasPermission(
  role: string,
  overrides: unknown,
  permission: UserPermission,
): boolean {
  if (role === 'SUPER_ADMIN') return true;
  const normalized = normalizePermissionOverrides(overrides);
  return normalized[permission] ?? defaultPermission(role, permission);
}

/**
 * Kullanıcının haberi gönderebileceği ağlar. Ana anahtar kapalıysa boş dizi
 * döner (hiçbir ağ). Açıksa yalnızca ağ anahtarı da açık olanlar döner.
 */
export function allowedSocialNetworks(
  role: string,
  overrides: unknown,
): SocialNetwork[] {
  if (!hasPermission(role, overrides, 'SOCIAL_SHARE')) return [];
  return SOCIAL_NETWORKS.filter((ag) =>
    hasPermission(role, overrides, SOCIAL_NETWORK_PERMISSION[ag]),
  );
}

export function effectivePermissions(
  role: string,
  overrides: unknown,
): Record<UserPermission, boolean> {
  return Object.fromEntries(
    USER_PERMISSIONS.map((permission) => [
      permission,
      hasPermission(role, overrides, permission),
    ]),
  ) as Record<UserPermission, boolean>;
}
