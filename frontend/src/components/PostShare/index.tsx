'use client';

import { useState } from 'react';

type PostShareProps = {
  title: string;
};

export function PostShare({ title }: PostShareProps) {
  const [copied, setCopied] = useState(false);

  async function sharePost() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link to share the post:', url);
    }
  }

  return (
    <footer className="border-t border-(--control-border) pt-5">
      <button
        type="button"
        onClick={sharePost}
        className="inline-flex items-center gap-2 rounded-md border border-(--control-border) px-4 py-2 text-sm font-medium text-(--text-color) transition-colors hover:bg-(--control-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--text-color)"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
        </svg>
        {copied ? 'Copy Link' : 'Share post'}
      </button>
    </footer>
  );
}
