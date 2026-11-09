"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { toast } from "react-toastify";
import { PostDate } from "@/components/PostDate";
import { NewPasswordSchema } from "@/lib/login/schemas";
import type { PasswordChangeRequestModel } from "@/models/password-request/password-request-models";
import {
  completePasswordChangeRequestAction,
  submitPasswordChangeRequestAction,
} from "@/actions/password-request/password-request-actions";

type PasswordChangeRequestPanelProps = {
  initialRequest: PasswordChangeRequestModel | null;
  loadError: string | null;
};

export function PasswordChangeRequestPanel({
  initialRequest,
  loadError,
}: PasswordChangeRequestPanelProps) {
  const router = useRouter();
  const [request, setRequest] = useState(initialRequest);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isPending, startTransition] = useTransition();
  const previousStatus = useRef(request?.status ?? null);

  useEffect(() => setRequest(initialRequest), [initialRequest]);

  useEffect(() => {
    if (previousStatus.current === "pending" && request?.status === "approved") {
      toast.success("The administrator approved your password change request.");
    } else if (previousStatus.current === "pending" && request?.status === "denied") {
      toast.info("The administrator declined your password change request.");
    }
    previousStatus.current = request?.status ?? null;
  }, [request?.status]);

  useEffect(() => {
    if (request?.status !== "pending") return;
    const refreshTimer = window.setInterval(() => router.refresh(), 15_000);
    return () => window.clearInterval(refreshTimer);
  }, [request?.status, router]);

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await submitPasswordChangeRequestAction(message);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Your request was sent to the administrator.");
      setMessage("");
      router.refresh();
    });
  }

  function setApprovedPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedPassword = NewPasswordSchema.safeParse(newPassword);
    if (!parsedPassword.success) {
      toast.error(parsedPassword.error.issues[0]?.message ?? "Enter a valid password.");
      return;
    }
    if (newPassword !== confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await completePasswordChangeRequestAction(newPassword);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Your password has been changed.");
      setNewPassword("");
      setConfirmation("");
      router.refresh();
    });
  }

  if (loadError) {
    return (
      <p className="mx-auto max-w-md rounded-md border border-(--control-border) p-4 text-sm text-(--muted-text-color)" role="alert">
        {loadError}
      </p>
    );
  }

  if (request?.status === "pending") {
    return (
      <div className="mx-auto grid max-w-md gap-4 rounded-lg border border-(--card-border) bg-(--card-background) p-5">
        <p className="font-semibold text-(--text-color)">Your request is waiting for administrator approval.</p>
        <p className="text-sm text-(--muted-text-color)">
          Submitted <PostDate dateTime={request.createdAt} />
        </p>
        {request.message && (
          <p className="whitespace-pre-wrap break-words text-sm text-(--muted-text-color)">
            {request.message}
          </p>
        )}
        <p className="text-sm text-(--muted-text-color)">
          This page checks for a decision automatically while it is open. You can keep using your current password while the request is pending.
        </p>
      </div>
    );
  }

  if (request?.status === "approved") {
    return (
      <form className="mx-auto grid max-w-md gap-5" onSubmit={setApprovedPassword}>
        <p className="rounded-md border border-green-600/40 bg-green-600/10 p-3 text-sm text-(--text-color)">
          Your request was approved. Choose your new password below.
        </p>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="new-password">
          New password
          <input
            autoComplete="new-password"
            className="rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500"
            disabled={isPending}
            id="new-password"
            onChange={(event) => setNewPassword(event.target.value)}
            required
            type="password"
            value={newPassword}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="confirm-password">
          Confirm new password
          <input
            autoComplete="new-password"
            className="rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500"
            disabled={isPending}
            id="confirm-password"
            onChange={(event) => setConfirmation(event.target.value)}
            required
            type="password"
            value={confirmation}
          />
        </label>
        <p className="text-sm text-(--muted-text-color)">
          Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character.
        </p>
        <button
          className="justify-self-start rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving…" : "Set new password"}
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto grid max-w-md gap-5">
      {request?.status === "denied" && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-(--text-color)">
          Your previous request was declined. You may submit a new request if needed.
        </p>
      )}
      {request?.status === "completed" && (
        <p className="rounded-md border border-green-600/40 bg-green-600/10 p-3 text-sm text-(--text-color)">
          Your password change is complete.
        </p>
      )}
      <form className="grid gap-4" onSubmit={submitRequest}>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="password-change-message">
          Message to the administrator (optional)
          <textarea
            className="min-h-24 resize-y rounded-md border border-(--control-border) bg-(--control-background) px-3 py-2 font-normal text-inherit outline-none focus:border-blue-500"
            id="password-change-message"
            maxLength={500}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Add a short note for the administrator. Do not include a password."
            value={message}
          />
        </label>
        <span className="-mt-3 text-right text-xs text-(--muted-text-color)">{message.length}/500</span>
        <p className="text-sm text-(--muted-text-color)">
          The administrator will approve or decline the request. You will choose your new password only after approval.
        </p>
        <button
          className="justify-self-start rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Sending…" : "Request password change"}
        </button>
      </form>
    </div>
  );
}
