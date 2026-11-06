import "server-only";
import { getCurrentUser } from "@/lib/login/manage-login";
import type { PublicUserDto } from "@/lib/user/schemas";

export async function getPublicUserFromApi(): Promise<PublicUserDto | null> {
  return getCurrentUser();
}