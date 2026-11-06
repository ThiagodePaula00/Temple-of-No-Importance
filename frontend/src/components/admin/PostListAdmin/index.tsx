import Link from "next/link";
import { findAllPostFromApiAdmin } from "@/lib/post/queries/admin";
import { PostDeleteForm } from "@/components/admin/PostDeleteForm";
import ErrorMessage from "@/components/ErrorMessage";

export async function PostListAdmin() {
  const response = await findAllPostFromApiAdmin();

  if (!response.success) {
    return (
      <ErrorMessage
        contentTitle="Couldn't load posts"
        content={response.errors.join(", ")}
      />
    );
  }

  if (response.data.length === 0) {
    return <p className="text-(--muted-text-color)">No posts have been created yet.</p>;
  }

  return (
    <ul className="grid gap-3">
      {response.data.map((post) => (
        <li
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-(--card-border) bg-(--card-background) p-4"
          key={post.id}
        >
          <div className="min-w-0">
            <Link
              className="font-semibold transition-colors hover:text-(--muted-text-color)"
              href={`/admin/post/${post.id}`}
            >
              {post.title}
            </Link>
            <p className="text-sm text-(--muted-text-color)">
              {post.published ? "Published" : "Draft"} · {post.slug}
            </p>
          </div>
          <PostDeleteForm id={post.id} title={post.title} />
        </li>
      ))}
    </ul>
  );
}