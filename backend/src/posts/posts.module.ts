import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./posts.controller.js";
import { Post } from "./post.entity.js";
import { PostsService } from "./post.service.js";
import { AuthModule } from "../auth/auth.module.js";
import { AdminGuard, AuthGuard } from "../auth/auth.guard.js";


@Module({
    imports: [TypeOrmModule.forFeature([Post]), AuthModule],
    controllers: [PostController],
    providers: [PostsService, AuthGuard, AdminGuard],
})
export class PostModule {}