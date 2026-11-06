"use client";

import { useActionState } from "react";
import {
  createPostAction,
} from "@/actions/post/create-post-action";
import { updatePostAction } from "@/actions/post/update-post-action";
import type { PostModel } from "@/models/post/post-models";
import type { PostActionState } from "@/lib/post/schemas";
import { ImageUploader } from "@/components/admin/ImageUploader";

type ManagerPostFormProps =
  | { mode: "create" }
  | { mode: "update"; post: PostModel };

const emptyFields = {
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  published: false,
};

export function ManagerPostForm(props: ManagerPostFormProps) {
  const initialState: PostActionState = {
    fields: props.mode === "update" ? {
      title: props.post.title,
      excerpt: props.post.excerpt,
      content: props.post.content,
      coverImageUrl: props.post.coverImageUrl,
      published: props.post.published,
    } : emptyFields,
    errors: [],
  };
  const action = props.mode === "update"
    ? updatePostAction.bind(null, props.post.id)
    : createPostAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mb-16 grid gap-5">
      {([
        ["title", "Title", "text"],
        ["excerpt", "Excerpt", "text"],
      ] as const).map(([name, label, type]) => (
        <label className="grid gap-2 text-sm font-semibold" htmlFor={name} key={name}>
          {label}
          <input
            className="w-full rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500"
            disabled={isPending}
            id={name}
            name={name}
            required
            type={type}
            defaultValue={state.fields[name]}
          />
        </label>
      ))}

      <ImageUploader
        defaultValue={state.fields.coverImageUrl}
        disabled={isPending}
      />

      <label className="grid gap-2 text-sm font-semibold" htmlFor="content">
        Content (Markdown)
        <textarea
          className="min-h-72 w-full resize-y rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500"
          defaultValue={state.fields.content}
          disabled={isPending}
          id="content"
          name="content"
          required
        />
      </label>

      {props.mode === "update" && (
        <label className="flex items-center gap-2 text-sm">
          <input
            defaultChecked={state.fields.published}
            disabled={isPending}
            name="published"
            type="checkbox"
          />
          Publish this post
        </label>
      )}

      {state.errors.length > 0 && (
        <ul className="list-inside list-disc text-sm text-red-500" role="alert">
          {state.errors.map((error, index) => (
            <li key={`${index}-${error}`}>{error}</li>
          ))}
        </ul>
      )}
      <button
        className="justify-self-start rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : props.mode === "create" ? "Create post" : "Save changes"}
      </button>
    </form>
  );
}