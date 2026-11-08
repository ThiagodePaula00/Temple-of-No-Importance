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
  onSelect: () => void;
};

export function SearchResultsDropdown({
  results,
  onSelect,
}: SearchResultsDropdownProps) {
  if (results.length === 0) return null;

  return (
    <div className="search-results-dropdown absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl p-2 shadow-xl">
      {results.map((post) => (
        <a
          key={post.id}
          href={`/post/${post.slug}`}
          className="search-result-item block p-3 rounded-lg transition-colors"
          onClick={onSelect}
        >
          <h4 className="font-semibold text-sm">
            {post.title}
          </h4>
          {post.excerpt && (
            <p className="text-xs truncate mt-0.5">
              {post.excerpt}
            </p>
          )}
        </a>
      ))}
    </div>
  );
}