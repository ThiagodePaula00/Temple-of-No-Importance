"use client";

import {
  BookTextIcon,
  KeyRoundIcon,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShieldUserIcon,
  UserPlusIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmLogoutButton } from "@/components/ConfirmLogoutButton";
import { ToggleTheme } from "@/components/ToggleTheme";

type HeaderMenuProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const itemClass =
  "flex items-center gap-3 border-0 bg-transparent p-0 text-inherit transition-colors hover:text-(--muted-text-color)";

export function HeaderMenu({ isAuthenticated, isAdmin }: HeaderMenuProps) {
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
          className="absolute top-full right-6 z-10 mt-2 grid min-w-44 gap-3 rounded-md border border-(--menu-border) bg-(--menu-background) p-4 text-base font-normal shadow-lg lg:hidden"
          id="mobile-header-menu"
        >
          <li>
            <ToggleTheme className={`${itemClass} cursor-pointer`} />
          </li>
          <li>
            <Link className={itemClass} href="/about" onClick={closeMenu}>
              <BookTextIcon aria-hidden="true" />
              <span>About us</span>
            </Link>
          </li>
          <li>
            <Link className={itemClass} href="/privacy" onClick={closeMenu}>
              <ShieldCheckIcon aria-hidden="true" />
              <span>Privacy policy</span>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link className={itemClass} href="/admin" onClick={closeMenu}>
                  <ShieldUserIcon aria-hidden="true" />
                  <span>Admin</span>
                </Link>
              </li>
              <li>
                <Link
                  className={itemClass}
                  href="/admin/post/new"
                  onClick={closeMenu}
                >
                  <PlusIcon aria-hidden="true" />
                  <span>Create post</span>
                </Link>
              </li>
            </>
          )}
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <li>
                  <Link className={itemClass} href="/account" onClick={closeMenu}>
                    <UserRoundIcon aria-hidden="true" />
                    <span>Account</span>
                  </Link>
                </li>
              )}
              <li>
                <ConfirmLogoutButton
                  className={itemClass}
                  onConfirmed={closeMenu}
                >
                  <LogOutIcon aria-hidden="true" />
                  <span>Log out</span>
                </ConfirmLogoutButton>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className={itemClass} href="/sign-in" onClick={closeMenu}>
                  <KeyRoundIcon aria-hidden="true" />
                  <span>Sign in</span>
                </Link>
              </li>
              <li>
                <Link className={itemClass} href="/sign-up" onClick={closeMenu}>
                  <UserPlusIcon aria-hidden="true" />
                  <span>Sign up</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
}
