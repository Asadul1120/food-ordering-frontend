"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  Package,
  ExternalLink,
  LogOut,
  ShieldCheck,
  FolderTree,
  Users,
  Tag,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { getErrorMessage } from "@/lib/utils";

const adminLinks = [
  {
    href: "/dashboard/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/admin/orders",
    label: "Manage orders",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/admin/users",
    label: "Manage users",
    icon: Users,
  },
  {
    href: "/dashboard/admin/products",
    label: "Manage products",
    icon: Package,
  },
  {
    href: "/dashboard/admin/categories",
    label: "Manage categories",
    icon: FolderTree,
  },
  {
    href: "/dashboard/admin/coupons",
    label: "Manage coupons",
    icon: Tag,
  },
  {
    href: "/dashboard/admin/wishlists",
    label: "Manage wishlist",
    icon: Heart,
  },
  {
    href: "/foods",
    label: "View menu",
    icon: ExternalLink,
  },
] as const;

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  const userQuery = useGetMe();
  const logout = useLogout();

  const user = userQuery.data?.data;

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard/admin") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();

      setMobileOpen(false);
      router.replace("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Close mobile drawer after navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  // Session loading
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

  // User is not authenticated
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

  // Admin role protection
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
      {/* ===================================== */}
      {/* DESKTOP SIDEBAR - ORIGINAL DESIGN */}
      {/* ===================================== */}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col bg-[#031f14] px-5 py-7 text-white lg:flex">
        <Link href="/dashboard/admin" className="text-2xl font-bold">
          Side Kitchen
          <span className="text-[#ffcc00]">.</span>
        </Link>

        <p className="mt-1 text-xs tracking-[2px] text-white/50">
          ADMIN WORKSPACE
        </p>

        <nav aria-label="Admin navigation" className="mt-10 space-y-2">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-[#ffcc00] font-semibold text-[#052b24]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-sm font-semibold">{user.name}</p>

          <p className="mt-1 truncate text-xs text-white/50">{user.email}</p>
        </div>
      </aside>

      {/* ===================================== */}
      {/* MOBILE SIDEBAR OVERLAY */}
      {/* ===================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-[#071b15]/55 lg:hidden"
        />
      )}

      {/* ===================================== */}
      {/* MOBILE SLIDE-IN SIDEBAR */}
      {/* ===================================== */}

      <aside
        id="admin-mobile-navigation"
        aria-label="Mobile admin sidebar"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-[70] flex w-[280px] max-w-[85vw] flex-col bg-[#031f14] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand */}
        <div className="flex h-[78px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/dashboard/admin"
            onClick={() => setMobileOpen(false)}
            className="min-w-0"
          >
            <p className="text-2xl font-bold text-white">
              Side Kitchen
              <span className="text-[#ffcc00]">.</span>
            </p>

            <p className="mt-1 text-[10px] tracking-[2px] text-white/50">
              ADMIN WORKSPACE
            </p>
          </Link>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[1.5px] text-white/50">
            Menu
          </p>

          <nav aria-label="Mobile admin navigation" className="space-y-2">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[46px] items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                    active
                      ? "bg-[#ffcc00] font-semibold text-[#052b24]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile */}
        <div className="shrink-0 border-t border-white/10 p-5">
          <p className="truncate text-sm font-semibold text-white">
            {user.name}
          </p>

          <p className="mt-1 truncate text-xs text-white/50">{user.email}</p>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={logout.isPending}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <LogOut size={16} />
            {logout.isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ===================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ===================================== */}

      <div className="min-w-0 lg:pl-[240px]">
        {/* MOBILE HEADER - NEW DESIGN */}

        {/* MOBILE HEADER */}
        <header className="sticky top-0 z-40 flex h-[64px] items-center gap-3 border-b border-[#e4ebe5] bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-navigation"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#052b24] transition-colors hover:bg-[#edf7f1]"
          >
            <Menu size={23} strokeWidth={1.9} />
          </button>

          <Link
            href="/dashboard/admin"
            className="truncate text-base font-bold text-[#052b24]"
          >
            Side Kitchen Dashboard
          </Link>
        </header>

        {/* DESKTOP HEADER - ORIGINAL DESIGN */}
        <header className="hidden border-b border-[#e4ebe5] bg-white px-8 py-4 lg:block">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#73817b]">Side Kitchen Café</p>

              <p className="mt-1 text-base font-semibold">Admin dashboard</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-semibold text-[#08613f]">
                ADMIN
              </span>

              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={logout.isPending}
                className="flex items-center gap-2 rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-50"
              >
                <LogOut size={16} />

                {logout.isPending ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT - UNCHANGED */}
        <main className="mx-auto max-w-[1500px] p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
