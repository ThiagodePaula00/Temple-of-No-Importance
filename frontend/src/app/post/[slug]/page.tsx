import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findPublicPostBySlugFromApi } from '@/post/queries/public';
import { SinglePost } from '@/components/SinglePost';
import { getCurrentUser, getLoginSessionForApi } from '@/lib/login/manage-login';
import { findCommentsForPost } from '@/lib/comment/queries';

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
  const user = await getCurrentUser();
  const accessToken = user ? await getLoginSessionForApi() : null;
  const commentsResponse = await findCommentsForPost(post.id, accessToken);

  return (
    <SinglePost
      post={post}
      postSlug={slug}
      currentUser={user ? { id: user.id, name: user.name, isAdmin: user.isAdmin } : null}
      comments={commentsResponse.success ? commentsResponse.data : []}
      commentsError={commentsResponse.success ? null : "Comments could not be loaded right now."}
    />
  );
}
