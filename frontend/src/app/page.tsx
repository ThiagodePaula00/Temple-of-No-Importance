import { PostsList } from "@/components/PostsList";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<p>Loading posts...</p>}>
        <PostsList/>
      </Suspense>
    </main>
  );
}