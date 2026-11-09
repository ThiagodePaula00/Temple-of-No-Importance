import type { Metadata } from "next";
import { UpdateUser } from "@/components/admin/UpdateUser";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <section>
      <h1 className="mb-6 text-center text-2xl font-bold">Your account</h1>
      <UpdateUser passwordHref="/account/password" />
    </section>
  );
}
