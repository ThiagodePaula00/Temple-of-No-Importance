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
        Email-based password recovery is not available. If you can sign in, use
        the Account panel to request a password change for administrator
        approval. If you cannot access your account, contact the site
        administrator.
      </p>
      <Link className="font-semibold underline" href="/sign-in">
        Return to sign in
      </Link>
    </main>
  );
}
