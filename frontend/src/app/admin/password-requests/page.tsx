import type { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import { AdminPasswordChangeRequests } from "@/components/AdminPasswordChangeRequests";
import { findPendingPasswordChangeRequests } from "@/lib/password-request/queries";

export const metadata: Metadata = {
  title: "Password change requests",
};

export default async function PasswordChangeRequestsPage() {
  const response = await findPendingPasswordChangeRequests();
  if (!response.success) {
    return (
      <ErrorMessage
        contentTitle="Unable to load requests"
        content={response.errors.join(", ")}
      />
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Password change requests</h1>
      <p className="mb-6 text-sm text-(--muted-text-color)">
        Approve or decline requests. Users choose and submit their new password only after approval.
      </p>
      <AdminPasswordChangeRequests initialRequests={response.data} />
    </section>
  );
}
