import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Post } from './posts/post.entity.js';
import { HealthController } from './health/health.controller.js';
import { PostModule } from './posts/posts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UploadModule } from './upload/upload.module.js';
import { User } from './users/user.entity.js';
import { RefreshToken } from './auth/refresh-token.entity.js';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityThrottlerGuard } from './security-throttler.guard.js';
import { positiveInteger } from './security-config.js';
import { Comment } from './comments/comment.entity.js';
import { CommentVote } from './comments/comment-vote.entity.js';
import { CommentsModule } from './comments/comments.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const isProduction = process.env.NODE_ENV === "production";
const synchronizeSchema =
  process.env.TYPEORM_SYNCHRONIZE === "true" ||
  (!isProduction && process.env.TYPEORM_SYNCHRONIZE !== "false");

if (
  isProduction &&
  (!process.env.POSTGRES_PASSWORD ||
    process.env.POSTGRES_PASSWORD.length < 24 ||
    /placeholder|replace|set-this|defina|example/i.test(process.env.POSTGRES_PASSWORD))
) {
  throw new Error("A non-placeholder POSTGRES_PASSWORD is required in production.");
}

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: positiveInteger(process.env.RATE_LIMIT_TTL_MS, 60_000, "RATE_LIMIT_TTL_MS"),
      limit: positiveInteger(process.env.RATE_LIMIT_MAX, 120, "RATE_LIMIT_MAX"),
    }]),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? "posts",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB?? "posts",
      entities: [Post, User, RefreshToken, Comment, CommentVote],
      synchronize: synchronizeSchema,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PostModule,
    AuthModule,
    CommentsModule,
    UploadModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, { provide: APP_GUARD, useClass: SecurityThrottlerGuard }],
})
export class AppModule {}
