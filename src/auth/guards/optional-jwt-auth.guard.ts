import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Token varsa `request.user`'ı doldurur, yoksa isteği engellemeden geçirir.
 *
 * Hem panelin hem de herkese açık sitenin aynı uç noktayı kullandığı
 * yerlerde gerekli: panel taslakları görebilmeli, ziyaretçi görmemeli.
 * `JwtAuthGuard` kimliksiz isteği 401 ile reddederdi; burada yetkilendirme
 * kararını controller'a bırakıyoruz.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(_err: unknown, user: TUser): TUser {
    // Geçersiz/eksik token bir hata değil — sadece "anonim ziyaretçi" demek.
    return (user ?? null) as TUser;
  }
}
