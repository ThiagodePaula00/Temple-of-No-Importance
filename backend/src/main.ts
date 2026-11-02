import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.APP_PORT ?? 3000), "0.0.0.0");
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to start the NestJS API", error);
  process.exitCode = 1;
});