"use server";

import { redirect } from "next/navigation";
import {
  CreateUserSchema,
  type CreateUserFormState,
} from "@/lib/login/schemas";
import { apiRequest } from "@/utils/api-request";

export async function createUserAction(
  _state: CreateUserFormState,
  formData: FormData,
): Promise<CreateUserFormState> {
  const parsed = CreateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!parsed.success) {
    return {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const response = await apiRequest("/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.success) {
    return {
      name: parsed.data.name,
      email: parsed.data.email,
      errors: response.errors,
    };
  }

  redirect("/sign-in?created=1");
}
