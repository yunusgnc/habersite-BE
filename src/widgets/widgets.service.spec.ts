import { yerelGazeteleriNormalizeEt } from './widgets.service';

describe('yerelGazeteleriNormalizeEt', () => {
  it('eksik kapakları atar ve desteklenmeyen alanları saklamaz', () => {
    expect(
      yerelGazeteleriNormalizeEt([
        { id: 'k1', name: 'Kayseri Haber', image: '/kapak.jpg', admin: true },
        { id: 'k2', name: 'Görselsiz' },
      ]),
    ).toEqual([
      {
        id: 'k1',
        name: 'Kayseri Haber',
        image: '/kapak.jpg',
        imageFull: undefined,
        url: undefined,
        date: undefined,
      },
    ]);
  });
});
