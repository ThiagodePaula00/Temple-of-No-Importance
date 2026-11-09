import type { Metadata } from "next";
import Link from "next/link";
import { UpdateUserPassword } from "@/components/admin/UpdateUserPassword";

export const metadata: Metadata = {
  title: "Change password",
};

export default function AccountPasswordPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Change password</h1>
      <UpdateUserPassword />
      <Link className="mt-6 inline-block underline" href="/account">
        Back to account
      </Link>
    </section>
  );
}
