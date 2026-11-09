"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { CheckIcon, XIcon } from "lucide-react";
import { PostDate } from "@/components/PostDate";
import { reviewPasswordChangeRequestAction } from "@/actions/password-request/password-request-actions";
import type { AdminPasswordChangeRequestModel } from "@/models/password-request/password-request-models";

export function AdminPasswordChangeRequests({
  initialRequests,
}: {
  initialRequests: AdminPasswordChangeRequestModel[];
}) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setRequests(initialRequests), [initialRequests]);

  function review(requestId: string, allow: boolean) {
    startTransition(async () => {
      const result = await reviewPasswordChangeRequestAction(requestId, allow);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(allow ? "Password change approved." : "Request declined.");
      setRequests((current) => current.filter((request) => request.id !== requestId));
      router.refresh();
    });
  }

  if (!requests.length) {
    return (
      <p className="rounded-lg border border-(--card-border) bg-(--card-background) p-6 text-center text-(--muted-text-color)">
        There are no pending password change requests.
      </p>
    );
  }

  return (
    <ul className="grid gap-4">
      {requests.map((request) => (
        <li
          className="grid gap-4 rounded-lg border border-(--card-border) bg-(--card-background) p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          key={request.id}
        >
          <div className="grid min-w-0 gap-2">
            <div>
              <h2 className="font-semibold text-(--text-color)">{request.user.name}</h2>
              <p className="break-all text-sm text-(--muted-text-color)">{request.user.email}</p>
            </div>
            <p className="text-sm text-(--muted-text-color)">
              Requested <PostDate dateTime={request.createdAt} />
            </p>
            {request.message && (
              <p className="whitespace-pre-wrap break-words text-sm text-(--text-color)">
                {request.message}
              </p>
            )}
            <p className="text-xs text-(--muted-text-color)">
              The user will set their new password after approval. No password is included in this request.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              disabled={isPending}
              onClick={() => review(request.id, true)}
              type="button"
            >
              <CheckIcon aria-hidden="true" className="size-4" />
              Allow
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
              disabled={isPending}
              onClick={() => review(request.id, false)}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
              Do not allow
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
