import { CommentStatus } from '@prisma/client';
import { CommentsService } from './comments.service';

describe('CommentsService moderasyon akışı', () => {
  const prisma = {
    comment: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    article: {
      update: jest.fn(),
    },
  } as any;
  const service = new CommentsService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.comment.create.mockImplementation(({ data }: any) =>
      Promise.resolve({ id: 'yorum-1', ...data }),
    );
    prisma.comment.count.mockResolvedValue(1);
    prisma.comment.findMany.mockResolvedValue([]);
    prisma.article.update.mockResolvedValue({});
  });

  it('temiz yorumu otomatik onaylamaz, beklemeye alır', async () => {
    await service.create(
      'tenant-1',
      {
        articleId: 'haber-1',
        name: 'Okur',
        email: 'okur@example.com',
        content: 'Haberi faydalı buldum.',
      },
      '127.0.0.1',
    );

    expect(prisma.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: CommentStatus.PENDING }),
      }),
    );
  });

  it('panel listesinde yorumla birlikte haber özetini getirir', async () => {
    await service.findAll('tenant-1', { page: 1, limit: 20 });

    expect(prisma.comment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          article: {
            select: { id: true, title: true, slug: true },
          },
        },
      }),
    );
  });

  it('belirgin spam yorumu onay bekletmeden spam olarak ayırır', async () => {
    await service.create(
      'tenant-1',
      {
        articleId: 'haber-1',
        name: 'X',
        email: 'gecersiz',
        content: 'VIAGRA CASINO https://bit.ly/a https://bit.ly/b!!!!!!',
      },
      '127.0.0.1',
    );

    expect(prisma.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: CommentStatus.SPAM }),
      }),
    );
  });
});
