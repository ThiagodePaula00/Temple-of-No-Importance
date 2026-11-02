import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { Post } from './post.entity.js';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

type PostSeed = {
  posts: Array<
    Omit<Post, "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    }
  >;
};

@Injectable()
export class PostsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async onApplicationBootstrap() {
    const seedPath = resolve(process.cwd(), "src/seed/post.json"); 
    const seedFile = await readFile(seedPath, "utf8");
    const seed = JSON.parse(seedFile) as PostSeed;
    const posts = seed.posts.map((post) =>
      this.postsRepository.create({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }),
    );

    await this.postsRepository.upsert(posts, ["id"]);
    this.logger.log(`Seed finished: ${posts.length} posts avaliable in database.`);
  }

  findPublished() {
    return this.postsRepository.find({
      where: { published: true },
      order: { createdAt: "DESC" },
    });
  }
}