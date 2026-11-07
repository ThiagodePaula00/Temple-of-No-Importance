import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/login/manage-login";
import { apiUrl } from "@/utils/api-request";

type RefreshedTokens = {
  accessToken: string;
  refreshToken: string;
};

function isRefreshedTokens(value: unknown): value is RefreshedTokens {
  return (
    typeof value === "object" &&
    value !== null &&
    "accessToken" in value &&
    typeof value.accessToken === "string" &&
    "refreshToken" in value &&
    typeof value.refreshToken === "string"
  );
}

export async function proxy(request: NextRequest) {
  if (
    request.cookies.has(ACCESS_TOKEN_COOKIE) ||
    !request.cookies.has(REFRESH_TOKEN_COOKIE)
  ) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return NextResponse.next();

  const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!refreshResponse.ok) {
    const response = NextResponse.next();
    if (refreshResponse.status === 401) {
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
    }
    return response;
  }

  const payload: unknown = await refreshResponse.json();
  if (!isRefreshedTokens(payload)) {
    throw new Error("The auth refresh endpoint returned an invalid token response.");
  }

  request.cookies.set(ACCESS_TOKEN_COOKIE, payload.accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE, payload.refreshToken);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, payload.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, payload.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
