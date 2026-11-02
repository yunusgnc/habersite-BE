import { RssImportService } from './rss-import.service';

/**
 * RSS İLE GELEN HABERİN NUMARASI.
 *
 * Kritik iddia: içe aktarılan haber de panel/API ile oluşturulan haber gibi
 * kalıcı numara alır (en büyük + 1). Eskiden numarasız oluşturuluyordu;
 * panelde "—" görünüyor ve eklenme sırasına göre listede yerini kaybediyordu.
 */
describe('RssImportService — haber numarası', () => {
  const besleme = `<?xml version="1.0"?><rss><channel>
    <item>
      <title>Ajans haberi</title>
      <link>https://ajans.example.com/h/1</link>
      <guid>ajans-1</guid>
      <description>Gövde</description>
      <pubDate>Sun, 01 Nov 2026 10:00:00 GMT</pubDate>
    </item>
  </channel></rss>`;

  let prisma: any;
  let servis: RssImportService;
  const gercekFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(besleme),
    });
    prisma = {
      rssSource: {
        findFirst: jest.fn().mockResolvedValue({
          id: 's1',
          url: 'https://ajans.example.com/rss',
          name: 'Ajans',
          defaultCategoryId: 'k1',
          defaultAuthorName: null,
        }),
        update: jest.fn(),
      },
      user: { findFirst: jest.fn().mockResolvedValue({ id: 'u1' }) },
      rssImportedItem: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      article: {
        findUnique: jest.fn().mockResolvedValue(null),
        aggregate: jest.fn().mockResolvedValue({ _max: { articleNo: 44011 } }),
        create: jest.fn().mockResolvedValue({ id: 'h1' }),
      },
    };
    servis = new RssImportService(prisma);
  });

  afterEach(() => {
    global.fetch = gercekFetch;
  });

  it('içe aktarılan haber en büyük numaranın bir fazlasını alır', async () => {
    const sonuc = await servis.fetchOne('t1', 's1');
    expect(sonuc.imported).toBe(1);
    expect(prisma.article.aggregate).toHaveBeenCalledWith({
      where: { tenantId: 't1' },
      _max: { articleNo: true },
    });
    expect(prisma.article.create.mock.calls[0][0].data.articleNo).toBe(44012);
  });
});
