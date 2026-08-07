import { Injectable, Logger } from '@nestjs/common';

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  imageUrl?: string;
}

/**
 * OneSignal REST API üzerinden web push bildirim gönderir.
 * Ayarlar tenant başına `settings` tablosunda `oneSignalAppId` ve
 * `oneSignalApiKey` olarak tutulabilir; fallback olarak ENV kullanılır.
 *
 * Kullanım: `pushService.sendToAll(tenantId, {...})` — makale yayımlandığında.
 */
@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  async sendToAll(
    credentials: { appId: string; apiKey: string },
    payload: PushPayload,
  ): Promise<{ ok: boolean; error?: string }> {
    if (!credentials.appId || !credentials.apiKey) {
      return { ok: false, error: 'OneSignal credentials missing' };
    }

    try {
      const res = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials.apiKey}`,
        },
        body: JSON.stringify({
          app_id: credentials.appId,
          included_segments: ['Subscribed Users'],
          headings: { en: payload.title, tr: payload.title },
          contents: { en: payload.body, tr: payload.body },
          url: payload.url,
          chrome_web_image: payload.imageUrl,
          big_picture: payload.imageUrl,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        this.logger.warn(`OneSignal push failed: ${res.status} ${text}`);
        return { ok: false, error: `HTTP ${res.status}` };
      }
      return { ok: true };
    } catch (err) {
      this.logger.error(`OneSignal push error: ${(err as Error).message}`);
      return { ok: false, error: (err as Error).message };
    }
  }
}
