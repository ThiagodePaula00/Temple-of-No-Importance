import { Controller, Get, Param } from "@nestjs/common";
import { PostsService } from "./post.service.js";


@Controller("posts")
export class PostController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    findPublished() {
        return this.postsService.findPublished();
    }

    @Get(":slug")
    findPublishedBySlug(@Param("slug") slug: string) {
        return this.postsService.findPublishedBySlug(slug);
    }
}