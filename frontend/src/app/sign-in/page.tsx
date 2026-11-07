import LoginForm from "@/components/LoginForm";
import { ToastMessage } from "@/components/ToastMessage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign in",
};

type SignInPageProps = {
  searchParams: Promise<{ created?: string; accountDeleted?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { created, accountDeleted } = await searchParams;
  const notification =
    created === "1"
      ? "Account created. You can sign in now."
      : accountDeleted === "1"
        ? "Your account has been deleted."
        : null;

  return (
    <>
      {notification && <ToastMessage message={notification} />}
      <LoginForm />
    </>
  );
}