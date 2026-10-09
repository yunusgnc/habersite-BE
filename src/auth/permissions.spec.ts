import {
  defaultPermission,
  effectivePermissions,
  hasPermission,
  normalizePermissionOverrides,
} from './permissions';

describe('kullanıcı yetkileri', () => {
  it('eski hesaplarda rol varsayılanlarını korur', () => {
    expect(defaultPermission('EDITOR', 'COMMENTS_VIEW')).toBe(true);
    expect(defaultPermission('EDITOR', 'COMMENTS_MODERATE')).toBe(true);
    expect(defaultPermission('REPORTER', 'COMMENTS_VIEW')).toBe(false);
  });

  it('kullanıcıya özel kapatma rol yetkisinin üstüne geçer', () => {
    expect(
      hasPermission('EDITOR', { COMMENTS_MODERATE: false }, 'COMMENTS_MODERATE'),
    ).toBe(false);
    expect(
      hasPermission('EDITOR', { COMMENTS_MODERATE: false }, 'COMMENTS_VIEW'),
    ).toBe(true);
  });

  it('muhabire kullanıcı bazında yorum yetkisi verilebilir', () => {
    expect(
      hasPermission('REPORTER', { COMMENTS_VIEW: true }, 'COMMENTS_VIEW'),
    ).toBe(true);
  });

  it('bilinmeyen ve boolean olmayan değerleri saklamaz', () => {
    expect(
      normalizePermissionOverrides({
        COMMENTS_VIEW: true,
        COMMENTS_MODERATE: 'evet',
        USERS_DELETE: true,
      }),
    ).toEqual({ COMMENTS_VIEW: true });
  });

  it('etkin yetkileri panel için tam bir harita olarak döndürür', () => {
    expect(effectivePermissions('EDITOR', { COMMENTS_MODERATE: false })).toEqual({
      COMMENTS_VIEW: true,
      COMMENTS_MODERATE: false,
    });
  });
});
