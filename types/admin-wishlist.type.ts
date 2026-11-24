import type { Wishlist } from "@/types/customer.type";

export type WishlistStatus = Wishlist["status"];

export interface AdminWishlist extends Wishlist {
  userId: string | null;

  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  customerAddress: string | null;

  currentProfileAddress?: string | null;

  updatedAt: string;
}

export interface AdminWishlistQuery {
  page: number;
  limit: number;
  search?: string;
  status?: WishlistStatus;
}

export interface AdminWishlistList {
  wishlists: AdminWishlist[];

  pagination: {
    totalWishlists: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface UpdateWishlistStatusPayload {
  id: string;

  body: {
    status: WishlistStatus;
    adminNote?: string;
  };
}
