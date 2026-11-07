"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { deleteUserAction } from "@/actions/user/delete-user-action";
import { confirmWithToast } from "@/utils/toast-confirm";

export function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();

  function requestDelete() {
    confirmWithToast({
      toastId: "confirm-delete-account",
      title: "Delete your account?",
      message: "This action cannot be undone. Your account will be removed.",
      confirmLabel: isPending ? "Please wait…" : "Delete account",
      destructive: true,
      onConfirm: () => {
        startTransition(async () => {
          try {
            const result = await deleteUserAction();
            if (!result.success) toast.error(result.error);
          } catch (error) {
            console.error("Failed to delete account.", error);
            toast.error("Could not delete the account. Please try again.");
          }
        });
      },
    });
  }

  return (
    <button
      className="w-fit rounded-md border border-red-500/50 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-60"
      disabled={isPending}
      onClick={requestDelete}
      type="button"
    >
      {isPending ? "Deleting…" : "Delete account"}
    </button>
  );
}
