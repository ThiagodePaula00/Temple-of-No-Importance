"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { logoutAction } from "@/actions/login/logout-action";
import { confirmWithToast } from "@/utils/toast-confirm";

type ConfirmLogoutButtonProps = {
  className: string;
  children: ReactNode;
  onConfirmed?: () => void;
};

export function ConfirmLogoutButton({
  className,
  children,
  onConfirmed,
}: ConfirmLogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function requestLogout() {
    confirmWithToast({
      toastId: "confirm-logout",
      title: "Log out?",
      message: "Are you sure you want to end your session?",
      confirmLabel: isPending ? "Please wait…" : "Log out",
      destructive: true,
      onConfirm: () => {
        onConfirmed?.();
        startTransition(async () => {
          await logoutAction();
        });
      },
    });
  }

  return (
    <button
      className={className}
      disabled={isPending}
      onClick={requestLogout}
      title="Log out"
      type="button"
    >
      {children}
    </button>
  );
}
