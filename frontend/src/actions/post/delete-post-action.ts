"use server";

import { redirect } from "next/navigation";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";

export async function deletePostAction(id: string) {
  const response = await authenticatedApiRequest(
    `/posts/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );

  if (!response.success) {
    return { error: response.errors.join(", ") };
  }

  redirect("/admin?deleted=1");
}