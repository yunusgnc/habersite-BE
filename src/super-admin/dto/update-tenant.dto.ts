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
