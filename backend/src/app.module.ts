import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/post.entity.js';
import { HealthController } from './health/health.controller.js';
import { PostModule } from './posts/posts.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? "posts",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB?? "posts",
      entities: [Post],
      synchronize: process.env.TYPEORM_SYNCHRONIZE !== "false",
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    PostModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}