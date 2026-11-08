import Image from "next/image";
import { coverImageSrc } from "@/utils/cover-image-src";
import type { Post } from "@/lib/posts";
import { PostDate } from "@/components/PostDate";

type TempoPostCardProps = {
  post: Post;
};

export function TempPostCard({ post }: TempoPostCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl">
      <div className="relative aspect-5/3 w-full bg-(--card-background)">
        <Image
          src={coverImageSrc(post.coverImageUrl)}
          alt={`Capa do post: ${post.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 border-r border-b border-l border-(--card-border) bg-(--card-background)] p-4 text-(--text-color) transition-colors duration-200">
        <PostDate dateTime={post.createdAt} />
        <h2 className="text-xl font-bold">{post.title}</h2>
        <p>{post.excerpt}</p>
        <p className="text-sm text-(--muted-text-color)">By {post.author}</p>
      </div>
    </article>
  );
}
