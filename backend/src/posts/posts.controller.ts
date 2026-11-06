import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard, AuthGuard, type AuthenticatedRequest } from "../auth/auth.guard.js";
import { CreatePostDto, UpdatePostDto } from "./post.dto.js";
import { PostsService } from "./post.service.js";

@Controller("posts")
export class PostController {
  constructor(private readonly postsService: PostsService) {}

  @Get("admin")
  @UseGuards(AuthGuard, AdminGuard)
  findAllForAdmin() {
    return this.postsService.findAllForAdmin();
  }

  @Get("admin/:id")
  @UseGuards(AuthGuard, AdminGuard)
  findAdminById(@Param("id") id: string) {
    return this.postsService.findAdminById(id);
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(
    @Body() body: CreatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postsService.create(body, request.user!.name);
  }

  @Patch(":id")
  @UseGuards(AuthGuard, AdminGuard)
  update(@Param("id") id: string, @Body() body: UpdatePostDto) {
    return this.postsService.update(id, body);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, AdminGuard)
  remove(@Param("id") id: string) {
    return this.postsService.remove(id);
  }

  @Get()
  findPublished() {
    return this.postsService.findPublished();
  }

  @Get(":slug")
  findPublishedBySlug(@Param("slug") slug: string) {
    return this.postsService.findPublishedBySlug(slug);
  }
}