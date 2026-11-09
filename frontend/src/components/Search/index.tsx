"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchResultsDropdown } from "../SearchResultsDropdown";
import "./search.css";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
};

type HeaderSearchProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  slotClassName: string;
};

export function HeaderSearch({
  isOpen,
  onOpenChange,
  slotClassName,
}: HeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTerm = query.trim();
    if (!searchTerm) {
      setResults([]);
      setSearchStatus("idle");
      return;
    }

    const controller = new AbortController();
    setResults([]);
    setSearchStatus("loading");

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/posts?q=${encodeURIComponent(searchTerm)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error(`Search failed with HTTP ${res.status}`);

        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Search returned an invalid response");
        }

        if (!controller.signal.aborted) {
          setResults(data);
          setSearchStatus("success");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Post search failed:", error);
          setSearchStatus("error");
        }
      }
    };

    const timer = setTimeout(fetchPosts, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!query.trim()) {
          onOpenChange(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, onOpenChange]);

  return (
    <div className={slotClassName} ref={containerRef}>
      <div
        className={`header-search relative flex h-8 w-8 flex-col items-center justify-center overflow-visible rounded-full border border-transparent bg-transparent lg:ml-auto lg:h-13 lg:w-11 lg:flex-row lg:justify-start lg:overflow-visible ${
          isOpen
            ? "is-open h-13 w-full rounded-full border-(--control-border) bg-var(--control-background) lg:w-full"
            : ""
        }`}
      >
        <input
          aria-label="Search"
          className={`header-search__input absolute inset-0 ${
            isOpen ? "static block" : "hidden"
          } h-full w-full rounded-full border-0 bg-transparent py-3 pr-4 pl-13 text-base font-normal text-inherit placeholder:text-(--muted-text-color) outline-none lg:static lg:block lg:opacity-0 lg:pointer-events-none`}
          placeholder="Search"
          ref={inputRef}
          tabIndex={isOpen ? 0 : -1}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) {
              setResults([]);
              setSearchStatus("idle");
            }
          }}
        />
        <button
          title="Search"
          aria-label="Focus search"
          className="header-search__button absolute top-1/2 right-auto left-0 grid size-8 min-h-8 min-w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-inherit transition-colors hover:text-(--muted-text-color) lg:right-0.5 lg:left-auto lg:size-10 lg:min-h-10 lg:min-w-10"
          onClick={() => onOpenChange(true)}
          type="button"
        >
          <SearchIcon aria-hidden="true" />
        </button>

        <SearchResultsDropdown
          results={results}
          status={searchStatus}
          onSelect={() => {
            onOpenChange(false);
            setQuery("");
            setResults([]);
          }}
        />
      </div>
    </div>
  );
}
