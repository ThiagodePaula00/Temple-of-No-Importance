"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import "./search.css";

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

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className={slotClassName}>
      <div
        className={`header-search relative flex h-8 w-8 flex-col items-center justify-center overflow-visible rounded-full border border-transparent bg-transparent lg:ml-auto lg:h-13 lg:w-11 lg:flex-row lg:justify-start lg:overflow-hidden ${
          isOpen
            ? "is-open h-13 w-full overflow-hidden rounded-full border-(--control-border) bg-[var(--control-background) lg:w-full"
            : ""
        }`}
      >
        <input
          aria-label="Search"
          className={`header-search__input absolute inset-0 ${
            isOpen ? "static block" : "hidden"
          } h-full w-full rounded-full border-0 bg-transparent py-3 pr-4 pl-13 text-base font-normal text-inherit placeholder:text-(--muted-text-color) outline-none lg:static lg:block lg:opacity-0 lg:pointer-events-none`}
          onBlur={(event) => {
            if (!event.currentTarget.value.trim()) {
              onOpenChange(false);
            }
          }}
          placeholder="Search"
          ref={inputRef}
          tabIndex={isOpen ? 0 : -1}
          type="text"
        />
        <button
        title="Search"
          aria-label="Focus search"
          className="header-search__button absolute top-1/2 right-auto left-1 grid size-8 min-h-8 min-w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-inherit lg:right-0.5 lg:left-auto lg:size-10 lg:min-h-10 lg:min-w-10"
          onClick={() => onOpenChange(true)}
          type="button"
        >
          <SearchIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}