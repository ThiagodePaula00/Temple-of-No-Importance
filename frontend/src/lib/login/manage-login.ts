import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest } from "@/utils/api-request";

export const ACCESS_TOKEN_COOKIE = "temple_access_token";
export const REFRESH_TOKEN_COOKIE = "temple_refresh_token";
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 14 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export async function createLoginSessionFromApi(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    const response = await apiRequest<void>("/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.success && response.status !== 401) {
      console.error("Failed to revoke the refresh token during logout.", response.errors);
    }
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getLoginSessionForApi() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value ?? null;
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