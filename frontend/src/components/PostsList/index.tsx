import { PostModel } from '@/models/post/post-models';
import { PostCard } from '@/components/PostCard';

type PostsListProps = {
    posts: PostModel[];
};

export function PostsList({ posts }: PostsListProps) {
    if (posts.length === 0) return null;

    return (
        <div className='grid w-full grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3'>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
    );
}