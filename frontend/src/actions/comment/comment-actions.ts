"use server";

import { revalidatePath } from "next/cache";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import type { CommentVoteValue } from "@/models/comment/comment-models";

type CommentActionResult = { success: true } | { success: false; error: string };

function revalidatePost(postSlug: string) {
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(postSlug)) {
    revalidatePath(`/post/${postSlug}`);
  }
}

export async function createCommentAction(input: {
  postId: string;
  postSlug: string;
  parentId: string | null;
  body: string;
}): Promise<CommentActionResult> {
  const { postId, postSlug, parentId, body } = input;
  const response = await authenticatedApiRequest("/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, parentId, body }),
  });
  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }
  revalidatePost(input.postSlug);
  return { success: true };
}

export async function voteCommentAction(
  commentId: string,
  postSlug: string,
  vote: CommentVoteValue | null,
): Promise<CommentActionResult> {
  const response = await authenticatedApiRequest(
    `/comments/${encodeURIComponent(commentId)}/vote`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote }),
    },
  );
  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }
  revalidatePost(postSlug);
  return { success: true };
}

export async function deleteCommentAction(
  commentId: string,
  postSlug: string,
): Promise<CommentActionResult> {
  const response = await authenticatedApiRequest(
    `/comments/${encodeURIComponent(commentId)}`,
    { method: "DELETE" },
  );
  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }
  revalidatePost(postSlug);
  return { success: true };
}

export async function setCommentAuthorBannedAction(
  userId: string,
  postSlug: string,
  banned: boolean,
): Promise<CommentActionResult> {
  const response = await authenticatedApiRequest(
    `/users/${encodeURIComponent(userId)}/ban`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned }),
    },
  );
  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }
  revalidatePost(postSlug);
  return { success: true };
}
