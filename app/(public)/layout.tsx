import type { ReactNode } from "react";
import Footer from "@/components/share/Footer";
import Header from "@/components/share/Header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col">
      <Header />

      <main className="min-w-0 flex-1">{children}</main>

      <Footer />
    </div>
  );
}
