"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ClipboardList,
  Heart,
  MapPin,
  UserRound,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import type { ReactNode } from "react";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { getErrorMessage, roleRoutes } from "@/lib/utils";
import FoodCategoryNav from "@/components/share/FoodCategoryNav";

const customerLinks = [
  { href: "/customer", label: "Dashboard", icon: Home },
  { href: "/customer/orders", label: "My Orders", icon: ClipboardList },
  { href: "/customer/wishlist", label: "Wishlist", icon: Heart },
  { href: "/customer/addresses", label: "Addresses", icon: MapPin },
  { href: "/customer/profile", label: "Profile", icon: UserRound },
];

export default function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const userQuery = useGetMe();
  const logout = useLogout();
  const user = userQuery.data?.data;

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (userQuery.isPending)
    return (
      <div role="status" className="p-12 text-center text-[#08613f]">
        Checking customer access...
      </div>
    );
  if (userQuery.isError || !user || !user.isActive)
    return (
      <div className="p-12 text-center text-[#052b24]">
        <p>Please sign in to access your account.</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-full bg-[#08613f] px-6 py-3 text-white"
        >
          Sign in
        </Link>
        <button
          onClick={() => void userQuery.refetch()}
          className="ml-3 underline"
        >
          Retry
        </button>
      </div>
    );
  if (user.role !== "CUSTOMER")
    return (
      <div className="p-12 text-center">
        <Link href={roleRoutes(user.role)} className="underline">
          Go to your dashboard
        </Link>
      </div>
    );

  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "U";
  return (
    <div className="min-h-screen bg-[#f8f6ee] font-sans text-[#102923]">
      <FoodCategoryNav  />
      <nav className="flex justify-between border-b border-[#dce8e0] bg-white px-4 py-3 text-sm lg:hidden">
        <Link href="/foods">Full Menu</Link>
        <Link href="/track-order">Track Order</Link>
      </nav>
      <div className="mx-auto grid max-w-[1248px] gap-6 px-4 py-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
        <aside className="min-w-0 space-y-3">
          {/* Customer information */}
          <div className="flex min-h-[76px] items-center gap-3 rounded-[16px] bg-[#042016] p-4 text-white">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffda36] text-base font-bold text-[#042016]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold">{user.name}</p>
              <p className="truncate text-xs text-[#d0ded7]">{user.email}</p>
            </div>
          </div>
          <nav
            aria-label="Customer navigation"
            className="rounded-[17px] border border-[#e9ede8] bg-white p-2 shadow-[0_1px_2px_rgba(15,45,30,0.10)]"
          >
            <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
              {customerLinks.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/customer" && pathname.startsWith(`${href}/`));
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-10 items-center gap-3 rounded-[12px] px-3 text-[14px] ${active ? "bg-[#eaf5ee] font-semibold text-[#075638]" : "hover:bg-[#f5f8f6]"}`}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="my-2 border-t border-[#edf0ec]" />
            <button
              type="button"
              disabled={logout.isPending}
              onClick={handleLogout}
              className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-[14px] text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut size={18} />
              {logout.isPending ? "Signing out..." : "Sign out"}
            </button>
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
