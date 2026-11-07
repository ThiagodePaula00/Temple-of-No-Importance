"use server";

import { revalidatePath } from "next/cache";
import {
  AdminPostSchema,
  readPostFormFields,
  type PostActionState,
} from "@/lib/post/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";

export async function createPostAction(
  _state: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const fields = readPostFormFields(formData);
  const parsed = AdminPostSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      fields,
      errors: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const response = await authenticatedApiRequest("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.success) {
    return { fields, errors: response.errors, success: false };
  }

  revalidatePath("/admin");
  if (parsed.data.published) revalidatePath("/");
  return { fields: parsed.data, errors: [], success: true };
}