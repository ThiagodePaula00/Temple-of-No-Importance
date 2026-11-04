"use client";

import {
  BookTextIcon,
  KeyRoundIcon,
  MenuIcon,
  SearchIcon,
  SunIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-3 pb-8 font-bold sm:pb-10 md:pb-11 lg:pb-12">
      <h1 className="text-xl/normal sm:text-4xl/normal">
        <Link className="whitespace-nowrap" href="/">
          Temple of No Importance
        </Link>
      </h1>
      <div className="flex items-center gap-4 rounded-sm">
        <span
          aria-label="Search"
          className="flex flex-col items-center"
          role="img"
          title="Search"
        >
          <SearchIcon aria-hidden="true" />
          <span className="hidden text-xs font-normal lg:block">Search</span>
        </span>
        <div className="hidden items-center gap-4 lg:flex">
          <span className="flex flex-col items-center" title="Toggle theme">
            <SunIcon aria-hidden="true" />
            <span className="text-xs font-normal">Toggle theme</span>
          </span>
          <span className="flex flex-col items-center" title="About us">
            <BookTextIcon aria-hidden="true" />
            <span className="text-xs font-normal">About us</span>
          </span>
          <span className="flex flex-col items-center" title="Sign up">
            <UserPlusIcon aria-hidden="true" />
            <span className="text-xs font-normal">Sign up</span>
          </span>
          <span className="flex flex-col items-center" title="Sign in">
            <KeyRoundIcon aria-hidden="true" />
            <span className="text-xs font-normal">Sign in</span>
          </span>
        </div>
        <button
          aria-controls="mobile-header-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {isMenuOpen ? <XIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>
      </div>
      {isMenuOpen && (
        <ul
          aria-label="Header options"
          className="absolute top-full right-6 z-10 mt-2 grid gap-3 rounded-md border border-white/20 bg-[rgb(50,51,51)] p-4 text-base font-normal shadow-lg lg:hidden"
          id="mobile-header-menu"
        >
          <li className="flex items-center gap-3">
            <BookTextIcon aria-hidden="true" />
            <span>About us</span>
          </li>
          <li className="flex items-center gap-3">
            <UserPlusIcon aria-hidden="true" />
            <span>Sign up</span>
          </li>
          <li className="flex items-center gap-3">
            <KeyRoundIcon aria-hidden="true" />
            <span>Sign in</span>
          </li>
          <li className="flex items-center gap-3">
            <SunIcon aria-hidden="true" />
            <span>Toggle theme</span>
          </li>
        </ul>
      )}
    </header>
  );
}