import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** Haber kategorisinden resmi ilan aktarma isteği. */
export class ImportNoticesDto {
  /** Aktarılacak kategorinin adres parçası, ör. "resmi-reklamlar". */
  @IsString()
  categorySlug!: string;

  /** true → hiçbir şey yazılmaz, yalnızca ne olacağı döner. */
  @IsBoolean()
  @IsOptional()
  dryRun?: boolean;

  /**
   * İlanın yayından kaç gün sonra arşive düşeceği. Kaynak haberlerde son
   * başvuru tarihi tutulmuyor; tarih ancak böyle türetilebiliyor.
   */
  @IsInt()
  @Min(1)
  @Max(3650)
  @Type(() => Number)
  @IsOptional()
  expireAfterDays?: number;
}
