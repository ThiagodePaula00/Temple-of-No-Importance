import { findAllPostFromApiAdmin } from "@/lib/post/queries/admin";
import ErrorMessage from "@/components/ErrorMessage";
import { PostListView } from "@/components/admin/PostListView";

export async function PostListAdmin() {
  const response = await findAllPostFromApiAdmin();

  if (!response.success) {
    return (
      <ErrorMessage
        contentTitle="Couldn't load posts"
        content={response.errors.join(", ")}
      />
    );
  }

  return <PostListView posts={response.data} />;
}