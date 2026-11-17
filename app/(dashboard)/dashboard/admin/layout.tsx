import { Suspense, type ReactNode } from "react";

import AdminShell from "@/components/admin/admin-shell";

import AdminLoading from "./loading";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}