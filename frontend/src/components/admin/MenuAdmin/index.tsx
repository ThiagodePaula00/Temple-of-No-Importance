"use client";

import { FileTextIcon, KeyRoundIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";

export function MenuAdmin() {
  return (
    <nav
      aria-label="Administration"
      className="mb-8 flex justify-center flex-wrap gap-2 rounded-lg border border-(--card-border) bg-(--card-background) p-2"
    >
      <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-(--menu-background) hover:text-(--text-color)" href="/admin">
        <FileTextIcon aria-hidden="true" size={18} />
        Posts
      </Link>
      <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-(--menu-background) hover:text-(--text-color)" href="/admin/user">
        <UserRoundIcon aria-hidden="true" size={18} />
        Account
      </Link>
      <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-(--menu-background) hover:text-(--text-color)" href="/admin/password-requests">
        <KeyRoundIcon aria-hidden="true" size={18} />
        Password requests
      </Link>
    </nav>
  );
}
