"use client";

import { useActionState } from "react";
import { updateUserPasswordAction } from "@/actions/user/update-user-password-action";
import { useActionToast } from "@/hooks/use-action-toast";

export function UpdateUserPassword() {
  const [state, action, isPending] = useActionState(updateUserPasswordAction, {
    errors: [],
    success: false,
  });
  useActionToast(state, "Password changed.");

  return (
    <form action={action} className="mx-auto grid max-w-md gap-5">
      {[
        ["currentPassword", "Current password", "current-password"],
        ["newPassword", "New password", "new-password"],
        ["newPasswordConfirmation", "Confirm new password", "new-password"],
      ].map(([name, label, autoComplete]) => (
        <label className="grid gap-2 text-sm font-semibold" htmlFor={name} key={name}>
          {label}
          <input
            autoComplete={autoComplete}
            className="rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500"
            disabled={isPending}
            id={name}
            name={name}
            required
            type="password"
          />
        </label>
      ))}
      <p className="text-sm text-(--muted-text-color)">
        Use at least 8 characters, including uppercase and lowercase letters,
        a number, and a special character.
      </p>
      <button
        className="justify-self-start rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : "Change password"}
      </button>
    </form>
  );
}