"use client";
import Link from "next/link";
import { useGetMe } from "@/hooks/auth.hook";
import WishlistForm from "../form/wishlist-form";
// import WishlistForm from "@/components/form/wishlist-form";
export default function PublicWishlist() {
  const query = useGetMe();
  const user = query.data?.data;
  if (query.isPending) return <p>Loading...</p>;
  // Existing Auth middleware returns 400 when there is no access token.
  const error = query.error as {
    statusCode?: number;
    data?: { message?: string };
  } | null;
  const isGuest =
    error?.statusCode === 400 &&
    error.data?.message === "Access token not found.";
  if (query.isError && !isGuest)
    return (
      <div>
        <p>Unable to check your account.</p>
        <Link href="/login" className="mr-3 underline">
          Sign in
        </Link>
        <button className="underline" onClick={() => void query.refetch()}>
          Retry
        </button>
      </div>
    );
  if (user && user.role !== "CUSTOMER")
    return <p>Only customers can submit food requests.</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      {user && (
        <Link
          href="/customer/wishlist"
          className="text-sm text-[#08613f] underline"
        >
          View my food requests
        </Link>
      )}
      <WishlistForm user={user} />
    </div>
  );
}
