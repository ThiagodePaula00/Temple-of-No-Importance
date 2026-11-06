import "server-only";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import type { PostModel } from "@/models/post/post-models";

export function findAllPostFromApiAdmin() {
  return authenticatedApiRequest<PostModel[]>("/posts/admin");
}

export function findPostByIdFromApiAdmin(id: string) {
  return authenticatedApiRequest<PostModel>(
    `/posts/admin/${encodeURIComponent(id)}`,
  );
}