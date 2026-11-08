import { PostCoverImage } from "@/components/PostCoverImage";
import { PostSummary } from "@/components/PostSummary";
import type { PostModel } from "@/models/post/post-models";
import { coverImageSrc } from "@/utils/cover-image-src";

export function PostCard({ post }: { post: PostModel }) {
  const postLink = `/post/${post.slug}`;

  return (
    <article className="group flex flex-col gap-0 overflow-hidden rounded-xl border border-(--card-border) shadow-lg">
      <PostCoverImage
        linkProps={{ href: postLink }}
        imageProps={{
          width: 1200,
          height: 720,
          src: coverImageSrc(post.coverImageUrl),
          alt: post.title,
        }}
      />
      <div className="bg-(--card-background) p-4 text-(--text-color) transition-colors duration-200">
        <PostSummary
          postLink={postLink}
          postHeading="h2"
          createdAt={post.createdAt}
          excerpt={post.excerpt}
          title={post.title}
        />
      </div>
    </article>
  );
}
