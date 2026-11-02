import { Controller, Get } from "@nestjs/common";
import { PostsService } from "./post.service.js";


@Controller("posts")
export class PostController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    findPublished() {
        return this.postsService.findPublished();
    }
}