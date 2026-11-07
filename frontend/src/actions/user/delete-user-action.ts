"use server";

import { redirect } from "next/navigation";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";
import { deleteLoginSession } from "@/lib/login/manage-login";

export async function deleteUserAction() {
  const response = await authenticatedApiRequest("/auth/me", {
    method: "DELETE",
  });

  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }

  await deleteLoginSession();
  redirect("/sign-in?accountDeleted=1");
}
