import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';
import { UpdateArticleDto } from './update-article.dto';

/**
 * Manşet alanlarının doğrulaması. Yazı tipi serbest metin değil: site değeri
 * kendi listesine çeviriyor, liste dışı değerin kayda girmesinin anlamı yok.
 */
describe('Manşet alanları doğrulaması', () => {
  const hatalar = async (
    veri: Record<string, unknown>,
    sinif: any = UpdateArticleDto,
  ) => (await validate(plainToInstance(sinif, veri))).map((h) => h.property);

  it('spot başlık, bilinen yazı tipi ve boyut kabul edilir', async () => {
    expect(
      await hatalar({
        spotTitle: 'Kısa satır',
        spotTitleX: 62.5,
        spotTitleY: 38,
        spotTitleWidth: 64,
        headlineFontFamily: 'oswald',
        headlineFontSize: 56,
      }),
    ).toEqual([]);
  });

  it('spot başlığındaki HTML kayda girmeden düz metne çevrilir', () => {
    const dto = plainToInstance(UpdateArticleDto, {
      spotTitle:
        '<span style="font-size: 28px">ACI DEV PANKARTA SIĞMADI</span>',
      headlineTitle: '&lt;b&gt;Manşet&lt;/b&gt;',
    });

    expect(dto.spotTitle).toBe('ACI DEV PANKARTA SIĞMADI');
    expect(dto.headlineTitle).toBe('Manşet');
  });

  it('eski paneldeki yazı tipi değerleri geçerli kalır', async () => {
    for (const eski of ['serif', 'sans', 'condensed']) {
      expect(await hatalar({ headlineFontFamily: eski })).toEqual([]);
    }
  });

  it('liste dışı yazı tipi, çok uzun spot başlık ve aşırı boyut reddedilir', async () => {
    expect(
      await hatalar({ headlineFontFamily: 'Comic Sans; color:red' }),
    ).toEqual(['headlineFontFamily']);
    expect(await hatalar({ spotTitle: 'a'.repeat(161) })).toEqual([
      'spotTitle',
    ]);
    expect(await hatalar({ headlineFontSize: 500 })).toEqual([
      'headlineFontSize',
    ]);
    expect(
      await hatalar({ spotTitleFontFamily: 'yok', spotTitleFontSize: 5 }),
    ).toEqual(['spotTitleFontFamily', 'spotTitleFontSize']);
    expect(
      await hatalar({ spotTitleX: -1, spotTitleY: 101, spotTitleWidth: 10 }),
    ).toEqual(['spotTitleX', 'spotTitleY', 'spotTitleWidth']);
  });

  it('düzenlemede null alanı temizler (doğrulamaya takılmaz)', async () => {
    expect(
      await hatalar({
        spotTitle: null,
        headlineFontFamily: null,
        headlineFontSize: null,
        spotTitleX: null,
        spotTitleY: null,
        spotTitleWidth: null,
      }),
    ).toEqual([]);
  });

  it('yeni haberde de aynı kurallar geçerli', async () => {
    expect(
      await hatalar(
        {
          title: 'Başlık',
          content: { type: 'doc' },
          headlineFontFamily: 'yok',
        },
        CreateArticleDto,
      ),
    ).toEqual(['headlineFontFamily']);
  });
});
