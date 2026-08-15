/**
 * Sağlayıcıdan bağımsız tamamlama sözleşmesi.
 *
 * Her iki sağlayıcı da aynı şeyi yapıyor: sistem yönergesi + kullanıcı metni
 * al, JSON şemasına uyan bir nesne döndür. Farklar (SDK çağrı biçimi, yapısal
 * çıktı API'si, model adı) adaptörlerin içinde kalıyor; servis katmanı hangi
 * sağlayıcının konuştuğunu bilmiyor.
 */
export interface AiCompletionRequest {
  system: string;
  user: string;
  /** JSON Schema — dönen nesnenin uyması gereken biçim. */
  schema: Record<string, any>;
  maxTokens: number;
}

export interface AiProviderAdapter {
  readonly name: string;
  /** Varsayılan model — tenant `aiModel` ayarıyla ezebilir. */
  readonly defaultModel: string;
  complete(req: AiCompletionRequest): Promise<Record<string, any>>;
}

/**
 * Sağlayıcı hatalarını tek tipe indirger. Mesaj panele olduğu gibi
 * gösteriliyor: "bir hata oluştu" demek, geçersiz anahtar ile kalmamış kota
 * arasındaki farkı gizler ve kullanıcı ne yapacağını bilemez.
 */
export class AiProviderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
  ) {
    super(message);
  }
}
