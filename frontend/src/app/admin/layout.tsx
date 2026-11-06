import { MenuAdmin } from "@/components/admin/MenuAdmin";
import { requireAdminSessionOrRedirect } from "@/lib/login/manage-login";

type AdminPostLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPostLayout({ children }: Readonly<AdminPostLayoutProps>) {
  await requireAdminSessionOrRedirect();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-6">
      <MenuAdmin />
      {children}
    </main>
  );
}