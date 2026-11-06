import Link from "next/link";
import { PostListAdmin } from "@/components/admin/PostListAdmin";

export default function AdminPage() {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          href="/admin/post/new"
        >
          Create post
        </Link>
      </div>
      <PostListAdmin />
    </section>
  );
}
