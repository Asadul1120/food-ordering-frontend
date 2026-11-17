"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { getErrorMessage, roleRoutes } from "@/lib/utils";
import type { ApiResponse, AuthUser } from "@/types/auth.type";

type HeaderAccountProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function HeaderAccount({
  mobile = false,
  onNavigate,
}: HeaderAccountProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { data, isPending } = useGetMe();
  const logoutMutation = useLogout();

  // Backend response: { success, message, data: user }
  const response = data as ApiResponse<AuthUser> | undefined;
  const user = response?.data;

  const dashboardPath = user ? roleRoutes(user.role) : "/";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      setIsOpen(false);
      onNavigate?.();

      toast.success("Logged out successfully");

      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Loading state
  if (isPending) {
    return (
      <div
        aria-label="Loading account"
        className="flex h-5 w-5 animate-pulse rounded-full bg-[#294236]"
      />
    );
  }

  // Guest user
  if (!user) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center gap-2 text-sm font-semibold hover:text-yellow-400"
      >
        <User size={20} strokeWidth={2} />

        <span className={mobile ? "" : "hidden sm:inline"}>Sign in</span>
      </Link>
    );
  }

  // Mobile account options
  if (mobile) {
    return (
      <div className="space-y-1">
        <div className="mb-3 border-b border-[#294236] pb-3">
          <p className="text-sm font-semibold text-white">{user.name}</p>

          <p className="mt-1 text-xs text-gray-400">{user.email}</p>
        </div>

        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#18382b]"
        >
          <User size={18} />
          My Profile
        </Link>

        <Link
          href={dashboardPath}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#18382b]"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <button
          type="button"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-red-400 hover:bg-[#18382b] disabled:opacity-50"
        >
          <LogOut size={18} />

          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold hover:text-yellow-400"
      >
        <User size={20} strokeWidth={2} />

        <span className="hidden max-w-[100px] truncate sm:inline">
          {user.name}
        </span>

        <ChevronDown
          size={15}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Click outside to close */}
          <button
            type="button"
            aria-label="Close account menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute right-0 top-full z-50 mt-4 w-[250px] overflow-hidden rounded-[14px] border border-[#e5eae6] bg-white py-2 text-[#052b24] shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
            {/* User Information */}
            <div className="border-b border-[#edf0ec] px-4 py-3">
              <p className="truncate text-[14px] font-semibold">{user.name}</p>

              <p className="mt-1 truncate text-[12px] text-[#73817b]">
                {user.email}
              </p>

              <span className="mt-2 inline-block rounded-full bg-[#edf7f1] px-2 py-1 text-[10px] font-semibold text-[#08613f]">
                {user.role}
              </span>
            </div>

            {/* Profile */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#edf7f1]"
            >
              <User size={17} />
              My Profile
            </Link>

            {/* Dashboard */}
            <Link
              href={dashboardPath}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#edf7f1]"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <div className="my-1 border-t border-[#edf0ec]" />

            {/* Logout */}
            <button
              type="button"
              disabled={logoutMutation.isPending}
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut size={17} />

              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

