import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug yalnızca küçük harf, rakam ve tire içerebilir',
  })
  slug?: string;

  @IsString()
  @IsOptional()
  domain?: string | null;

  @IsString()
  @IsOptional()
  subdomain?: string | null;

  @IsString()
  @IsOptional()
  logo?: string | null;

  @IsString()
  @IsOptional()
  favicon?: string | null;

  /** Müşteriye özel medya CDN adresi — ör. "https://cdn.kayseritimes.com" */
  @IsString()
  @IsOptional()
  mediaBaseUrl?: string | null;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  plan?: string;

  /**
   * ISO 639-1 iki harflik dil kodu. `html lang`, JSON-LD ve Google News
   * sitemap için kritik — yanlış kod SEO hataları verir.
   */
  @IsString()
  @IsOptional()
  @Matches(/^[a-z]{2}(?:-[A-Z]{2})?$/, {
    message: 'locale ISO 639-1 formatında olmalı (ör. "tr", "en", "tr-TR")',
  })
  locale?: string;

  /**
   * IANA timezone (ör. "Europe/Istanbul"). Tarih/saat gösteriminde ve
   * cron zamanlamasında kullanılır.
   */
  @IsString()
  @IsOptional()
  timezone?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class ResetAdminPasswordDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  password: string;
}
