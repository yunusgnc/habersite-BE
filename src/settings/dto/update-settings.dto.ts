import { IsDefined, IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSettingDto {
  /**
   * `IsNotEmpty` değil `IsDefined`: boş değer geçerli bir istek — "bu ayarı
   * temizle" demek ve servis onu kaydı silerek karşılıyor (API anahtarı Sil
   * butonunun yolu bu). `IsNotEmpty` boş değeri servise hiç ulaştırmadığı için
   * silme akışı çalışmıyordu. Alanın gövdede bulunması yine zorunlu, böylece
   * eksik `value` sessizce silmeye dönüşmüyor.
   */
  @IsDefined()
  value: any;
}

export class BulkUpdateSettingsDto {
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, any>;
}
