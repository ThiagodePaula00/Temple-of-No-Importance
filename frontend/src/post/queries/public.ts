
import { PostModel } from '@/models/post/post-models';
import { apiRequest } from '@/utils/api-request';

export function findAllPublicPostsFromApi() {
  return apiRequest<PostModel[]>('/posts', {
    cache: 'no-store',
  });
}

export async function findPublicPostBySlugFromApi(slug: string) {
  const response = await findAllPublicPostsFromApi();

  if (!response.success) {
    return response;
  }

  const post = response.data.find((item) => item.slug === slug);

  if (!post) {
    return {
      errors: ['Post not found'],
      success: false as const,
      status: 404,
    };
  }

  return {
    data: post,
    success: true as const,
    status: 200,
  };
}