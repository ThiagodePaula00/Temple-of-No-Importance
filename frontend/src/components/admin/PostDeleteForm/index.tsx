"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { deletePostAction } from "@/actions/post/delete-post-action";
import { confirmWithToast } from "@/utils/toast-confirm";

export function PostDeleteForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function requestDelete() {
    confirmWithToast({
      toastId: `confirm-delete-post-${id}`,
      title: "Delete post?",
      message: `“${title}” will be permanently deleted.`,
      confirmLabel: "Delete post",
      destructive: true,
      onConfirm: () => {
        startTransition(async () => {
          try {
            const result = await deletePostAction(id);

            if (!result.success) {
              toast.error(result.error);
              return;
            }

            toast.success("Post deleted.");
            router.refresh();
          } catch (error) {
            console.error("Failed to delete post.", error);
            toast.error("Could not delete the post. Please try again.");
          }
        });
      },
    });
  }

  return (
    <button
      aria-label={`Delete post: ${title}`}
      className="rounded px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-50"
      disabled={isPending}
      onClick={requestDelete}
      type="button"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
