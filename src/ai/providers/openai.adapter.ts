import OpenAI from 'openai';
import {
  AiCompletionRequest,
  AiProviderAdapter,
  AiProviderError,
} from '../ai.types';
import { describeProviderError } from './describe-error';

/**
 * OpenAI adaptörü.
 *
 * Neden `chat.completions` ve `json_object`: OpenAI model adlarını ve API
 * yüzeylerini sık yeniliyor. `chat.completions` en uzun ömürlü, en geniş
 * desteklenen yüzey; `response_format: json_object` da şema tabanlı yapısal
 * çıktıdan daha geniş model yelpazesinde çalışıyor. Şemayı sistem yönergesine
 * yazıp dönen JSON'u kendimiz doğruluyoruz — biraz daha fazla iş ama model
 * sürümü değiştiğinde kırılmıyor.
 *
 * Model adı tenant ayarından ezilebilir; varsayılan emekliye ayrılırsa
 * kullanıcı kod değişikliği beklemeden yenisini yazabilir.
 */
export const OPENAI_DEFAULT_MODEL = 'gpt-4o-mini';

export class OpenAiAdapter implements AiProviderAdapter {
  readonly name = 'openai';
  readonly defaultModel = OPENAI_DEFAULT_MODEL;

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async complete(req: AiCompletionRequest): Promise<Record<string, any>> {
    const client = new OpenAI({ apiKey: this.apiKey });

    // Şemayı yönergeye gömüyoruz — `json_object` modu geçerli JSON garantiler
    // ama biçimi garanti etmez.
    const system =
      `${req.system}\n\n` +
      'Yanıtını YALNIZCA şu JSON şemasına uyan tek bir JSON nesnesi olarak ver. ' +
      'Açıklama, kod bloğu işareti veya ek metin ekleme.\n' +
      JSON.stringify(req.schema);

    let raw: string | null | undefined;
    try {
      const completion = await client.chat.completions.create({
        model: this.model,
        max_completion_tokens: req.maxTokens,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: req.user },
        ],
      });
      raw = completion.choices[0]?.message?.content;
    } catch (err: any) {
      throw new AiProviderError(
        describeProviderError(err, this.name, this.model),
        this.name,
      );
    }

    if (!raw) {
      throw new AiProviderError('Sağlayıcı boş yanıt döndürdü.', this.name);
    }

    try {
      return JSON.parse(raw);
    } catch {
      throw new AiProviderError(
        'Sağlayıcı beklenen biçimde yanıt vermedi.',
        this.name,
      );
    }
  }
}
