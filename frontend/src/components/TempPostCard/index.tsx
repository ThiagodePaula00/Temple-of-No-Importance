import Image from "next/image";
import type { Post } from "@/lib/posts";
import { PostDate } from "@/components/PostDate";

type TempoPostCardProps = {
  post: Post;
};

export function TempPostCard({ post }: TempoPostCardProps) {
  return (
    <article className="flex flex-col bg-amber-400 rounded-xl overflow-hidden">
      <div className="relative aspect-5/3 w-full bg-slate-100">
        <Image
          src={post.coverImageUrl}
          alt={`Capa do post: ${post.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <PostDate dateTime={post.createdAt} />
        <h2 className="text-xl font-bold">{post.title}</h2>
        <p>{post.excerpt}</p>
        <p className="text-sm text-slate-600">By {post.author}</p>
      </div>
    </article>
  );
}