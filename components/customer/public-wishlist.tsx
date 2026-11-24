"use client";

import Link from "next/link";
import { Heart, RefreshCw } from "lucide-react";

import { useGetMe } from "@/hooks/auth.hook";
import WishlistForm from "@/components/form/wishlist-form";

export default function PublicWishlist() {
  const userQuery = useGetMe();

  const user = userQuery.data?.data;

  // Check guest user
  const error = userQuery.error as {
    statusCode?: number;
    data?: {
      message?: string;
    };
  } | null;

  const isGuest =
    error?.statusCode === 400 &&
    error.data?.message === "Access token not found.";

  // Loading state
  if (userQuery.isPending) {
    return (
      <div className="py-12 text-center">
        <RefreshCw
          size={25}
          className="mx-auto mb-3 animate-spin text-[#08613f]"
        />

        <p className="text-sm text-[#73817b]">Loading wishlist...</p>
      </div>
    );
  }

  // Handle authentication or server errors
  if (userQuery.isError && !isGuest) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center">
        <p className="text-sm text-red-500">Unable to check your account.</p>

        <div className="mt-4 flex justify-center gap-3">
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
    );
  }

  // Only customer can create wishlist
  if (!userQuery.isError && user && user.role !== "CUSTOMER") {
    return (
      <p className="rounded-xl bg-white p-6 text-center">
        Only customers can submit food requests.
      </p>
    );
  }

  const customer = isGuest ? undefined : user;

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f2ea] text-[#08613f]">
          <Heart size={26} />
        </div>

        <h1 className="text-3xl font-bold">Your Food Wishlist</h1>

        <p className="mt-3 text-sm leading-6 text-[#73817b]">
          Can't find the food you are looking for? Tell us what you would like
          to eat and we will review your request.
        </p>
      </div>

      {/* Guest Customer Message */}
      {!customer && (
        <div className="rounded-xl border border-[#d5e8dd] bg-[#edf7f1] p-4">
          <p className="text-sm font-semibold">Already have an account?</p>

          <p className="mt-1 text-xs leading-5 text-[#66716d]">
            Sign in to submit your wishlist without entering your personal
            information again.
          </p>

          <Link
            href="/login"
            className="mt-3 inline-block text-sm font-semibold text-[#08613f] underline"
          >
            Sign in to your account
          </Link>

          <p className="mt-3 text-xs text-[#73817b]">
            Or continue below as a guest.
          </p>
        </div>
      )}

      {/* Registered Customer Message */}
      {customer && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#edf7f1] p-4">
          <p className="text-sm font-medium">Welcome, {customer.name}</p>

          <Link
            href="/customer/wishlist"
            className="text-sm font-semibold text-[#08613f] underline"
          >
            View my requests
          </Link>
        </div>
      )}

      {/* Reusable Wishlist Form */}
      <WishlistForm user={customer} />
    </div>
  );
}
