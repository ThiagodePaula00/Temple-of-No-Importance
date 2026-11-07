"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function ToastMessage({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "error";
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (type === "error") toast.error(message);
    else toast.success(message);
    router.replace(pathname, { scroll: false });
  }, [message, pathname, router, type]);

  return null;
}
