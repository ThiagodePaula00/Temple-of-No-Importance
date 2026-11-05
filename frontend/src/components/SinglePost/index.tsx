import Image from 'next/image';
import { PostModel } from '@/models/post/post-models';
import { PostDate } from '../PostDate';
import { SafeMarkdown } from '../SafeMarkdown';

type SinglePostProps = {
  post: PostModel;
};

export function SinglePost({ post }: SinglePostProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-16">
      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <Image
            className="max-h-128 w-full rounded-xl object-cover"
            src={post.coverImageUrl}
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
    </main>
  );
}
