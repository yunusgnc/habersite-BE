import {
  allowedSocialNetworks,
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
      SOCIAL_SHARE: true,
      SOCIAL_SHARE_TELEGRAM: true,
      SOCIAL_SHARE_FACEBOOK: true,
      SOCIAL_SHARE_INSTAGRAM: true,
      SOCIAL_SHARE_X: true,
    });
  });

  it('sosyal paylaşım varsayılan açık, kişi bazında kapatılabilir', () => {
    expect(hasPermission('EDITOR', {}, 'SOCIAL_SHARE')).toBe(true);
    expect(hasPermission('ADMIN', { SOCIAL_SHARE: false }, 'SOCIAL_SHARE')).toBe(false);
  });

  describe('izinli sosyal ağlar', () => {
    it('varsayılanda dört ağ da açık — yetki eklenmesi paylaşımı kesmez', () => {
      expect(allowedSocialNetworks('EDITOR', {})).toEqual([
        'telegram',
        'facebook',
        'instagram',
        'x',
      ]);
    });

    it('kapatılan ağ listeden düşer', () => {
      expect(
        allowedSocialNetworks('EDITOR', { SOCIAL_SHARE_INSTAGRAM: false }),
      ).toEqual(['telegram', 'facebook', 'x']);
    });

    it('ana anahtar kapalıysa hiçbir ağ dönmez', () => {
      expect(
        allowedSocialNetworks('EDITOR', {
          SOCIAL_SHARE: false,
          SOCIAL_SHARE_TELEGRAM: true,
        }),
      ).toEqual([]);
    });

    it('süper admin her ağa paylaşır', () => {
      expect(
        allowedSocialNetworks('SUPER_ADMIN', { SOCIAL_SHARE: false }),
      ).toHaveLength(4);
    });
  });
});
