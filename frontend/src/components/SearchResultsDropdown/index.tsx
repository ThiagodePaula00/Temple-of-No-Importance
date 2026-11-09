"use client";

import "./dropdown.css";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
};

type SearchResultsDropdownProps = {
  results: Post[];
  status: "idle" | "loading" | "success" | "error";
  onSelect: () => void;
};

export function SearchResultsDropdown({
  results,
  status,
  onSelect,
}: SearchResultsDropdownProps) {
  if (status === "idle") return null;

  return (
    <div className="search-results-dropdown absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl p-2 shadow-xl">
      {status === "loading" && (
        <p className="p-3 text-sm" role="status">
          Searching…
        </p>
      )}
      {status === "error" && (
        <p className="p-3 text-sm" role="status">
          Search is unavailable. Try again.
        </p>
      )}
      {status === "success" && results.length === 0 && (
        <p className="p-3 text-sm" role="status">
          No posts found.
        </p>
      )}
      {results.map((post) => (
        <a
          key={post.id}
          href={`/post/${post.slug}`}
          className="search-result-item block rounded-lg p-3 transition-colors"
          onClick={onSelect}
        >
          <h4 className="text-sm font-semibold">{post.title}</h4>
          {post.excerpt && (
            <p className="mt-0.5 truncate text-xs">{post.excerpt}</p>
          )}
        </a>
      ))}
    </div>
  );
}
