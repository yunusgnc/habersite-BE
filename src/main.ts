import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cloudflare arkasında çalışıyoruz. `trust proxy` açılmazsa Express `req.ip`'i
  // Cloudflare edge sunucusunun IP'si olarak görüyor → rate-limit tüm
  // ziyaretçileri aynı sayaçta topluyor, birkaç yüz istek sonrası herkese
  // 429 dönüyor. Ayrıca yorumlarda kayıtlı IP hep aynı çıkıyordu.
  //
  // `1` değeri güvenli: sadece EN YAKIN vekilin (Cloudflare) yolladığı
  // X-Forwarded-For son giriştirdiğini kabul ediyor. `true` yazmak IP
  // sahtekârlığına açık kapı bırakırdı — istemci istediği IP'yi başlığa
  // koyabilir ve rate-limit'i atlatabilir.
  app.set('trust proxy', 1);

  // Güvenlik header'ları — XSS, clickjacking, MIME sniffing, HSTS.
  // API'nin görselleri kendi origin'inden serve etmesi gerektiği için
  // crossOriginResourcePolicy'yi gevşetiyoruz (aksi halde <img src="{api}/uploads/..">
  // farklı origin'den bloklanır).
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // API endpoint'lerine gerek yok, FE kendi CSP'sini kurar
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── CORS ────────────────────────────────────────────────
  // Statik izinli origin'ler — env + local dev + admin paneli.
  const staticOrigins = (process.env.CORS_ORIGIN?.split(',') ?? [])
    .map((s) => s.trim())
    .filter(Boolean);
  const localhostPattern = /^http:\/\/(localhost|127\.0\.0\.1):(300[0-9]|3010)$/;

  // Tenant domain'lerini DB'den 5 dakikada bir yenile.
  // Böylece yeni müşteri eklendiğinde CORS_ORIGIN'i güncellemeye gerek yok.
  const prisma = app.get(PrismaService);
  const CACHE_TTL_MS = 5 * 60 * 1000;
  let tenantHosts = new Set<string>();
  let tenantHostsExpires = 0;

  async function refreshTenantHosts() {
    try {
      const tenants = await prisma.tenant.findMany({
        where: { active: true, domain: { not: null } },
        select: { domain: true },
      });
      const next = new Set<string>();
      for (const t of tenants) {
        const d = t.domain?.toLowerCase().trim();
        if (!d) continue;
        next.add(d);
        if (!d.startsWith('www.')) next.add(`www.${d}`);
      }
      tenantHosts = next;
      tenantHostsExpires = Date.now() + CACHE_TTL_MS;
    } catch (err) {
      // DB henüz hazır değilse cache'i boş bırak — statik origin'lere düşer.
      console.warn('[CORS] tenant host cache refresh failed:', (err as Error).message);
    }
  }

  await refreshTenantHosts();

  app.enableCors({
    origin: async (origin, callback) => {
      // Server-to-server, mobil client, curl vb. → origin yok, kabul.
      if (!origin) return callback(null, true);

      // Local dev — localhost:3000-3010.
      if (localhostPattern.test(origin)) return callback(null, true);

      // Env veya kod-hardcoded statik listede.
      if (staticOrigins.includes(origin)) return callback(null, true);

      // Tenant domain match (cache'den, TTL bittiyse yenile).
      try {
        if (Date.now() > tenantHostsExpires) await refreshTenantHosts();
        const host = new URL(origin).hostname.toLowerCase();
        if (tenantHosts.has(host)) return callback(null, true);
      } catch {
        // URL parse hata → reddet.
      }

      // Fail sessizce — Express `origin: false` header koymaz, tarayıcı bloklar.
      return callback(null, false);
    },
    credentials: true,
  });

  // ─── Swagger / OpenAPI ────────────────────────────────────
  // Dev'de otomatik açık. Prod'da SWAGGER_USER + SWAGGER_PASSWORD env varsa
  // HTTP Basic Auth ile korunur; ikisi de yoksa endpoint hiç kayıtlı olmaz —
  // yanlışlıkla halka açık bırakılmasın diye "opt-in" tasarım.
  const isProd = process.env.NODE_ENV === 'production';
  const swaggerUser = process.env.SWAGGER_USER;
  const swaggerPass = process.env.SWAGGER_PASSWORD;
  const swaggerEnabled = !isProd || (swaggerUser && swaggerPass);
  if (swaggerEnabled) {
    if (isProd && swaggerUser && swaggerPass) {
      // Basit Basic-Auth middleware — sadece /api/docs* altına.
      // timing-safe karşılaştırma değil çünkü Basic Auth zaten
      // TLS altında akıyor ve credentials rate-limit'e tabi değil (Cloudflare önde).
      app.use((req: Request, res: Response, next: NextFunction) => {
        if (!req.path.startsWith('/api/docs')) return next();
        const header = req.headers.authorization ?? '';
        if (header.startsWith('Basic ')) {
          const decoded = Buffer.from(header.slice(6), 'base64').toString('utf-8');
          const [u, p] = decoded.split(':');
          if (u === swaggerUser && p === swaggerPass) return next();
        }
        res.setHeader('WWW-Authenticate', 'Basic realm="API Docs"');
        res.status(401).send('Authentication required');
      });
    }
    const swaggerConfig = new DocumentBuilder()
      .setTitle('HaberSite API')
      .setDescription(
        'Çok-kiracılı haber CMS. Tüm endpoint\'ler tenant header ile çağrılır ' +
          '(`x-tenant-id` veya `x-tenant-domain`).',
      )
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .addApiKey({ type: 'apiKey', name: 'x-tenant-domain', in: 'header' }, 'tenant-domain')
      .addApiKey({ type: 'apiKey', name: 'x-tenant-id', in: 'header' }, 'tenant-id')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    console.log(
      `[Swagger] /api/docs açık${isProd ? ' (Basic Auth korumalı)' : ' (dev — public)'}`,
    );
  } else {
    console.log('[Swagger] devre dışı — prod\'da SWAGGER_USER/PASSWORD yok');
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`HaberSite API running on http://localhost:${port}`);
  console.log(`[CORS] ${staticOrigins.length} static origins, ${tenantHosts.size} tenant hosts`);
}

bootstrap();
