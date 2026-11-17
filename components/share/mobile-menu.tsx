"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  ChevronRight,
  Heart,
  LogOut,
  MessageSquare,
  ShoppingCart,
  Smartphone,
  Truck,
  User,
  LayoutDashboard,
  Utensils,
  X,
} from "lucide-react";

import { toast } from "sonner";

import Logo from "./logo";

import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { useCategories } from "@/hooks/category.hook";

import { getErrorMessage, roleRoutes } from "@/lib/utils";
import type { ApiResponse, AuthUser } from "@/types/auth.type";

type MobileMenuProps = {
  onClose: () => void;
};

// Restaurant hours in Bangladesh
function getShopStatus() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Dhaka",
    }).format(new Date()),
  );

  if (hour >= 15 && hour < 23) {
    return {
      open: true,
      text: "Open now · until 11 PM",
    };
  }

  return {
    open: false,
    text:
      hour < 15
        ? "Closed · pre-order for 3 PM today"
        : "Closed · pre-order for 3 PM tomorrow",
  };
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { data } = useGetMe();
  const logoutMutation = useLogout();
  const categoriesQuery = useCategories();

  const user = (data as ApiResponse<AuthUser> | undefined)?.data;

  const categories = (categoriesQuery.data?.data ?? []).filter(
    (category) => category.isActive,
  );

  const [shopStatus, setShopStatus] = useState({
    open: false,
    text: "Open daily · 3 PM–11 PM",
  });

  const dashboardRoute = user ? roleRoutes(user.role) : "/";

  const dashboardPath = dashboardRoute.startsWith("/")
    ? dashboardRoute
    : `/${dashboardRoute}`;

  // Lock page scrolling while menu is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Update the restaurant status on the client
  useEffect(() => {
    const updateStatus = () => {
      setShopStatus(getShopStatus());
    };

    updateStatus();

    const interval = window.setInterval(updateStatus, 60000);

    return () => window.clearInterval(interval);
  }, []);

  // Logout user
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      onClose();
      toast.success("Logged out successfully");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Dark Overlay */}
      <button
        type="button"
        aria-label="Close mobile menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/60"
      />

      {/* Left Side Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="relative z-10 flex h-[100dvh] w-[86%] max-w-[420px] flex-col overflow-hidden bg-[#faf7f0] shadow-xl"
      >
        {/* Dark Green Top */}
        <div className="shrink-0 bg-[#031f14] px-5 pb-6 pt-6 text-white">
          {/* Logo, Language, Close */}
          <div className="flex items-center justify-between gap-3">
            <Logo />

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-full bg-[#1b352b] px-4 text-[14px] font-semibold"
              >
                বাংলা
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b352b]"
              >
                <X size={23} />
              </button>
            </div>
          </div>

          {/* Restaurant Status */}
          <div className="mt-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#1b352b] px-3 py-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  shopStatus.open ? "bg-[#42d98a]" : "bg-[#f46a6a]"
                }`}
              />

              <p className="text-[12px] leading-4 text-white">
                {shopStatus.text}
              </p>
            </div>
          </div>

          {/* Guest Account Buttons */}
          {!user ? (
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex min-h-[61px] items-center justify-center rounded-full bg-[#ffcc00] px-3 text-center text-[16px] font-medium text-[#052b24]"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                onClick={onClose}
                className="flex min-h-[61px] items-center justify-center rounded-full border border-[#426153] px-3 text-center text-[16px] font-medium leading-5 text-white"
              >
                Create
                <br />
                account
              </Link>
            </div>
          ) : (
            /* Logged-in Account */
            <div className="mt-5">
              <p className="truncate text-[16px] font-semibold">{user.name}</p>

              <p className="mt-1 truncate text-[12px] text-gray-300">
                {user.email}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#ffcc00] px-2 text-[13px] font-semibold text-[#052b24]"
                >
                  <User size={16} />
                  My Profile
                </Link>

                <Link
                  href={dashboardPath}
                  onClick={onClose}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#426153] px-2 text-[13px] font-semibold"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="mt-3 flex items-center gap-2 text-[13px] font-medium text-red-300 disabled:opacity-50"
              >
                <LogOut size={16} />

                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Cream Menu Area */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#faf7f0] px-4 py-5 text-[#052b24]">
          {/* Full Menu */}
          <Link
            href="/foods"
            onClick={onClose}
            className="flex min-h-[66px] items-center gap-3 rounded-[18px] bg-[#08613f] px-5 text-[19px] font-semibold text-white shadow-sm"
          >
            <Utensils size={24} />

            <span className="flex-1">Full Menu</span>

            <ChevronRight size={23} />
          </Link>

          {/* Categories */}
          <section className="mt-6">
            <h2 className="mb-3 px-1 text-[13px] font-semibold tracking-[1.5px] text-[#6d756f]">
              CATEGORIES
            </h2>

            <div className="overflow-hidden rounded-[20px] border border-[#edf0ec] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.10)]">
              {categoriesQuery.isPending ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-[54px] animate-pulse rounded-xl bg-[#edf7f1]"
                    />
                  ))}
                </div>
              ) : categoriesQuery.isError ? (
                <div className="p-4 text-[13px]">
                  <p>Categories could not be loaded.</p>

                  <button
                    type="button"
                    onClick={() => void categoriesQuery.refetch()}
                    className="mt-2 font-semibold text-[#08613f] underline"
                  >
                    Try again
                  </button>
                </div>
              ) : categories.length === 0 ? (
                <p className="p-4 text-[13px] text-[#73817b]">
                  No categories available.
                </p>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/foods?categoryId=${encodeURIComponent(category.id)}`}
                    onClick={onClose}
                    className="flex min-h-[73px] items-center gap-4 border-b border-[#edf0ec] px-4 py-3 last:border-b-0"
                  >
                    {/* Category Image */}
                    <div className="relative flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#edf7f1]">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[22px] font-bold text-[#08613f]">
                          {category.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <span className="min-w-0 flex-1 text-[17px] font-medium leading-6">
                      {category.name}
                    </span>

                    <ChevronRight
                      size={19}
                      className="shrink-0 text-[#cbd2ce]"
                    />
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Help Section */}
          <section className="mt-6 pb-5">
            <h2 className="mb-3 px-1 text-[13px] font-semibold tracking-[1.5px] text-[#6d756f]">
              HELP
            </h2>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/track-order"
                onClick={onClose}
                className="flex min-h-[55px] items-center gap-2 rounded-[18px] border border-[#edf0ec] bg-white px-3 shadow-sm"
              >
                <Truck size={21} className="shrink-0 text-[#08613f]" />
                <span className="text-[14px] font-medium">Track order</span>
              </Link>

              <Link
                href="/contact"
                onClick={onClose}
                className="flex min-h-[55px] items-center gap-2 rounded-[18px] border border-[#edf0ec] bg-white px-3 shadow-sm"
              >
                <MessageSquare size={20} className="shrink-0 text-[#08613f]" />
                <span className="text-[14px] font-medium">Contact us</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex min-h-[55px] items-center gap-2 rounded-[18px] border border-[#edf0ec] bg-white px-3 shadow-sm"
              >
                <Heart size={21} className="shrink-0 text-[#08613f]" />
                <span className="text-[14px] font-medium">Wishlist</span>
              </Link>

              <Link
                href="/cart"
                onClick={onClose}
                className="flex min-h-[55px] items-center gap-2 rounded-[18px] border border-[#edf0ec] bg-white px-3 shadow-sm"
              >
                <ShoppingCart size={21} className="shrink-0 text-[#08613f]" />
                <span className="text-[14px] font-medium">Your cart</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="shrink-0 border-t border-[#edf0ec] bg-white px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-4">
          {/* Install App Display */}
          <div className="flex h-[46px] items-center justify-center gap-2 rounded-full border border-[#d5e8dd] bg-[#edf7f1] text-[14px] font-medium text-[#052b24]">
            <Smartphone size={17} />
            Install the Freshlya app
          </div>

          {/* Call and WhatsApp */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href="tel:+8809658788505"
              className="flex h-[46px] items-center justify-center rounded-full bg-[#08613f] text-[16px] font-semibold text-white"
            >
              Call us
            </a>

            <a
              href="https://wa.me/8801904070111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[46px] items-center justify-center rounded-full bg-[#20ce68] text-[16px] font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
