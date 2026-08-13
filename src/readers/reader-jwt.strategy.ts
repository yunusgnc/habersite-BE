import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Reader (okuyucu) JWT stratejisi — personel `User` JWT'sinden ayrı bir
 * anahtar boyutu (`type: 'reader'` payload) ile ayrışır. Böylece bir okuyucu
 * token'ı yanlışlıkla panel endpoint'inde geçerli sayılmaz.
 */
interface ReaderJwtPayload {
  sub: string;
  tenantId: string;
  type: 'reader';
}

@Injectable()
export class ReaderJwtStrategy extends PassportStrategy(Strategy, 'reader-jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'changeme'),
    });
  }

  validate(payload: ReaderJwtPayload) {
    if (payload.type !== 'reader') {
      // Personel token'ı (type yok / farklı) reader endpoint'ine giremesin.
      throw new UnauthorizedException('Bu token okuyucu için değil');
    }
    return {
      readerId: payload.sub,
      tenantId: payload.tenantId,
    };
  }
}
