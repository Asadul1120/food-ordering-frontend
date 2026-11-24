import apiClient from "@/lib/apiClient";
import type { ApiResponse, AuthUser } from "@/types/auth.type";
import type {
  CustomerOrder,
  MyOrdersQuery,
  MyOrdersResponse,
  MyWishlistsResponse,
  ProfilePayload,
  Wishlist,
  WishlistPayload,
} from "@/types/customer.type";

export const getMyOrders = (query: MyOrdersQuery) => {
  return apiClient<ApiResponse<MyOrdersResponse>>("/api/v1/orders/my-orders", {
    method: "GET",
    query,
  });
};
export const getMyWishlists = (page = 1, limit = 10) => {
  return apiClient<ApiResponse<MyWishlistsResponse>>(
    "/api/v1/wishlists/my-wishlists",
    { method: "GET", query: { page, limit } },
  );
};
export const createWishlist = (payload: WishlistPayload) => {
  return apiClient<ApiResponse<Wishlist>>("/api/v1/wishlists", {
    method: "POST",
    body: payload,
  });
};
export const updateMyProfile = (payload: ProfilePayload) => {
  return apiClient<ApiResponse<AuthUser>>("/api/v1/users/me", {
    method: "PATCH",
    body: payload,
  });
};

export const getMyOrderById = (id: string) => {
  return apiClient<ApiResponse<CustomerOrder>>(
    `/api/v1/orders/my-orders/${encodeURIComponent(id)}`,
    { method: "GET" },
  );
};
