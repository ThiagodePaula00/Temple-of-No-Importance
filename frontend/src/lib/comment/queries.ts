import "server-only";
import { apiRequest, type ApiRequest } from "@/utils/api-request";
import type { CommentModel } from "@/models/comment/comment-models";

export function findCommentsForPost(
  postId: string,
  accessToken: string | null,
): Promise<ApiRequest<CommentModel[]>> {
  const headers = new Headers();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  return apiRequest<CommentModel[]>(
    `/comments?postId=${encodeURIComponent(postId)}`,
    { headers, cache: "no-store" },
  );
}
