import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";

import type {
  AdminWishlist,
  AdminWishlistList,
  AdminWishlistQuery,
  UpdateWishlistStatusPayload,
} from "@/types/admin-wishlist.type";

// Get all wishlists
export const getAdminWishlists = async (
  query: AdminWishlistQuery,
  signal?: AbortSignal,
) => {
  const response = await apiClient<ApiResponse<AdminWishlistList>>(
    "/api/v1/wishlists",
    {
      method: "GET",
      query,
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Wishlist data is unavailable");
  }

  return response.data;
};

// Get single wishlist
export const getAdminWishlist = async (id: string, signal?: AbortSignal) => {
  const response = await apiClient<ApiResponse<AdminWishlist>>(
    `/api/v1/wishlists/${encodeURIComponent(id)}`,
    {
      method: "GET",
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Wishlist details are unavailable");
  }

  return response.data;
};

// Update wishlist status
export const updateAdminWishlistStatus = ({
  id,
  body,
}: UpdateWishlistStatusPayload) => {
  return apiClient<ApiResponse<AdminWishlist>>(
    `/api/v1/wishlists/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body,
    },
  );
};

// Delete wishlist
export const deleteAdminWishlist = (id: string) => {
  return apiClient<ApiResponse<{ id: string }>>(
    `/api/v1/wishlists/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
};
