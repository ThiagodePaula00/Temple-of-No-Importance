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
import { HeaderMenu } from "@/components/HeaderMenu";
import { HeaderSearch } from "@/components/Search";
import {
  ToggleTheme,
  ToggleThemeProvider,
} from "@/components/ToggleTheme";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ToggleThemeProvider>
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
            <ToggleTheme className="flex flex-col items-center whitespace-nowrap bg-transparent p-0 text-xs font-normal text-inherit cursor-pointer transition-colors hover:text-(--muted-text-color)" />
            
            <Link
              className="flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/about"
              title="About us"
            >
              <BookTextIcon aria-hidden="true" />
              <span>About us</span>
            </Link>

            {/* restrained rout */}
            <Link
              className="flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/admin"
              title="Admin"
            >
              <ShieldUserIcon aria-hidden="true" />
              <span>Admin</span>
            </Link>

            {/* {Temporaraly suspensed} */}
            {/* <Link
              className="flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/sign-up"
              title="Sign up"
            >
              <UserPlusIcon aria-hidden="true" />
              <span>Sign up</span>
            </Link> */}

            {/* {Temporaraly suspensed} */}
            {/* <Link
              className="flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/sign-in"
              title="Sign in"
            >
              <KeyRoundIcon aria-hidden="true" />
              <span>Sign in</span>
            </Link> */}

            {/* restrained rout */}
            <Link
              className="flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/post/new"
              title="New post"
            >
              <PlusIcon aria-hidden="true" />
              <span>New post</span>
            </Link>

            {/* restrained rout */}
            <Link
              className="flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-(--muted-text-color)"
              href="/logout"
              title="Log out"
            >
              <LogOutIcon aria-hidden="true" />
              <span>Log out</span>
            </Link>
          </div>
          <HeaderMenu />
        </nav>

      </header>
    </ToggleThemeProvider>
  );
}