import type { Metadata } from "next";
import Link from "next/link";
import { PasswordChangeRequestPanel } from "@/components/PasswordChangeRequestPanel";
import { findMyPasswordChangeRequest } from "@/lib/password-request/queries";

export const metadata: Metadata = {
  title: "Change password",
};

export default async function AccountPasswordPage() {
  const response = await findMyPasswordChangeRequest();

  return (
    <section>
      <h1 className="mb-2 text-2xl font-bold">Request a password change</h1>
      <p className="mb-6 text-sm text-(--muted-text-color)">
        An administrator must approve your request before you can set a new password.
      </p>
      <PasswordChangeRequestPanel
        initialRequest={response.success ? response.data : null}
        loadError={response.success ? null : response.errors.join(", ")}
      />
      <Link className="mt-6 inline-block underline" href="/account">
        Back to account
      </Link>
    </section>
  );
}
