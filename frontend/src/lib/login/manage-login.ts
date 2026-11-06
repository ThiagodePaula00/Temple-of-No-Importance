import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest } from "@/utils/api-request";

const SESSION_COOKIE = "temple_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export async function createLoginSessionFromApi(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getLoginSessionForApi() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getLoginSessionForApi();

  if (!token) {
    return null;
  }

  const response = await apiRequest<SessionUser>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return response.success ? response.data : null;
}

export async function requireAdminSessionOrRedirect() {
  const user = await getCurrentUser();

  if (!user?.isAdmin) {
    redirect("/sign-in?next=%2Fadmin");
  }

  return user;
}