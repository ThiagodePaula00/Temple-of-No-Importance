"use server";

import { revalidatePath } from "next/cache";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";

type PasswordRequestActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitPasswordChangeRequestAction(
  message: string,
): Promise<PasswordRequestActionResult> {
  const response = await authenticatedApiRequest("/password-change-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }
  revalidatePath("/account/password");
  revalidatePath("/admin/password-requests");
  return { success: true };
}

export async function completePasswordChangeRequestAction(
  newPassword: string,
): Promise<PasswordRequestActionResult> {
  const response = await authenticatedApiRequest(
    "/password-change-requests/complete",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    },
  );
  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }
  revalidatePath("/account/password");
  return { success: true };
}

export async function reviewPasswordChangeRequestAction(
  requestId: string,
  allow: boolean,
): Promise<PasswordRequestActionResult> {
  const response = await authenticatedApiRequest(
    `/password-change-requests/${encodeURIComponent(requestId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allow }),
    },
  );
  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }
  revalidatePath("/admin/password-requests");
  return { success: true };
}
