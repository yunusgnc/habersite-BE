import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateTenantDto {
  /** Müşterinin site adı — ör. "Kayseri Gündem" */
  @IsString()
  @MinLength(2)
  name: string;

  /** URL-dostu benzersiz kimlik — ör. "kayseri-gundem" */
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug yalnızca küçük harf, rakam ve tire içerebilir',
  })
  slug: string;

  /** Müşterinin kendi domaini — ör. "www.kayserigundem.com" */
  @IsString()
  @IsOptional()
  domain?: string;

  /** Platform alt alan adı — ör. "kayserigundem" (kayserigundem.habersite.com) */
  @IsString()
  @IsOptional()
  subdomain?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  plan?: string;

  /** Widget'lar için varsayılan şehir */
  @IsString()
  @IsOptional()
  city?: string;

  /** Tema ana rengi — ör. "#bc1010" */
  @IsString()
  @IsOptional()
  primaryColor?: string;

  // ── Müşterinin admin hesabı ──
  @IsString()
  @MinLength(2)
  adminName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9._-]+$/, {
    message: 'kullanıcı adı yalnızca küçük harf, rakam, nokta, alt çizgi ve tire içerebilir',
  })
  adminUsername?: string;

  @IsString()
  @MinLength(8)
  adminPassword: string;

  /** Varsayılan içerikleri (widget, ayar) otomatik oluştur */
  @IsBoolean()
  @IsOptional()
  bootstrapDefaults?: boolean;
}
