export type Post = {
  id: string;
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getPublishedPosts(): Promise<Post[]> {
  const apiUrl = process.env.POSTS_API_URL ?? "http://localhost:3000/posts";
  const response = await fetch(apiUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(` The API's posts responsed with HTTP: ${response.status}`);
  }

  return response.json() as Promise<Post[]>;
}