"use server";

import { ProfileSchema } from "@/lib/login/schemas";
import type { SessionUser } from "@/lib/login/manage-login";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";

type UpdateUserState = {
  user: SessionUser;
  errors: string[];
  success: boolean;
};

export async function updateUserAction(
  state: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  const parsed = ProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      ...state,
      errors: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const response = await authenticatedApiRequest<SessionUser>("/auth/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.success) {
    return { ...state, errors: response.errors, success: false };
  }

  return { user: response.data, errors: [], success: true };
}
