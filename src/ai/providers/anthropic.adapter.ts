import Anthropic from '@anthropic-ai/sdk';
import {
  AiCompletionRequest,
  AiProviderAdapter,
  AiProviderError,
} from '../ai.types';

/**
 * Anthropic (Claude) adaptörü.
 *
 * Model notu: `claude-opus-5` sabit kimlik, tarih eki almıyor. Tenant
 * `aiModel` ayarıyla başka bir model yazabilir — sağlayıcı model adlarını
 * emekliye ayırdığında kod değişikliği beklemeden geçiş yapılabilsin.
 */
export const ANTHROPIC_DEFAULT_MODEL = 'claude-opus-5';

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
      throw new AiProviderError(this.describe(err), this.name);
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

  /** SDK hatasını kullanıcının ne yapacağını anlayacağı bir cümleye çevirir. */
  private describe(err: any): string {
    const status = err?.status;
    if (status === 401) return 'API anahtarı geçersiz. Ayarlardan kontrol edin.';
    if (status === 403) return 'API anahtarının bu model için yetkisi yok.';
    if (status === 404)
      return `"${this.model}" modeli bulunamadı. Ayarlardan model adını güncelleyin.`;
    if (status === 429)
      return 'Sağlayıcı istek sınırına ulaşıldı ya da kotanız bitti. Biraz bekleyip tekrar deneyin.';
    if (status >= 500) return 'Sağlayıcıda geçici bir sorun var. Tekrar deneyin.';
    return err?.message ?? 'Sağlayıcıya bağlanılamadı.';
  }
}
