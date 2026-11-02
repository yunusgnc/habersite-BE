import { Logger } from '@nestjs/common';

/** Numara okumak için gereken asgari Prisma yüzeyi (test edilebilirlik için). */
type NumaraOkuyucu = {
  article: {
    aggregate(args: {
      where: { tenantId: string };
      _max: { articleNo: true };
    }): Promise<{ _max: { articleNo: number | null } }>;
  };
};

const EN_FAZLA_DENEME = 5;

/**
 * KALICI haber numarası atar ve kaydı oluşturur — haber oluşturan HER yol
 * (panel/API ve RSS içe aktarma) bunu kullanmalı.
 *
 * Numara kiracı içinde 1'den başlar ve her yeni haberde artar; panelde
 * "kaçıncı haber" olarak gösteriliyor ve liste bu numaraya göre sıralanıyor.
 * Numarasız oluşturulan bir haber (eskiden RSS içe aktarma böyleydi) bir
 * sonraki açılıştaki düzeltmeye kadar "—" görünür ve sırayı bozar.
 *
 * Eşzamanlı iki kayıt aynı numarayı okuyabilir; `@@unique([tenantId,
 * articleNo])` ikincisini reddeder ve numarayı yeniden okuyup deniyoruz.
 * Sayaç tablosu yerine bu yol seçildi: fazladan yazma kilidi getirmiyor ve
 * çakışma pratikte nadirdir.
 */
export async function haberNumarasiylaOlustur<T>(
  prisma: NumaraOkuyucu,
  tenantId: string,
  olustur: (articleNo: number) => Promise<T>,
  logger?: Logger,
): Promise<T> {
  for (let deneme = 1; ; deneme++) {
    const enBuyuk = await prisma.article.aggregate({
      where: { tenantId },
      _max: { articleNo: true },
    });
    try {
      return await olustur((enBuyuk._max.articleNo ?? 0) + 1);
    } catch (err) {
      const cakisma =
        (err as { code?: string }).code === 'P2002' &&
        JSON.stringify(
          (err as { meta?: { target?: unknown } }).meta?.target ?? '',
        ).includes('article_no');
      if (!cakisma || deneme >= EN_FAZLA_DENEME) throw err;
      logger?.warn(
        `Haber numarası çakıştı (${tenantId}), yeniden deneniyor (${deneme}/${EN_FAZLA_DENEME}).`,
      );
    }
  }
}
