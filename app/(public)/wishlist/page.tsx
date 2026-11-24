import PublicWishlist from "@/components/customer/public-wishlist";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#f8f6ee] px-4 py-10 text-[#052b24]">
      <div className="mx-auto max-w-2xl">
        <PublicWishlist />
      </div>
    </div>
  );
}