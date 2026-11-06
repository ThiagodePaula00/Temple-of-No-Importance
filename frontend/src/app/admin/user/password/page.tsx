import type { Metadata } from "next";
import { UpdateUserPassword } from "@/components/admin/UpdateUserPassword";

export const metadata: Metadata = {
  title: "Change password",
};

export default function AdminUserPasswordPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Change password</h1>
      <UpdateUserPassword />
    </section>
  );
}
