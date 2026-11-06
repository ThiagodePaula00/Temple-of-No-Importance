import type { Metadata } from "next";
import { ManagerPostForm } from "@/components/admin/ManagerPostForm";

export const metadata: Metadata = {
  title: "Create post",
};

export default function AdminPostNewPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Create post</h1>
      <ManagerPostForm mode="create" />
    </section>
  );
}
