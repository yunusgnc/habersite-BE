/**
 * Haber formundaki yardımcı görevleri.
 *
 * Her görev bir sistem yönergesi + JSON şeması. Şemalar `additionalProperties:
 * false` ve tam `required` listesi taşıyor — Anthropic'in yapısal çıktı
 * özelliği bunu zorunlu kılıyor, OpenAI tarafında da yönergeye gömülüp
 * doğrulamada kullanılıyor.
 */

export type AiTaskName = 'spot' | 'seo' | 'tags' | 'titles';

export const AI_TASK_NAMES: AiTaskName[] = ['spot', 'seo', 'tags', 'titles'];

const ORTAK_YONERGE =
  'Sen bir Türk haber sitesinin editör yardımcısısın. Türkçe yazım ve noktalama ' +
  'kurallarına uy. Haberin kendi bilgisine sadık kal — metinde geçmeyen isim, ' +
  'sayı, tarih veya iddia ekleme. Abartılı ya da tıklama tuzağı ifadeler kullanma.';

type TaskSpec = {
  system: string;
  schema: Record<string, any>;
  maxTokens: number;
};

export const AI_TASKS: Record<AiTaskName, TaskSpec> = {
  spot: {
    system:
      `${ORTAK_YONERGE}\n\n` +
      'Görevin: haberin spot (özet) metnini yazmak. 150-200 karakter arası, tek ' +
      'paragraf, haberin en önemli bilgisini içermeli. Başlığı olduğu gibi ' +
      'tekrarlama.',
    schema: {
      type: 'object',
      properties: {
        spot: { type: 'string', description: '150-200 karakterlik spot metni' },
      },
      required: ['spot'],
      additionalProperties: false,
    },
    maxTokens: 2048,
  },

  seo: {
    system:
      `${ORTAK_YONERGE}\n\n` +
      'Görevin: arama motoru için başlık ve açıklama yazmak. Başlık en fazla 60 ' +
      'karakter, açıklama 150-160 karakter olsun. Açıklama okuyucuya haberde ne ' +
      'olduğunu söylesin.',
    schema: {
      type: 'object',
      properties: {
        seoTitle: { type: 'string', description: 'En fazla 60 karakter' },
        seoDesc: { type: 'string', description: '150-160 karakter' },
      },
      required: ['seoTitle', 'seoDesc'],
      additionalProperties: false,
    },
    maxTokens: 2048,
  },

  tags: {
    system:
      `${ORTAK_YONERGE}\n\n` +
      'Görevin: habere 3-6 etiket önermek. Etiketler kısa olsun (1-3 kelime), ' +
      'küçük harfle yazılsın, haberin konusunu ve geçen özel isimleri yansıtsın. ' +
      'Çok genel etiketlerden ("haber", "gündem") kaçın.',
    schema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: '3-6 etiket',
        },
      },
      required: ['tags'],
      additionalProperties: false,
    },
    maxTokens: 2048,
  },

  titles: {
    system:
      `${ORTAK_YONERGE}\n\n` +
      'Görevin: habere 4 alternatif başlık önermek. Her biri farklı bir açıdan ' +
      'yaklaşsın; biri düz haber dili, biri merak uyandıran ama tıklama tuzağı ' +
      'olmayan olsun. Her başlık en fazla 80 karakter.',
    schema: {
      type: 'object',
      properties: {
        titles: {
          type: 'array',
          items: { type: 'string' },
          description: '4 alternatif başlık',
        },
      },
      required: ['titles'],
      additionalProperties: false,
    },
    maxTokens: 2048,
  },
};
