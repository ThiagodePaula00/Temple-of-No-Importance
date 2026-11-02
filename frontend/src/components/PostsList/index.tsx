import { getPublishedPosts } from "@/lib/posts";

export async function PostsList() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return <p>Nenhum post publicado por enquanto.</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <article>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}