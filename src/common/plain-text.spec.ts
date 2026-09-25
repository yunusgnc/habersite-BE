import { duzMetneCevir } from './plain-text';

describe('duzMetneCevir', () => {
  it('HTML taşıyan spot başlığını düz metne indirger', () => {
    expect(
      duzMetneCevir(
        '<span style="font-size: 28px">ACI DEV PANKARTA SIĞMADI</span>',
      ),
    ).toBe('ACI DEV PANKARTA SIĞMADI');
  });

  it('iki kez kodlanmış etiketleri ve varlıkları temizler', () => {
    expect(
      duzMetneCevir('&amp;lt;b&amp;gt;Kudüs &amp;amp; Gazze&amp;lt;/b&amp;gt;'),
    ).toBe('Kudüs & Gazze');
  });

  it('null ve undefined değerleri değiştirmez', () => {
    expect(duzMetneCevir(null)).toBeNull();
    expect(duzMetneCevir(undefined)).toBeUndefined();
  });
});
