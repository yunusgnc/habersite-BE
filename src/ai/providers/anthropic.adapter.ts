import Anthropic from '@anthropic-ai/sdk';
import {
  AiCompletionRequest,
  AiProviderAdapter,
  AiProviderError,
} from '../ai.types';
import { describeProviderError } from './describe-error';

/**
 * Anthropic (Claude) adaptörü.
 *
 * Varsayılan neden en güçlü model değil: bu yardımcılar spot çıkarıyor, etiket
 * öneriyor, başlık türetiyor — hiçbiri derin akıl yürütme istemiyor. Küçük model
 * hem kat kat ucuz hem de yeni API hesaplarının düşük kullanım sınırlarına
 * takılmıyor; üst seviye modeller ilk kademede sık sık istek sınırı hatası
 * veriyor. Daha iyi sonuç isteyen Ayarlar → Yapay Zekâ'dan modeli değiştirebilir.
 */
export const ANTHROPIC_DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export class AnthropicAdapter implements AiProviderAdapter {
  readonly name = 'anthropic';
  readonly defaultModel = ANTHROPIC_DEFAULT_MODEL;

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async complete(req: AiCompletionRequest): Promise<Record<string, any>> {
    const client = new Anthropic({ apiKey: this.apiKey });

    let response: Anthropic.Message;
    try {
      response = await client.messages.create({
        model: this.model,
        max_tokens: req.maxTokens,
        system: req.system,
        // Yapısal çıktı: dönen ilk metin bloğu şemaya uyan geçerli JSON olur,
        // yani "JSON döndür" diye yalvarıp ayrıştırma denemeye gerek kalmıyor.
        // `effort: low` bu işler için yeterli — spot çıkarmak veya etiket
        // önermek derin akıl yürütme istemiyor, düşük efor hem hızlı hem ucuz.
        output_config: {
          effort: 'low',
          format: { type: 'json_schema', schema: req.schema },
        },
        messages: [{ role: 'user', content: req.user }],
      });
    } catch (err: any) {
      throw new AiProviderError(
        describeProviderError(err, this.name, this.model),
        this.name,
      );
    }

    // Güvenlik sınıflandırıcıları isteği reddedebilir: HTTP 200 döner ama
    // `stop_reason` "refusal" olur ve `content` boş kalır. `content[0]`'ı
    // doğrudan okumak burada patlardı.
    if (response.stop_reason === 'refusal') {
      throw new AiProviderError(
        'Sağlayıcı bu içerik için isteği reddetti. Metni gözden geçirip tekrar deneyin.',
        this.name,
      );
    }

    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') {
      throw new AiProviderError('Sağlayıcı boş yanıt döndürdü.', this.name);
    }

    try {
      return JSON.parse(text.text);
    } catch {
      throw new AiProviderError(
        'Sağlayıcı beklenen biçimde yanıt vermedi.',
        this.name,
      );
    }
  }
}
