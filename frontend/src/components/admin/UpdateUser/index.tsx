import { getCurrentUser } from "@/lib/login/manage-login";
import ErrorMessage from "@/components/ErrorMessage";
import { UpdateUserForm } from "@/components/admin/UpdateUserForm";

export async function UpdateUser({
  passwordHref = "/account/password",
}: {
  passwordHref?: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <ErrorMessage
        contentTitle="Session expired"
        content="Sign in again to manage your account."
      />
    );
  }

  return <UpdateUserForm user={user} passwordHref={passwordHref} />;
}
