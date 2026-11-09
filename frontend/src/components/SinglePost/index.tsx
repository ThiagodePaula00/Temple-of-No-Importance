import Image from 'next/image';
import { PostModel } from '@/models/post/post-models';
import { PostDate } from '../PostDate';
import { SafeMarkdown } from '../SafeMarkdown';
import { coverImageSrc } from '@/utils/cover-image-src';
import { SharePostButton } from '@/components/SharePostButton';
import { CommentsSection } from '@/components/CommentsSection';
import type { CommentModel } from '@/models/comment/comment-models';

type SinglePostProps = {
  post: PostModel;
  postSlug: string;
  currentUser: { id: string; name: string; isAdmin: boolean } | null;
  comments: CommentModel[];
  commentsError: string | null;
};

export function SinglePost({
  post,
  postSlug,
  currentUser,
  comments,
  commentsError,
}: SinglePostProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-16">
      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <Image
            className="max-h-128 w-full rounded-xl object-cover"
            src={coverImageSrc(post.coverImageUrl)}
            width={1200}
            height={720}
            alt={post.title}
            priority
          />

          <h1 className="text-3xl font-bold text-(--text-color) sm:text-5xl">
            {post.title}
          </h1>

          <p className="text-sm text-(--muted-text-color)">
            {post.author} <span aria-hidden="true">|</span>{' '}
            <PostDate dateTime={post.createdAt} />
          </p>
        </header>

        <p className="text-xl leading-relaxed text-(--muted-text-color)">
          {post.excerpt}
        </p>

        <SafeMarkdown markdown={post.content} />
      </article>

      <div className="mt-8 border-t border-(--text-color) pt-6">
        <SharePostButton />
      </div>

      <section className="mt-8 border-t border-(--text-color) pt-8">
        <CommentsSection
          postId={post.id}
          postSlug={postSlug}
          currentUser={currentUser}
          initialComments={comments}
          loadError={commentsError}
        />
      </section>
    </main>
  );
}
