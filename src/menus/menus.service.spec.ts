import { MenusService } from './menus.service';

describe('MenusService', () => {
  const prisma = {
    menu: {
      findUnique: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
  } as any;
  const revalidation = { revalidateTenant: jest.fn() } as any;
  const service = new MenusService(prisma, revalidation);

  beforeEach(() => jest.clearAllMocks());

  it('bozuk eski menüyü site varsayılanlarıyla doldurur', async () => {
    prisma.menu.findUnique.mockResolvedValue({
      id: 'menu-1',
      tenantId: 'tenant-1',
      location: 'header-corporate',
      label: null,
      items: [[]],
    });

    const result = await service.findByLocation('tenant-1', 'header-corporate');

    expect(result.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'İhbar Hattı', url: '/ihbar' }),
        expect.objectContaining({ label: 'Künye', url: '/kunye' }),
      ]),
    );
  });

  it('ana menü kaydı yoksa aktif kategorilerden üretir', async () => {
    prisma.menu.findUnique.mockResolvedValue(null);
    prisma.category.findMany.mockResolvedValue([
      { name: 'Gündem', slug: 'gundem' },
      { name: 'Spor', slug: 'spor' },
    ]);

    const result = await service.findByLocation('tenant-1', 'header-main');

    expect(result.items).toEqual([
      { label: 'Gündem', url: '/kategori/gundem', order: 0 },
      { label: 'Spor', url: '/kategori/spor', order: 1 },
    ]);
  });

  it('geçerli kayıtları sıralayıp temizler', async () => {
    prisma.menu.findUnique.mockResolvedValue({
      location: 'footer-servisler',
      items: [
        { label: ' İletişim ', url: ' /iletisim ', order: 4 },
        { label: 'Künye', url: '/kunye', order: 1 },
        [],
      ],
    });

    const result = await service.findByLocation('tenant-1', 'footer-servisler');

    expect(result.items).toEqual([
      { label: 'Künye', url: '/kunye', order: 0 },
      { label: 'İletişim', url: '/iletisim', order: 1 },
    ]);
  });
});
