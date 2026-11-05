"use client";

import {
  BookTextIcon,
  KeyRoundIcon,
  MenuIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ToggleTheme } from "@/components/ToggleTheme";

export function HeaderMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <button
        aria-controls="mobile-header-menu"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="grid cursor-pointer place-items-center border-0 bg-transparent p-1 text-inherit transition-colors hover:text-(--muted-text-color) lg:hidden"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        type="button"
      >
        {isMenuOpen ? <XIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
      </button>

      {isMenuOpen && (
        <ul
          aria-label="Header options"
          className="absolute top-full right-6 z-10 mt-2 grid gap-3 rounded-md border border-(--menu-border) bg-(--menu-background) p-4 text-base font-normal shadow-lg lg:hidden"
          id="mobile-header-menu"
        >
          <li>

            <ToggleTheme className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-inherit transition-colors hover:text-(--muted-text-color)" />
          </li>
          <li>
            <Link
              className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/about"
              onClick={closeMenu}
            >
              <BookTextIcon aria-hidden="true" />
              <span>About us</span>
            </Link>
          </li>
          <li>
            <Link
              className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/sign-in"
              onClick={closeMenu}
            >
              <KeyRoundIcon aria-hidden="true" />
              <span>Sign in</span>
            </Link>
          </li>
          <li>
            <Link
              className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/sign-up"
              onClick={closeMenu}
            >
              <UserPlusIcon aria-hidden="true" />
              <span>Sign up</span>
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}