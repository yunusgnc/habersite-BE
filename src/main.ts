import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Local dev — hem localhost hem 127.0.0.1, portlar 3000-3010
  const defaultOrigins: (string | RegExp)[] = [
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
