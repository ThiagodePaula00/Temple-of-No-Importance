"use client";

import { CheckIcon, Share2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SharePostButton() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyPostLink() {
    setCopied(false);
    setError(false);

    try {
      const postUrl = new URL(window.location.href);
      postUrl.search = "";
      postUrl.hash = "";
      await navigator.clipboard.writeText(postUrl.toString());
      setCopied(true);
      resetTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-(--control-border) bg-(--control-background) px-4 py-2 text-sm font-semibold text-inherit transition-colors hover:bg-(--menu-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        onClick={copyPostLink}
        type="button"
      >
        {copied ? (
          <CheckIcon aria-hidden="true" className="size-4" />
        ) : (
          <Share2Icon aria-hidden="true" className="size-4" />
        )}
        {copied ? "Link copied" : "Share post"}
      </button>
      <span aria-live="polite" className="text-sm text-(--muted-text-color)">
        {error ? "Could not copy the link. Please try again." : ""}
      </span>
    </div>
  );
}
