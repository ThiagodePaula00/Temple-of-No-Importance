import { PostModel } from '@/models/post/post-models';
import { PostCoverImage } from '../PostCoverImage';
import { PostSummary } from '../PostSummary';

type PostsListProps = {
    posts: PostModel[];
};

export function PostsList({ posts }: PostsListProps) {
    if (posts.length === 0) return null;

    return (
        <div className='grid w-full grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3'>
            {posts.map(post => {
                const postLink = `/post/${post.slug}`;

                return (
                    <div className='group flex flex-col gap-0 overflow-hidden rounded-xl' key={post.id}>
                        <PostCoverImage
                            linkProps={{ href: postLink }}
                            imageProps={{
                                width: 1200,
                                height: 720,
                                src: post.coverImageUrl,
                                alt: post.title,
                            }}
                        />

                        <div className='border-r border-b border-l border-(--card-border) bg-(--card-background) p-4 text-(--text-color) transition-colors duration-200'>
                          <PostSummary
                              postLink={postLink}
                              postHeading='h1'
                              createdAt={post.createdAt}
                              excerpt={post.excerpt}
                              title={post.title}
                          />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}