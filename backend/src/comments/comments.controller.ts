import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  AdminGuard,
  AuthGuard,
  OptionalAuthGuard,
  type AuthenticatedRequest,
} from "../auth/auth.guard.js";
import {
  CreateCommentDto,
  GetCommentsDto,
  VoteCommentDto,
} from "./comment.dto.js";
import { CommentsService } from "./comments.service.js";

@Controller("comments")
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  findForPost(
    @Query() query: GetCommentsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.comments.findForPost(
      query.postId,
      request.user?.id,
      request.user?.isAdmin ?? false,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  create(
    @Body() body: CreateCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.comments.create(request.user!, body);
  }

  @Post(":id/vote")
  @UseGuards(AuthGuard)
  vote(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: VoteCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.comments.vote(id, request.user!.id, body.vote);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.comments.remove(id);
  }
}
