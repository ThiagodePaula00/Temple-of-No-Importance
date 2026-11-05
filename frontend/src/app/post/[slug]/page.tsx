import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findPublicPostBySlugFromApi } from '@/post/queries/public';
import { SinglePost } from '@/components/SinglePost';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  const response = await findPublicPostBySlugFromApi(slug);

  if (!response.success) {
    if (response.status === 404) {
      notFound();
    }

    throw new Error(`Could not load post: ${response.errors.join(', ')}`);
  }

  return response.data;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  return <SinglePost post={post} />;
}
