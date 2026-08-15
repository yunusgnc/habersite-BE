"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeProviderError = describeProviderError;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('AiProvider');
function describeProviderError(err, provider, model) {
    const status = err?.status;
    const detail = providerMessage(err);
    logger.warn(`[${provider}] status=${status ?? '-'} type=${errorType(err) ?? '-'} model=${model} :: ${detail ?? err?.message ?? 'bilinmiyor'}`);
    const withDetail = (base) => (detail ? `${base} (${detail})` : base);
    if (status === 401)
        return withDetail('API anahtarı geçersiz. Ayarlardan kontrol edin.');
    if (status === 403)
        return withDetail('API anahtarının bu model için yetkisi yok.');
    if (status === 404)
        return withDetail(`"${model}" modeli bulunamadı ya da hesabınızın bu modele erişimi yok. Ayarlardan model adını değiştirin.`);
    if (status === 400)
        return withDetail('İstek sağlayıcı tarafından reddedildi.');
    if (status === 429)
        return withDetail('Sağlayıcı istek sınırına takıldı ya da bakiyeniz/limitiniz doldu.');
    if (typeof status === 'number' && status >= 500)
        return withDetail('Sağlayıcıda geçici bir sorun var. Tekrar deneyin.');
    return detail ?? err?.message ?? 'Sağlayıcıya bağlanılamadı.';
}
function providerMessage(err) {
    const raw = err?.error?.error?.message ??
        err?.error?.message ??
        undefined;
    return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
}
function errorType(err) {
    return err?.error?.error?.type ?? err?.error?.type ?? err?.code ?? undefined;
}
//# sourceMappingURL=describe-error.js.map