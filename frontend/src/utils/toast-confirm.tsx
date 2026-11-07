"use client";

import type { ReactNode } from "react";
import { toast, type Id } from "react-toastify";

type ConfirmWithToastOptions = {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  toastId?: Id;
  onConfirm: () => void;
};

export function confirmWithToast({
  title,
  message,
  confirmLabel,
  destructive = false,
  toastId,
  onConfirm,
}: ConfirmWithToastOptions) {
  toast.info(
    ({ toastProps }) => (
      <section aria-label={title} className="grid gap-3">
        <h2 className="font-semibold">{title}</h2>
        <div className="text-sm">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-md border border-(--control-border) px-3 py-1.5 text-sm font-medium text-inherit transition-colors hover:bg-(--menu-background)"
            onClick={() => toast.dismiss(toastProps.toastId)}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-semibold text-white transition-colors ${
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => {
              toast.dismiss(toastProps.toastId);
              onConfirm();
            }}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    ),
    {
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false,
      role: "alertdialog",
      toastId,
    },
  );
}
