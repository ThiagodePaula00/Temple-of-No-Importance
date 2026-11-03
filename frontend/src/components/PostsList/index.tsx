import { getPublishedPosts } from "@/lib/posts";
import { TempPostCard } from "@/components/TempPostCard";

export async function PostsList() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return <p>There&apos;s no published posts yet.</p>;
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <TempPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}