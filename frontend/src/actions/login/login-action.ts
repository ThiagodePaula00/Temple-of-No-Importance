"use server";

import { redirect } from "next/navigation";
import {
  LoginSchema,
  type LoginFormState,
} from "@/lib/login/schemas";
import {
  createLoginSessionFromApi,
  type SessionUser,
} from "@/lib/login/manage-login";
import { apiRequest } from "@/utils/api-request";

export async function loginAction(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const parsed = LoginSchema.safeParse({
    email,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      email,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const response = await apiRequest<{
    accessToken: string;
    user: SessionUser;
  }>("/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.success) {
    return { email, errors: response.errors };
  }

  await createLoginSessionFromApi(response.data.accessToken);
  redirect(response.data.user.isAdmin ? "/admin" : "/");
}