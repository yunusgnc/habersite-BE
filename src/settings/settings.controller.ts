import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { SettingsService } from './settings.service';
import { isEncryptionConfigured } from '../common/crypto/secret-box';
import { UpdateSettingDto, BulkUpdateSettingsDto } from './dto/update-settings.dto';

@Controller('api/settings')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll(@CurrentTenant() tenantId: string) {
    return this.settingsService.getAll(tenantId);
  }

  /**
   * Gizli ayarların yalnızca DURUMU — değerleri değil.
   *
   * `getAll` sırları hiç döndürmediği için panelin "API anahtarı kayıtlı mı"
   * sorusuna cevap verecek ayrı bir uca ihtiyacı var. Dönen tek şey
   * `{ configured, hint }`; anahtarın kendisi tarayıcıya inmiyor.
   *
   * `:key` rotasından ÖNCE tanımlı olmalı — aksi halde "secret-status" bir
   * ayar adı sanılıp oraya düşer.
   */
  @Get('secret-status')
  getSecretStatus(@CurrentTenant() tenantId: string) {
    return this.settingsService.getSecretStatus(tenantId);
  }

  /**
   * Sunucu sır saklayabilecek durumda mı — `SETTINGS_ENCRYPTION_KEY` tanımlı mı.
   *
   * Anahtarın kendisi hakkında hiçbir bilgi vermiyor, yalnızca "hazır mı"
   * diyor; yine de yönetici korumasının arkasında duruyor.
   *
   * Neden var: anahtar tanımlı değilken API anahtarı kaydetmek 400 dönüyor ve
   * kullanıcı bunu ancak formu doldurup kaydete bastıktan SONRA öğreniyor.
   * Uçtan uca testlerde de aynı durum, ürün bozuk olmadığı hâlde anlaşılmaz
   * bir kırılma olarak görünüyordu; test kurulumu artık bunu önden yoklayıp
   * ne yapılması gerektiğini söylüyor.
   *
   * `:key` rotasından ÖNCE tanımlı olmalı.
   */
  @Get('encryption-status')
  getEncryptionStatus() {
    return { ready: isEncryptionConfigured() };
  }

  @Get(':key')
  get(
    @CurrentTenant() tenantId: string,
    @Param('key') key: string,
  ) {
    return this.settingsService.get(tenantId, key);
  }

  @Put()
  bulkUpsert(
    @CurrentTenant() tenantId: string,
    @Body() dto: BulkUpdateSettingsDto,
  ) {
    return this.settingsService.bulkUpsert(tenantId, dto.settings);
  }

  @Put(':key')
  upsert(
    @CurrentTenant() tenantId: string,
    @Param('key') key: string,
    @Body() dto: UpdateSettingDto,
  ) {
    return this.settingsService.upsert(tenantId, key, dto.value);
  }
}
