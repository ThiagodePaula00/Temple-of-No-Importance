import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ManagerPostForm } from "@/components/admin/ManagerPostForm";
import { findPostByIdFromApiAdmin } from "@/lib/post/queries/admin";

type AdminPostPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const response = await findPostByIdFromApiAdmin(id);
  return { title: response.success ? `Edit ${response.data.title}` : "Edit post" };
}

export default async function AdminPostPage({ params }: AdminPostPageProps) {
  const { id } = await params;
  const response = await findPostByIdFromApiAdmin(id);

  if (!response.success) {
    if (response.status === 404) notFound();
    throw new Error(`Could not load post: ${response.errors.join(", ")}`);
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Edit post</h1>
      <ManagerPostForm mode="update" post={response.data} />
    </section>
  );
}