export const USER_PERMISSIONS = [
  'COMMENTS_VIEW',
  'COMMENTS_MODERATE',
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
