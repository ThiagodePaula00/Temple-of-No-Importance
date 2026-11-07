"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostModel } from "@/models/post/post-models";
import { PostDate } from "@/components/PostDate";
import { PostDeleteForm } from "@/components/admin/PostDeleteForm";

type PostFilter = "all" | "published" | "drafts";

const filters: Array<{ value: PostFilter; label: string }> = [
  { value: "all", label: "All posts" },
  { value: "published", label: "Published" },
  { value: "drafts", label: "Drafts" },
];

export function PostListView({ posts }: { posts: PostModel[] }) {
  const [filter, setFilter] = useState<PostFilter>("all");
  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.published).length,
      drafts: posts.filter((post) => !post.published).length,
    }),
    [posts],
  );
  const filteredPosts = posts.filter((post) => {
    if (filter === "published") return post.published;
    if (filter === "drafts") return !post.published;
    return true;
  });

  return (
    <div className="grid gap-5">
      <div
        aria-label="Filter posts"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {filters.map(({ value, label }) => (
          <button
            aria-pressed={filter === value}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              filter === value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-(--control-border) hover:bg-(--menu-background)"
            }`}
            key={value}
            onClick={() => setFilter(value)}
            type="button"
          >
            {label} <span className="opacity-75">({counts[value]})</span>
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="rounded-lg border border-(--card-border) bg-(--card-background) p-6 text-center text-(--muted-text-color)">
          {filter === "drafts"
            ? "There are no drafts yet."
            : filter === "published"
              ? "There are no published posts yet."
              : "No posts have been created yet."}
        </p>
      ) : (
        <ul className="grid gap-3">
          {filteredPosts.map((post) => (
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
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-(--muted-text-color)">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      post.published
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <PostDate dateTime={post.updatedAt} />
                  <code className="truncate">/post/{post.slug}</code>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  className="rounded px-2 py-1 text-sm transition-colors hover:bg-(--menu-background)"
                  href={`/admin/post/${post.id}`}
                >
                  Edit
                </Link>
                <PostDeleteForm id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
