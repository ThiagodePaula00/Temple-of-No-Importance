import { PostModel } from "@/models/post/post-models";
import ErrorMessage from "../ErrorMessage";
import { PostCoverImage } from "../PostCoverImage";
import { PostSummary } from "../PostSummary";

type PostFeaturedprops = {
    post?: PostModel;
};
export function PostFeatured({ post }: PostFeaturedprops) {
    if (!post) {
        return (
            <ErrorMessage
                contentTitle='Ops 😅'
                content='No post created yet.'
            />
        );
    }

    const postLink = `/post/${post.slug}`;

    return (
        <section className='group grid w-full grid-cols-1 gap-0 overflow-hidden rounded-xl sm:grid-cols-2'>
            <PostCoverImage
                linkProps={{ href: postLink }}
                imageProps={{
                    width: 1200,
                    height: 700,
                    src: post.coverImageUrl,
                    alt: post.title,
                    priority: true,
                }}
            />

            <div className="flex items-center border-r border-b border-l border-(--card-border) bg-(--card-background) px-4 py-6 text-(--text-color) transition-colors duration-200">
                <PostSummary
                    postLink={postLink}
                    postHeading='h1'
                    createdAt={post.createdAt}
                    excerpt={post.excerpt}
                    title={post.title}
                />
            </div>
        </section>
    );
}