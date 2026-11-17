"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { getErrorMessage } from "@/lib/utils";

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const userQuery = useGetMe();
  const logout = useLogout();

  const user = userQuery.data?.data;

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();

      router.replace("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (userQuery.isPending) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-[#faf7f0] text-[#08613f]"
      >
        Checking admin access...
      </div>
    );
  }

  if (userQuery.isError || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f0] p-6 text-[#052b24]">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">Unable to verify your session</h1>

          <p className="mt-3 text-sm text-gray-500">
            Sign in with an admin account, or retry if your connection was
            interrupted.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-[#08613f] px-5 py-2 text-sm text-white"
            >
              Sign in
            </Link>

            <button
              type="button"
              onClick={() => void userQuery.refetch()}
              className="rounded-full border px-5 py-2 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "ADMIN" || !user.isActive) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf7f0] p-6 text-[#052b24]">
        <ShieldCheck size={36} />

        <h1 className="text-2xl font-bold">Admin access required</h1>

        <Link
          href="/"
          className="rounded-full bg-[#08613f] px-6 py-3 text-sm text-white"
        >
          Back to website
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#052b24]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] flex-col bg-[#031f14] px-5 py-7 text-white lg:flex">
        <Link href="/dashboard/admin" className="text-2xl font-bold">
          Side Kitchen
          <span className="text-[#ffcc00]">.</span>
        </Link>

        <p className="mt-1 text-xs tracking-[2px] text-white/50">
          ADMIN WORKSPACE
        </p>

        <nav aria-label="Admin navigation" className="mt-10 space-y-2">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3 rounded-xl bg-[#ffcc00] px-4 py-3 text-sm font-semibold text-[#052b24]"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/admin#orders"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"
          >
            <ClipboardList size={18} />
            Manage orders
          </Link>

          <Link
            href="/foods"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10"
          >
            <ExternalLink size={18} />
            View menu
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-sm font-semibold">{user.name}</p>

          <p className="mt-1 truncate text-xs text-white/50">{user.email}</p>
        </div>
      </aside>

      <div className="lg:pl-[240px]">
        {/* Header */}
        <header className="border-b border-[#e4ebe5] bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#73817b]">Side Kitchen Café</p>

              <p className="mt-1 text-base font-semibold">Admin dashboard</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-semibold text-[#08613f] sm:block">
                ADMIN
              </span>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logout.isPending}
                className="flex items-center gap-2 rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-50"
              >
                <LogOut size={16} />

                {logout.isPending ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          <nav
            aria-label="Mobile admin navigation"
            className="mt-4 flex gap-5 text-sm lg:hidden"
          >
            <Link href="/dashboard/admin">Dashboard</Link>

            <Link href="/dashboard/admin#orders">Orders</Link>

            <Link href="/foods">View menu</Link>
          </nav>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
