/**
 * ORTAK LİSTE SAYFALAMASI — imleç VE sayfa numarası tek yerden.
 *
 * Panel listeleri "Daha Fazla Göster"den numaralı sayfalamaya geçti
 * (Geri 1 2 3 … 50 İleri). Numaralı sayfalama offset ister; mevcut uçlar
 * imleçliydi. Bu yardımcı iki biçimi tek sözleşmede toplar:
 *
 * - `page` verilirse OFFSET: skip/take + toplam sayfa hesabı.
 * - verilmezse İMLEÇ: limit+1 çek, fazlaysa kırp, imleci DÖNDÜRÜLEN son
 *   kayıttan üret (skip:1 ile birlikte aksi hâlde her sayfa sınırında bir
 *   kayıt atlanır — bkz. articles.service'teki ders).
 *
 * Sıralamayı çağıran verir ve DETERMİNİSTİK olmak zorundadır (id
 * tiebreaker'lı) — aksi hâlde sayfa sınırlarında satır tekrarlar/atlanır.
 */

export type SayfaliSonuc<T> = {
  items: T[];
  total: number;
  totalPages: number;
  page?: number;
  hasMore: boolean;
  nextCursor?: string;
};

export async function sayfaliListe<T extends { id: string }>(opts: {
  /** Toplam kayıt sayısı — aynı where ile count. */
  say: () => Promise<number>;
  /** Kayıtları getirir; verilen sayfalama argümanlarını sorguya eklemeli. */
  bul: (args: {
    take: number;
    skip?: number;
    cursor?: { id: string };
  }) => Promise<T[]>;
  limit: number;
  page?: number;
  cursor?: string;
}): Promise<SayfaliSonuc<T>> {
  const { say, bul, limit } = opts;

  if (opts.page && opts.page > 0) {
    const page = opts.page;
    const [items, total] = await Promise.all([
      bul({ take: limit, skip: (page - 1) * limit }),
      say(),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items, total, totalPages, page, hasMore: page < totalPages };
  }

  const [items, total] = await Promise.all([
    bul({
      take: limit + 1,
      ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    }),
    say(),
  ]);
  const hasMore = items.length > limit;
  if (hasMore) items.pop();
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;
  return {
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    hasMore,
    nextCursor,
  };
}
