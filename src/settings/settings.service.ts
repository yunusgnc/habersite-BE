import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import {
  decryptSecret,
  encryptSecret,
  isEncryptionConfigured,
} from '../common/crypto/secret-box';
import { isSecretSettingKey, secretHint } from './secret-settings';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

  /**
   * Tenant'ın ayarları — GİZLİ ANAHTARLAR HARİÇ.
   *
   * Bu ayrım kasıtlı: hem panel hem herkese açık uç bu metodu kullanıyor.
   * Sırları burada hiç döndürmeyerek, herkese açık uçtaki bir filtre hatasının
   * sır sızdırmasını yapısal olarak imkânsız kılıyoruz. Sır okumak için
   * `getSecret()` var ve tek çağıranı sunucu tarafındaki AI servisi.
   */
  async getAll(tenantId: string): Promise<Record<string, any>> {
    const settings = await this.prisma.setting.findMany({
      where: { tenantId },
    });

    return settings.reduce(
      (acc, setting) => {
        if (isSecretSettingKey(setting.key)) return acc;
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  async get(tenantId: string, key: string): Promise<any> {
    if (isSecretSettingKey(key)) {
      // Tek tek okuma yolu da kapalı olmalı; aksi halde `/api/settings/
      // anthropicApiKey` sırrı düz metin döndürürdü.
      return null;
    }
    const setting = await this.prisma.setting.findUnique({
      where: {
        tenantId_key: { tenantId, key },
      },
    });

    return setting?.value ?? null;
  }

  /**
   * Gizli ayarın çözülmüş hâli. Yalnızca sunucu tarafı çağırmalı — dönen değer
   * hiçbir HTTP yanıtına konmamalı.
   */
  async getSecret(tenantId: string, key: string): Promise<string | null> {
    const setting = await this.prisma.setting.findUnique({
      where: { tenantId_key: { tenantId, key } },
    });
    const raw = setting?.value;
    if (typeof raw !== 'string' || !raw) return null;
    try {
      return decryptSecret(raw);
    } catch {
      // Şifreleme anahtarı değişmiş ya da kayıt bozulmuş. Sessizce yanlış
      // değer döndürmektense yok saymak daha güvenli.
      return null;
    }
  }

  /**
   * Panelin "kayıtlı mı" göstergesi. Anahtarın kendisini değil, yalnızca
   * varlığını ve son 4 karakterini döndürür.
   */
  async getSecretStatus(
    tenantId: string,
  ): Promise<Record<string, { configured: boolean; hint: string | null }>> {
    const rows = await this.prisma.setting.findMany({ where: { tenantId } });
    const out: Record<string, { configured: boolean; hint: string | null }> = {};
    for (const row of rows) {
      if (!isSecretSettingKey(row.key)) continue;
      let hint: string | null = null;
      if (typeof row.value === 'string' && row.value) {
        try {
          hint = secretHint(decryptSecret(row.value));
        } catch {
          hint = null;
        }
      }
      out[row.key] = { configured: hint !== null, hint };
    }
    return out;
  }

  /**
   * Gizli anahtarlar için yazma öncesi hazırlık.
   *
   * - Boş değer → kaydı sil (paneldeki "temizle" davranışı).
   * - Şifreleme yapılandırılmamışsa açıkça hata ver. Sessizce düz metin
   *   yazmak en kötü sonuç olurdu: kullanıcı korunduğunu sanır.
   */
  private prepareValue(key: string, value: any): { value: any; remove: boolean } {
    // `null`/`undefined` her ayar için silme demek. Kolona null yazmak
    // veritabanı hatası olurdu; "ayar yok" ile "ayar null" arasında da anlamlı
    // bir fark yok — ikisi de varsayılanın kullanılacağı anlamına geliyor.
    if (value === null || value === undefined) return { value: null, remove: true };

    if (!isSecretSettingKey(key)) return { value, remove: false };

    const plain = typeof value === 'string' ? value.trim() : '';
    if (!plain) return { value: null, remove: true };

    if (!isEncryptionConfigured()) {
      throw new BadRequestException(
        'Sunucuda SETTINGS_ENCRYPTION_KEY tanımlı olmadığı için API anahtarı ' +
          'kaydedilemiyor. Şifrelenmeden saklamıyoruz. Üretmek için: openssl rand -hex 32',
      );
    }
    return { value: encryptSecret(plain), remove: false };
  }

  async upsert(tenantId: string, key: string, value: any) {
    const prepared = this.prepareValue(key, value);

    if (prepared.remove) {
      await this.prisma.setting.deleteMany({ where: { tenantId, key } });
      this.revalidation.revalidateTenant(tenantId, ['settings']);
      return { tenantId, key, removed: true };
    }

    const result = await this.prisma.setting.upsert({
      where: {
        tenantId_key: { tenantId, key },
      },
      update: { value: prepared.value },
      create: { tenantId, key, value: prepared.value },
    });
    this.revalidation.revalidateTenant(tenantId, ['settings']);
    // Gizli anahtarda kaydın kendisini döndürmüyoruz — `value` şifreli de olsa
    // yanıt gövdesinde dolaşmasının bir faydası yok.
    return isSecretSettingKey(key) ? { tenantId, key, saved: true } : result;
  }

  async bulkUpsert(tenantId: string, settings: Record<string, any>) {
    const removals: string[] = [];
    const writes: Array<{ key: string; value: any }> = [];

    for (const [key, value] of Object.entries(settings)) {
      const prepared = this.prepareValue(key, value);
      if (prepared.remove) removals.push(key);
      else writes.push({ key, value: prepared.value });
    }

    await this.prisma.$transaction([
      ...removals.map((key) =>
        this.prisma.setting.deleteMany({ where: { tenantId, key } }),
      ),
      ...writes.map(({ key, value }) =>
        this.prisma.setting.upsert({
          where: {
            tenantId_key: { tenantId, key },
          },
          update: { value },
          create: { tenantId, key, value },
        }),
      ),
    ]);

    this.revalidation.revalidateTenant(tenantId, ['settings']);
    // Yanıtta yalnızca hangi anahtarların işlendiği — değerler değil.
    return { updated: writes.map((w) => w.key), removed: removals };
  }
}
