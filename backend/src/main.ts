import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { parseOrigins, trustedProxies } from './security-config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useSecurityHeaders({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'none'"],
        connectSrc: ["'self'"],
      },
    },
    strictTransportSecurity: process.env.NODE_ENV === "production"
      ? { maxAge: 31_536_000, includeSubDomains: true }
      : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
  const proxies = trustedProxies();
  if (proxies.length) app.getHttpAdapter().getInstance().set("trust proxy", proxies);

  app.enableCors({
    origin: parseOrigins(process.env.CORS_ORIGINS, process.env.NODE_ENV === "production"),
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(Number(process.env.APP_PORT ?? 3000), "0.0.0.0");
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to start the NestJS API", error);
  process.exitCode = 1;
});
