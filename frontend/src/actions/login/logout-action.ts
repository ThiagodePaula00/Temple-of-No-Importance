"use server";

import { redirect } from "next/navigation";
import { deleteLoginSession } from "@/lib/login/manage-login";

export async function logoutAction() {
  await deleteLoginSession();
  redirect("/sign-in");
}