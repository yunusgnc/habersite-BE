"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PushService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
let PushService = PushService_1 = class PushService {
    logger = new common_1.Logger(PushService_1.name);
    async sendToAll(credentials, payload) {
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
        }
        catch (err) {
            this.logger.error(`OneSignal push error: ${err.message}`);
            return { ok: false, error: err.message };
        }
    }
};
exports.PushService = PushService;
exports.PushService = PushService = PushService_1 = __decorate([
    (0, common_1.Injectable)()
], PushService);
//# sourceMappingURL=push.service.js.map