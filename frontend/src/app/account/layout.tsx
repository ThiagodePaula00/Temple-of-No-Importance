import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/login/manage-login";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=%2Faccount");
  if (user.isAdmin) redirect("/admin/user");

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
      <nav
        aria-label="Account"
        className="mb-8 flex flex-wrap justify-center gap-2 rounded-lg border border-(--card-border) bg-(--card-background) p-2"
      >
        <Link
          className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-(--menu-background) hover:text-(--text-color)"
          href="/account"
        >
          Profile
        </Link>
      </nav>
      {children}
    </main>
  );
}
