import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity.js';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from "node:crypto";
import { CreatePostDto, UpdatePostDto } from "./post.dto.js";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  findPublished() {
    return this.postsRepository.find({
      where: { published: true },
      order: { createdAt: "DESC" },
    });
  }

  findAllForAdmin() {
    return this.postsRepository.find({ order: { createdAt: "DESC" } });
  }

  async findAdminById(id: string) {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async create(input: CreatePostDto, author: string) {
    const slug = this.makeSlug(input.title);
    await this.ensureSlugAvailable(slug);
    const now = new Date();
    const post = this.postsRepository.create({
      id: randomUUID(),
      slug,
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      content: input.content,
      coverImageUrl: input.coverImageUrl?.trim() ?? "",
      published: input.published ?? false,
      author,
      createdAt: now,
      updatedAt: now,
    });

    return this.postsRepository.save(post);
  }

  async update(id: string, input: UpdatePostDto) {
    const post = await this.findAdminById(id);
    const nextTitle = input.title?.trim() ?? post.title;
    const nextSlug = input.title ? this.makeSlug(nextTitle) : post.slug;
    await this.ensureSlugAvailable(nextSlug, id);

    Object.assign(post, {
      ...(input.title !== undefined && { title: nextTitle, slug: nextSlug }),
      ...(input.excerpt !== undefined && { excerpt: input.excerpt.trim() }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.coverImageUrl !== undefined && {
        coverImageUrl: input.coverImageUrl.trim(),
      }),
      ...(input.published !== undefined && { published: input.published }),
      updatedAt: new Date(),
    });

    return this.postsRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findAdminById(id);
    await this.postsRepository.remove(post);
  }

  async findPublishedBySlug(slug: string) {
    const post = await this.postsRepository.findOne({
      where: { slug, published: true },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  private makeSlug(title: string) {
    const slug = title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return slug || randomUUID();
  }

  private async ensureSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.postsRepository.findOne({ where: { slug } });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException("A post with this title already exists.");
    }
  }
}