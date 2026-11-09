"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  UserRoundCheckIcon,
  UserRoundXIcon,
} from "lucide-react";
import { PostDate } from "@/components/PostDate";
import {
  createCommentAction,
  deleteCommentAction,
  setCommentAuthorBannedAction,
  voteCommentAction,
} from "@/actions/comment/comment-actions";
import type {
  CommentModel,
  CommentVoteValue,
} from "@/models/comment/comment-models";

type CommentsSectionProps = {
  postId: string;
  postSlug: string;
  currentUser: { id: string; name: string; isAdmin: boolean } | null;
  initialComments: CommentModel[];
  loadError: string | null;
};

type CommentNode = CommentModel & { replies: CommentNode[] };

function makeCommentTree(comments: CommentModel[]) {
  const nodes = new Map<string, CommentNode>();
  for (const comment of comments) nodes.set(comment.id, { ...comment, replies: [] });

  const roots: CommentNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.replies.push(node);
    else roots.push(node);
  }
  return roots;
}

export function CommentsSection({
  postId,
  postSlug,
  currentUser,
  initialComments,
  loadError,
}: CommentsSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const commentTree = useMemo(() => makeCommentTree(comments), [comments]);

  useEffect(() => setComments(initialComments), [initialComments]);

  function submitComment(parentId: string | null) {
    const commentBody = (parentId ? replyBody : body).trim();
    if (!commentBody) return;
    setError(null);

    startTransition(async () => {
      const result = await createCommentAction({
        postId,
        postSlug,
        parentId,
        body: commentBody,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }

      if (parentId) {
        setReplyTo(null);
        setReplyBody("");
      } else {
        setBody("");
      }
      router.refresh();
    });
  }

  function vote(commentId: string, currentVote: CommentVoteValue | null, nextVote: CommentVoteValue) {
    if (!currentUser) return;
    setError(null);
    startTransition(async () => {
      const result = await voteCommentAction(
        commentId,
        postSlug,
        currentVote === nextVote ? null : nextVote,
      );
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function removeComment(commentId: string) {
    if (!window.confirm("Delete this comment and keep its replies?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCommentAction(commentId, postSlug);
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function setAuthorBanned(userId: string, banned: boolean) {
    const message = banned
      ? "Ban this account? They will be signed out and unable to comment or vote."
      : "Unban this account? They will be able to sign in and participate again.";
    if (!window.confirm(message)) return;
    setError(null);
    startTransition(async () => {
      const result = await setCommentAuthorBannedAction(userId, postSlug, banned);
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function renderComment(comment: CommentNode, depth = 0): ReactNode {
    return (
      <li className="min-w-0" key={comment.id}>
        <article className="rounded-lg border border-(--card-border) bg-(--card-background) p-4 text-(--text-color)">
          <header className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold">{comment.author.name}</span>
            {comment.author.isAdmin && (
              <span className="rounded border border-(--control-border) px-1.5 py-0.5 text-xs text-(--muted-text-color)">
                Admin
              </span>
            )}
            <span aria-hidden="true" className="text-(--muted-text-color)">·</span>
            <PostDate dateTime={comment.createdAt} />
          </header>

          <p className="break-words whitespace-pre-wrap leading-relaxed">{comment.body}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <button
              aria-pressed={comment.myVote === "like"}
              className="inline-flex cursor-pointer items-center gap-1.5 text-(--muted-text-color) transition-colors hover:text-(--text-color) disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:text-blue-500"
              disabled={!currentUser || isPending}
              onClick={() => vote(comment.id, comment.myVote, "like")}
              title={currentUser ? "Like comment" : "Sign in to like comments"}
              type="button"
            >
              <ThumbsUpIcon aria-hidden="true" className="size-4" />
              <span>{comment.likeCount}</span>
            </button>
            <button
              aria-pressed={comment.myVote === "dislike"}
              className="inline-flex cursor-pointer items-center gap-1.5 text-(--muted-text-color) transition-colors hover:text-(--text-color) disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:text-blue-500"
              disabled={!currentUser || isPending}
              onClick={() => vote(comment.id, comment.myVote, "dislike")}
              title={currentUser ? "Dislike comment" : "Sign in to dislike comments"}
              type="button"
            >
              <ThumbsDownIcon aria-hidden="true" className="size-4" />
              <span>{comment.dislikeCount}</span>
            </button>
            {currentUser && (
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 text-(--muted-text-color) transition-colors hover:text-(--text-color) disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
                onClick={() => {
                  setReplyTo(replyTo === comment.id ? null : comment.id);
                  setReplyBody("");
                  setError(null);
                }}
                type="button"
              >
                <MessageSquareIcon aria-hidden="true" className="size-4" />
                Reply
              </button>
            )}
            {currentUser?.isAdmin && (
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 text-red-500 transition-colors hover:text-red-400 disabled:opacity-50"
                disabled={isPending}
                onClick={() => removeComment(comment.id)}
                type="button"
              >
                <Trash2Icon aria-hidden="true" className="size-4" />
                Delete
              </button>
            )}
            {currentUser?.isAdmin && comment.author.id !== currentUser.id && !comment.author.isAdmin && (
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 text-red-500 transition-colors hover:text-red-400 disabled:opacity-50"
                disabled={isPending}
                onClick={() => setAuthorBanned(comment.author.id, !comment.author.isBanned)}
                type="button"
              >
                {comment.author.isBanned ? (
                  <UserRoundCheckIcon aria-hidden="true" className="size-4" />
                ) : (
                  <UserRoundXIcon aria-hidden="true" className="size-4" />
                )}
                {comment.author.isBanned ? "Unban author" : "Ban author"}
              </button>
            )}
          </div>

          {replyTo === comment.id && currentUser && (
            <form
              className="mt-4 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                submitComment(comment.id);
              }}
            >
              <label className="sr-only" htmlFor={`reply-${comment.id}`}>
                Reply to {comment.author.name}
              </label>
              <textarea
                autoFocus
                className="min-h-24 w-full resize-y rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 text-inherit outline-none focus:border-blue-500"
                id={`reply-${comment.id}`}
                maxLength={2000}
                onChange={(event) => setReplyBody(event.target.value)}
                placeholder={`Reply to ${comment.author.name}…`}
                value={replyBody}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-(--muted-text-color)">{replyBody.length}/2000</span>
                <div className="flex gap-2">
                  <button
                    className="rounded-md border border-(--control-border) px-3 py-2 text-sm hover:bg-(--menu-background)"
                    onClick={() => setReplyTo(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    disabled={isPending || !replyBody.trim()}
                    type="submit"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </form>
          )}
        </article>

        {comment.replies.length > 0 && (
          <ul className={`mt-3 grid gap-3 border-l border-(--control-border) pl-3 sm:pl-5 ${depth >= 4 ? "ml-2" : "ml-3 sm:ml-5"}`}>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <div className="grid gap-6">
      <header>
        <h2 className="text-2xl font-bold text-(--text-color)">Comments</h2>
        <p className="mt-1 text-sm text-(--muted-text-color)">
          Join the discussion. Comments are limited to 2,000 characters.
        </p>
      </header>

      {loadError && (
        <p className="rounded-md border border-(--control-border) p-3 text-sm text-(--muted-text-color)" role="status">
          {loadError}
        </p>
      )}
      {error && (
        <p className="rounded-md border border-red-500/50 p-3 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {currentUser ? (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            submitComment(null);
          }}
        >
          <label className="font-semibold text-(--text-color)" htmlFor="new-comment">
            Write a comment
          </label>
          <textarea
            className="min-h-28 w-full resize-y rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 text-inherit outline-none focus:border-blue-500"
            id="new-comment"
            maxLength={2000}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share your thoughts…"
            value={body}
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-(--muted-text-color)">{body.length}/2000</span>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending || !body.trim()}
              type="submit"
            >
              {isPending ? "Please wait…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="rounded-lg border border-(--card-border) bg-(--card-background) p-4 text-(--muted-text-color)">
          <Link className="font-semibold text-(--text-color) underline underline-offset-4" href="/sign-in">
            Sign in
          </Link>{" "}
          to comment, reply, and vote.
        </p>
      )}

      {commentTree.length ? (
        <ol className="grid gap-4">
          {commentTree.map((comment) => renderComment(comment))}
        </ol>
      ) : (
        !loadError && (
          <p className="text-sm text-(--muted-text-color)">No comments yet. Start the conversation.</p>
        )
      )}
    </div>
  );
}
