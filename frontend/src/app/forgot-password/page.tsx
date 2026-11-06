import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto my-16 mb-32 max-w-lg rounded-xl border border-(--card-border) bg-(--card-background) p-8 text-center shadow-lg">
      <h1 className="mb-3 text-2xl font-bold">Password recovery</h1>
      <p className="mb-6 text-(--muted-text-color)">
        Password reset email is not configured yet. Contact the site administrator
        to recover access.
      </p>
      <Link className="font-semibold underline" href="/sign-in">
        Return to sign in
      </Link>
    </main>
  );
}
