"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPostAction } from "@/actions/post/create-post-action";
import { updatePostAction } from "@/actions/post/update-post-action";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SafeMarkdown } from "@/components/SafeMarkdown";
import type { PostModel } from "@/models/post/post-models";
import type { AdminPostInput, PostActionState } from "@/lib/post/schemas";
import { useActionToast } from "@/hooks/use-action-toast";
import { makePostSlug } from "@/utils/make-post-slug";

type ManagerPostFormProps =
  | { mode: "create" }
  | { mode: "update"; post: PostModel };

const emptyFields: AdminPostInput = {
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  published: false,
};

const fieldClass =
  "w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none transition-colors focus:border-blue-500 disabled:opacity-60";

export function ManagerPostForm(props: ManagerPostFormProps) {
  const router = useRouter();
  const initialFields: AdminPostInput =
    props.mode === "update"
      ? {
          title: props.post.title,
          excerpt: props.post.excerpt,
          content: props.post.content,
          coverImageUrl: props.post.coverImageUrl,
          published: props.post.published,
        }
      : emptyFields;
  const initialState: PostActionState = {
    fields: initialFields,
    errors: [],
    success: false,
  };
  const action =
    props.mode === "update"
      ? updatePostAction.bind(null, props.post.id)
      : createPostAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [fields, setFields] = useState(initialFields);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useActionToast(
    state,
    props.mode === "create" ? "Post created." : "Post updated.",
  );

  useEffect(() => {
    if (!state.success) return;

    router.replace("/admin");
    router.refresh();
  }, [router, state.success]);

  function updateField<Key extends keyof AdminPostInput>(
    key: Key,
    value: AdminPostInput[Key],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  return (
    <form action={formAction} className="mb-16 grid gap-5">
      <label className="grid gap-2 text-sm font-semibold" htmlFor="title">
        Title
        <input
          className={fieldClass}
          disabled={isPending}
          id="title"
          maxLength={200}
          name="title"
          onChange={(event) => updateField("title", event.target.value)}
          required
          value={fields.title}
        />
      </label>

      <p className="text-sm text-(--muted-text-color)">
        Post URL: <code>/post/{makePostSlug(fields.title) || "your-title"}</code>
      </p>

      <label className="grid gap-2 text-sm font-semibold" htmlFor="excerpt">
        Excerpt
        <textarea
          className={`${fieldClass} min-h-24 resize-y`}
          disabled={isPending}
          id="excerpt"
          maxLength={500}
          name="excerpt"
          onChange={(event) => updateField("excerpt", event.target.value)}
          value={fields.excerpt}
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold" htmlFor="content">
        Content (Markdown)
        <textarea
          className={`${fieldClass} min-h-80 resize-y`}
          disabled={isPending}
          id="content"
          name="content"
          onChange={(event) => updateField("content", event.target.value)}
          required
          value={fields.content}
        />
      </label>
      <button
        aria-expanded={isPreviewOpen}
        className="w-fit rounded-md border border-(--control-border) px-3 py-1.5 text-sm transition-colors hover:bg-(--menu-background)"
        onClick={() => setIsPreviewOpen((open) => !open)}
        type="button"
      >
        {isPreviewOpen ? "Hide preview" : "Preview Markdown"}
      </button>
      {isPreviewOpen && (
        <section
          aria-label="Markdown preview"
          className="grid gap-4 rounded-lg border border-(--card-border) bg-(--card-background) p-5"
        >
          <h2 className="text-lg font-semibold">
            {fields.title || "Untitled post"}
          </h2>
          {fields.excerpt && (
            <p className="text-(--muted-text-color)">{fields.excerpt}</p>
          )}
          <SafeMarkdown markdown={fields.content} />
        </section>
      )}

      <ImageUploader
        defaultValue={fields.coverImageUrl}
        disabled={isPending}
      />

      <label className="grid gap-2 text-sm font-semibold" htmlFor="published">
        Post status
        <select
          className={fieldClass}
          disabled={isPending}
          id="published"
          name="published"
          onChange={(event) =>
            updateField("published", event.target.value === "published")
          }
          value={fields.published ? "published" : "draft"}
        >
          <option value="draft">Save as draft</option>
          <option value="published">Publish now</option>
        </select>
      </label>

      {state.errors.length > 0 && (
        <ul className="list-inside list-disc text-sm text-red-500" role="alert">
          {state.errors.map((error, index) => (
            <li key={`${index}-${error}`}>{error}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending
            ? "Saving…"
            : fields.published
              ? "Publish post"
              : "Save draft"}
        </button>
        <Link
          className="rounded-md border border-(--control-border) px-4 py-2 text-sm transition-colors hover:bg-(--menu-background)"
          href="/admin"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
