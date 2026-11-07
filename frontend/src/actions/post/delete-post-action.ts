"use server";

import { revalidatePath } from "next/cache";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";

export async function deletePostAction(id: string) {
  const response = await authenticatedApiRequest(
    `/posts/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );

  if (!response.success) {
    return { success: false, error: response.errors.join(", ") };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}