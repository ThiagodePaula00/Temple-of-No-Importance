import type { Metadata } from "next";
import { UpdateUser } from "@/components/admin/UpdateUser";

export const metadata: Metadata = {
  title: "Account",
};

export default function AdminUserPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-center">Your account</h1>
      <UpdateUser />
    </section>
  );
}
