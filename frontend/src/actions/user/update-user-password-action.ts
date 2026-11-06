"use server";

import { PasswordChangeSchema } from "@/lib/login/schemas";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";

type PasswordActionState = {
  errors: string[];
  success: boolean;
};

export async function updateUserPasswordAction(
  _state: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const parsed = PasswordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    newPasswordConfirmation: formData.get("newPasswordConfirmation"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const response = await authenticatedApiRequest("/auth/me/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    }),
  });

  return response.success
    ? { errors: [], success: true }
    : { errors: response.errors, success: false };
}
