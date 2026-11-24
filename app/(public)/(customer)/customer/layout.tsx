import { Suspense, type ReactNode } from "react";
import CustomerShell from "@/components/customer/customer-shell";
export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={<div className="p-12 text-center">Loading account...</div>}
    >
      <CustomerShell>{children}</CustomerShell>
    </Suspense>
  );
}
