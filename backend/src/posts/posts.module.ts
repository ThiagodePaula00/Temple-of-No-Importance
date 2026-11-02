import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./posts.controller.js";
import { Post } from "./post.entity.js";
import { PostsService } from "./post.service.js";


@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    controllers: [PostController],
    providers: [PostsService],
})
export class PostModule {}