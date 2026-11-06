"use client";

import { useState } from "react";
import { deletePostAction } from "@/actions/post/delete-post-action";
import { useTransition } from "react";

export function PostDeleteForm({ id, title }: { id: string; title: string }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        startTransition(async () => {
          const result = await deletePostAction(id);
          if (result?.error) setError(result.error);
        });
      }}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        aria-label={`Delete post: ${title}`}
        className="rounded px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && <p className="basis-full text-sm text-red-500" role="alert">{error}</p>}
    </form>
  );
}