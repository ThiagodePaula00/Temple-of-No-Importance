"use server";

import { redirect } from "next/navigation";
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
    };
  }

  const response = await authenticatedApiRequest("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.success) {
    return { fields, errors: response.errors };
  }

  redirect("/admin?created=1");
}