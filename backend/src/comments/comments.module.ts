import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module.js";
import { Post } from "../posts/post.entity.js";
import { Comment } from "./comment.entity.js";
import { CommentVote } from "./comment-vote.entity.js";
import { CommentsController } from "./comments.controller.js";
import { CommentsService } from "./comments.service.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentVote, Post]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
