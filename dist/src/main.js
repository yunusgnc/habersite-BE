"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const staticOrigins = (process.env.CORS_ORIGIN?.split(',') ?? [])
        .map((s) => s.trim())
        .filter(Boolean);
    const localhostPattern = /^http:\/\/(localhost|127\.0\.0\.1):(300[0-9]|3010)$/;
    const prisma = app.get(prisma_service_1.PrismaService);
    const CACHE_TTL_MS = 5 * 60 * 1000;
    let tenantHosts = new Set();
    let tenantHostsExpires = 0;
    async function refreshTenantHosts() {
        try {
            const tenants = await prisma.tenant.findMany({
                where: { active: true, domain: { not: null } },
                select: { domain: true },
            });
            const next = new Set();
            for (const t of tenants) {
                const d = t.domain?.toLowerCase().trim();
                if (!d)
                    continue;
                next.add(d);
                if (!d.startsWith('www.'))
                    next.add(`www.${d}`);
            }
            tenantHosts = next;
            tenantHostsExpires = Date.now() + CACHE_TTL_MS;
        }
        catch (err) {
            console.warn('[CORS] tenant host cache refresh failed:', err.message);
        }
    }
    await refreshTenantHosts();
    app.enableCors({
        origin: async (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (localhostPattern.test(origin))
                return callback(null, true);
            if (staticOrigins.includes(origin))
                return callback(null, true);
            try {
                if (Date.now() > tenantHostsExpires)
                    await refreshTenantHosts();
                const host = new URL(origin).hostname.toLowerCase();
                if (tenantHosts.has(host))
                    return callback(null, true);
            }
            catch {
            }
            return callback(null, false);
        },
        credentials: true,
    });
    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.log(`HaberSite API running on http://localhost:${port}`);
    console.log(`[CORS] ${staticOrigins.length} static origins, ${tenantHosts.size} tenant hosts`);
}
bootstrap();
//# sourceMappingURL=main.js.map