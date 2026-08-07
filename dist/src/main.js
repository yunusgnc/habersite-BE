"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    const defaultOrigins = [
        /^http:\/\/(localhost|127\.0\.0\.1):(300[0-9]|3010)$/,
    ];
    const envOrigins = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
    app.enableCors({
        origin: envOrigins.length > 0 ? envOrigins : defaultOrigins,
        credentials: true,
    });
    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.log(`HaberSite API running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map