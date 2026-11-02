import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity({ name: "posts" })
@Unique("UQ_posts_slug", ["slug"])
export class Post {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "text" })
  slug: string;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  author: string;

  @Column({ type: "text" })
  excerpt: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text", name: "cover_image_url" })
  coverImageUrl: string;

  @Column({ type: "boolean", default: false })
  published: boolean;

  @Column({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;
}