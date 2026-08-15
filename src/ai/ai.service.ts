import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import {
  AI_PROVIDER_KEY_SETTING,
  AI_PROVIDER_SETTING_KEY,
  AiProvider,
  normalizeAiProvider,
} from '../settings/secret-settings';
import { AiProviderAdapter, AiProviderError } from './ai.types';
import {
  ANTHROPIC_DEFAULT_MODEL,
  AnthropicAdapter,
} from './providers/anthropic.adapter';
import { OPENAI_DEFAULT_MODEL, OpenAiAdapter } from './providers/openai.adapter';
import { AI_TASKS, AiTaskName } from './ai.tasks';

/** Modele gönderilen içeriğin üst sınırı — maliyeti öngörülebilir tutar. */
const MAX_CONTENT_CHARS = 6000;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly settings: SettingsService) {}

  /**
   * Tenant hangi sağlayıcıyı seçtiyse onun adaptörünü kurar.
   *
   * Anahtar `getSecret` ile okunuyor — `getAll` sırları hiç döndürmüyor, bu
   * yüzden ayrı ve açıkça adlandırılmış yol var. Okunan değer yalnızca burada
   * kalıyor; hiçbir HTTP yanıtına konmuyor.
   */
  private async resolveAdapter(tenantId: string): Promise<AiProviderAdapter> {
    const all = await this.settings.getAll(tenantId);
    const provider: AiProvider = normalizeAiProvider(
      all[AI_PROVIDER_SETTING_KEY],
    );

    const apiKey = await this.settings.getSecret(
      tenantId,
      AI_PROVIDER_KEY_SETTING[provider],
    );
    if (!apiKey) {
      throw new BadRequestException(
        provider === 'openai'
          ? 'OpenAI API anahtarı tanımlı değil. Ayarlar → Yapay Zekâ bölümünden ekleyin.'
          : 'Anthropic API anahtarı tanımlı değil. Ayarlar → Yapay Zekâ bölümünden ekleyin.',
      );
    }

    // Model adı ayardan ezilebilir: sağlayıcılar model adlarını emekliye
    // ayırdığında kod değişikliği beklemeden geçiş yapılabilsin.
    const override =
      typeof all.aiModel === 'string' ? all.aiModel.trim() : '';

    return provider === 'openai'
      ? new OpenAiAdapter(apiKey, override || OPENAI_DEFAULT_MODEL)
      : new AnthropicAdapter(apiKey, override || ANTHROPIC_DEFAULT_MODEL);
  }

  async assist(
    tenantId: string,
    task: AiTaskName,
    input: { title: string; content?: string; spot?: string },
  ): Promise<Record<string, any>> {
    const spec = AI_TASKS[task];
    if (!spec) throw new BadRequestException(`Bilinmeyen görev: ${task}`);

    const body = stripHtml(input.content ?? '');
    if (!input.title?.trim() && !body) {
      throw new BadRequestException(
        'Önce başlık veya içerik girin — yardımcının çalışacağı bir metin yok.',
      );
    }

    const parts = [`BAŞLIK: ${input.title?.trim() || '(boş)'}`];
    if (input.spot?.trim()) parts.push(`MEVCUT SPOT: ${input.spot.trim()}`);
    if (body) parts.push(`İÇERİK:\n${body.slice(0, MAX_CONTENT_CHARS)}`);

    const adapter = await this.resolveAdapter(tenantId);

    try {
      return await adapter.complete({
        system: spec.system,
        user: parts.join('\n\n'),
        schema: spec.schema,
        maxTokens: spec.maxTokens,
      });
    } catch (err) {
      if (err instanceof AiProviderError) {
        // Sağlayıcı mesajı kullanıcıya olduğu gibi gidiyor; API anahtarı
        // içermediğinden güvenli ve "bir hata oluştu"dan çok daha faydalı.
        this.logger.warn(`[ai:${err.provider}] ${err.message}`);
        throw new ServiceUnavailableException(err.message);
      }
      throw err;
    }
  }
}

/**
 * Editör HTML üretiyor; modele düz metin göndermek hem ucuz hem daha isabetli.
 * Blok sonlarını boşluğa çeviriyoruz ki kelimeler birbirine yapışmasın.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|h[1-6]|li|br)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
