import ErrorMessage from "@/components/ErrorMessage";
import { PostFeatured } from "@/components/PostFeatured";
import { PostsList } from "@/components/PostsList";
import { SpinLoader } from "@/components/SpinLoader";
import { findAllPublicPostsFromApi } from "@/post/queries/public";
import { connection } from "next/server";
import { Suspense } from "react";

async function PublicPosts() {
  await connection();
  const response = await findAllPublicPostsFromApi();

  if (!response.success) {
    return (
      <ErrorMessage
        contentTitle="We couldn't load this page"
        content={response.errors.join(", ")}
      />
    );
  }

  const [featured, ...remaining] = response.data;

  return (
    <>
      <PostFeatured post={featured} />
      <PostsList posts={remaining} />
    </>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6">
      <Suspense fallback={<SpinLoader className="min-h-20 mb-16"/>}>
        <PublicPosts/>
      </Suspense>
    </main>
  );
}