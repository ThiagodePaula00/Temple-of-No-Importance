"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateUserAction } from "@/actions/user/update-user-action";
import type { SessionUser } from "@/lib/login/manage-login";
import { useActionToast } from "@/hooks/use-action-toast";
import { DeleteAccountButton } from "@/components/admin/DeleteAccountButton";

export function UpdateUserForm({
  user,
  passwordHref = "/account/password",
}: {
  user: SessionUser;
  passwordHref?: string;
}) {
  const [state, action, isPending] = useActionState(updateUserAction, {
    user,
    errors: [],
    success: false,
  });
  useActionToast(state, "Account updated.");

  return (
    <form action={action} className="mx-auto grid max-w-md gap-5">
      {[
        ["name", "Name", "text"],
        ["email", "Email", "email"],
      ].map(([name, label, type]) => (
        <label className="grid gap-2 text-sm font-semibold" htmlFor={name} key={name}>
          {label}
          <input
            className="rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500"
            defaultValue={state.user[name as "name" | "email"]}
            disabled={isPending}
            id={name}
            name={name}
            required
            type={type}
          />
        </label>
      ))}
      <button
        className="justify-self-start rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
      <Link className="w-fit underline" href={passwordHref}>
        Change password
      </Link>
      <DeleteAccountButton />
    </form>
  );
}
