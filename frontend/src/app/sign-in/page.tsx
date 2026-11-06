import LoginForm from "@/components/LoginForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign in",
};

type SignInPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { created } = await searchParams;

  return (
    <>
      {created === "1" && (
        <p
          className="mx-auto mt-10 max-w-sm rounded-md border border-(--card-border) bg-(--card-background) p-3 text-center text-sm"
          role="status"
        >
          Account created. You can sign in now.
        </p>
      )}
      <LoginForm />
    </>
  );
}