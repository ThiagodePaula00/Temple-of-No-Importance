
import { PostModel } from '@/models/post/post-models';
import { apiRequest } from '@/utils/api-request';
import { cache } from 'react';

export const findAllPublicPostsFromApi = cache(async () => {
  return apiRequest<PostModel[]>('/posts', {
    cache: 'no-store',
  });
});

export const findPublicPostBySlugFromApi = cache(async (slug: string) => {
  return apiRequest<PostModel>(`/posts/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });
});