import WishlistsManagement from "@/components/admin/wishlists-management";

export const instant = false;

export default function AdminWishlistsPage() {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
          Restaurant operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#052b24]">
          Wishlist Management
        </h1>

        <p className="mt-2 text-sm text-[#73817b]">
          Review customer food requests, manage wishlist status and respond to
          customer preferences.
        </p>
      </div>

      <WishlistsManagement />
    </div>
  );
}
