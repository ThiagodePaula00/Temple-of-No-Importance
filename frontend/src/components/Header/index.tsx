"use client";

import {
  BookTextIcon,
  KeyRoundIcon,
  LogOutIcon,
  PlusIcon,
  ShieldUserIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/actions/login/logout-action";
import { HeaderMenu } from "@/components/HeaderMenu";
import { HeaderSearch } from "@/components/Search";
import { ToggleTheme } from "@/components/ToggleTheme";

type HeaderProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const iconLinkClass =
  "flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-(--muted-text-color)";

export function Header({ isAuthenticated, isAdmin }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header
      className={`relative mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 px-4 pt-3 pb-8 font-bold sm:px-6 lg:grid-cols-[max-content_minmax(0,1fr)_max-content] lg:gap-x-4 lg:px-6 ${
        isSearchOpen ? "grid-rows-[auto_auto]" : ""
      }`}
    >
      <h1 className="col-start-1 row-start-1 text-xl/normal transition-[font-size,line-height] duration-250 motion-reduce:transition-none sm:text-4xl/normal">
        <Link
          className="cursor-pointer whitespace-nowrap transition-colors hover:text-(--muted-text-color)"
          href="/"
          title="Home"
        >
          Temple of No Importance
        </Link>
      </h1>

      <HeaderSearch
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        slotClassName={`${
          isSearchOpen
            ? "static col-span-2 row-start-2 w-full pt-2"
            : "absolute top-3 right-[3.25rem] w-auto sm:top-[calc(50%_-_0.625rem)] sm:-translate-y-1/2 lg:top-3 lg:translate-y-0"
        } lg:static lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:w-full lg:translate-y-0 lg:pt-0`}
      />

      <nav
        aria-label="Main navigation"
        className="col-start-2 row-start-1 flex items-center lg:col-start-3"
      >
        <div className="hidden items-center gap-4 lg:flex">
          <ToggleTheme className={`${iconLinkClass} cursor-pointer whitespace-nowrap`} />

          <Link className={iconLinkClass} href="/about" title="About us">
            <BookTextIcon aria-hidden="true" />
            <span>About us</span>
          </Link>

          {isAdmin && (
            <>
              <Link className={iconLinkClass} href="/admin" title="Admin">
                <ShieldUserIcon aria-hidden="true" />
                <span>Admin</span>
              </Link>
              <Link
                className={iconLinkClass}
                href="/admin/post/new"
                title="Create post"
              >
                <PlusIcon aria-hidden="true" />
                <span>Create post</span>
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <form action={logoutAction}>
              <button className={iconLinkClass} title="Log out" type="submit">
                <LogOutIcon aria-hidden="true" />
                <span>Log out</span>
              </button>
            </form>
          ) : (
            <>
              <Link className={iconLinkClass} href="/sign-in" title="Sign in">
                <KeyRoundIcon aria-hidden="true" />
                <span>Sign in</span>
              </Link>
              <Link className={iconLinkClass} href="/sign-up" title="Sign up">
                <UserPlusIcon aria-hidden="true" />
                <span>Sign up</span>
              </Link>
            </>
          )}
        </div>
        <HeaderMenu
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        />
      </nav>
    </header>
  );
}
