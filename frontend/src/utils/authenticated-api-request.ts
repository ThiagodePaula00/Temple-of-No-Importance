import "server-only";
import { getLoginSessionForApi } from "@/lib/login/manage-login";
import { apiRequest, type ApiRequest } from "@/utils/api-request";

export async function authenticatedApiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiRequest<T>> {
  const token = await getLoginSessionForApi();

  if (!token) {
    return {
      success: false,
      errors: ["You are not authenticated."],
      status: 401,
    };
  }

  const sendRequest = (accessToken: string) => {
    const headers = new Headers(options?.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    return apiRequest<T>(path, {
      ...options,
      headers,
      cache: "no-store",
    });
  };

  return sendRequest(token);
}
