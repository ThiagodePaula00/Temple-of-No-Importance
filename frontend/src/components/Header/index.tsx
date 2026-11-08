"use client";

import {
  BookTextIcon,
  KeyRoundIcon,
  LogOutIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShieldUserIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmLogoutButton } from "@/components/ConfirmLogoutButton";
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
      className={`relative z-50 mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2 px-4 pt-3 pb-8 font-bold sm:px-6 lg:grid-cols-[max-content_minmax(0,1fr)_max-content] lg:gap-x-4 lg:px-6 ${
        isSearchOpen ? "grid-rows-[auto_auto]" : ""
      }`}
    >
      <h1 className="col-start-1 row-start-1 min-w-0 text-4xl transition-[font-size,line-height] duration-250 motion-reduce:transition-none">
        <Link
          className="header-title-font block cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-normal transition-colors hover:text-red-600"
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
            ? "col-span-3 row-start-2 w-full pt-2"
            : "col-start-2 row-start-1 w-8 self-center"
        } lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:w-full lg:pt-0`}
      />

      <nav
        aria-label="Main navigation"
        className="col-start-3 row-start-1 flex items-center lg:col-start-3"
      >
        <div className="hidden items-center gap-4 lg:flex">
          <ToggleTheme className={`${iconLinkClass} cursor-pointer whitespace-nowrap`} />

          <Link className={iconLinkClass} href="/about" title="About us">
            <BookTextIcon aria-hidden="true" />
            <span>About us</span>
          </Link>
          <Link className={iconLinkClass} href="/privacy" title="Privacy policy">
            <ShieldCheckIcon aria-hidden="true" />
            <span>Privacy</span>
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
            <div>
              <ConfirmLogoutButton className={iconLinkClass}>
                <LogOutIcon aria-hidden="true" />
                <span>Log out</span>
              </ConfirmLogoutButton>
            </div>
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
