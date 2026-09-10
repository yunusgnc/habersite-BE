import { IsDefined, IsNotEmpty, IsObject, ValidateIf } from 'class-validator';

export class UpdateSettingDto {
  /**
   * `IsNotEmpty` değil: boş değer geçerli bir istek — "bu ayarı temizle"
   * demek ve servis onu kaydı silerek karşılıyor (API anahtarı Sil butonunun
   * yolu bu). `IsNotEmpty` boş değeri servise hiç ulaştırmadığı için silme
   * akışı çalışmıyordu.
   *
   * `null` da açıkça KABUL EDİLİR: panel temizlenen alanı null olarak
   * gönderiyor (bkz. lib/silinebilir) ve `IsDefined` null'ı reddettiği için
   * "Paylaşım kimlikleri kaydedilemedi" hatası veriyordu. `ValidateIf` ile
   * null doğrulamayı atlıyor; alanın gövdede HİÇ bulunmaması ise hâlâ hata —
   * eksik `value` sessizce silmeye dönüşmesin.
   */
  @ValidateIf((o: { value: unknown }) => o.value !== null)
  @IsDefined()
  value: any;
}

export class BulkUpdateSettingsDto {
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, any>;
}
