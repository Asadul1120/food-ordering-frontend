"use client";
import { useState } from "react";
import { useGetMe } from "@/hooks/auth.hook";
// import { useMyWishlists } from "@/hooks/customer.hook";
// import WishlistForm from "@/components/form/wishlist-form";
// import { formatCustomerDate } from "@/lib/customer";
import { getErrorMessage } from "@/lib/utils";
import { useMyWishlists } from "@/hooks/customer.hook";
import WishlistForm from "../form/wishlist-form";
import { formatCustomerDate } from "@/lib/customer";
export default function CustomerWishlist() {
  const user = useGetMe().data?.data;
  const [page, setPage] = useState(1);
  const query = useMyWishlists(
    user?.role === "CUSTOMER" ? user.id : "",
    page,
    10,
  );
  if (!user) return null;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <WishlistForm user={user} />
      <h2 className="text-lg font-bold">My food requests</h2>
      {query.isPending && <p>Loading requests...</p>}
      {query.isError && (
        <p role="alert">
          {getErrorMessage(query.error)}{" "}
          <button onClick={() => void query.refetch()} className="underline">
            Retry
          </button>
        </p>
      )}
      {query.data?.data?.wishlists.map((wish) => (
        <article
          key={wish.id}
          className="space-y-2 rounded-[17px] border border-[#edf0ec] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap justify-between gap-2">
            <h3 className="font-bold">{wish.foodName}</h3>
            <span className="rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-semibold text-[#08613f]">
              {wish.status}
            </span>
          </div>
          <p className="text-sm">{wish.foodDescription}</p>
          <p className="text-sm text-[#66716d]">
            Expected: {formatCustomerDate(wish.expectedTime)}
          </p>
          {wish.adminNote && <p className="text-sm">Admin: {wish.adminNote}</p>}
        </article>
      ))}
      {query.data?.data?.wishlists.length === 0 && (
        <p className="rounded-xl bg-white p-5">No food requests yet.</p>
      )}
      {query.data?.data && (
        <div className="flex items-center justify-between text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full border bg-white px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={page >= query.data.data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full border bg-white px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
