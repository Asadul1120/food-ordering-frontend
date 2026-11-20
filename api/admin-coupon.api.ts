
import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";
import type { Coupon } from "@/types/coupon.type";

import type {
  AdminCouponList,
  AdminCouponQuery,
  CreateCouponPayload,
  UpdateAdminCouponPayload,
  UpdateAdminCouponStatusPayload,
} from "@/types/admin-coupon.type";

// Get all coupons with search, filter and pagination
export const getAdminCoupons = async (
  query: AdminCouponQuery,
  signal?: AbortSignal,
) => {
  const response = await apiClient<ApiResponse<AdminCouponList>>(
    "/api/v1/coupons",
    {
      method: "GET",
      query,
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Coupon data is unavailable");
  }

  return response.data;
};

// Get a single coupon
export const getAdminCoupon = async (
  id: string,
  signal?: AbortSignal,
) => {
  const response = await apiClient<ApiResponse<Coupon>>(
    `/api/v1/coupons/${encodeURIComponent(id)}`,
    {
      method: "GET",
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Coupon details are unavailable");
  }

  return response.data;
};

// Create coupon
export const createAdminCoupon = (
  body: CreateCouponPayload,
) => {
  return apiClient<ApiResponse<Coupon>>("/api/v1/coupons", {
    method: "POST",
    body,
  });
};

// Update coupon information
export const updateAdminCoupon = ({
  id,
  body,
}: UpdateAdminCouponPayload) => {
  return apiClient<ApiResponse<Coupon>>(
    `/api/v1/coupons/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body,
    },
  );
};

// Activate or deactivate coupon
export const updateAdminCouponStatus = ({
  id,
  isActive,
}: UpdateAdminCouponStatusPayload) => {
  return apiClient<ApiResponse<Coupon>>(
    `/api/v1/coupons/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { isActive },
    },
  );
};

// Delete coupon
export const deleteAdminCoupon = (id: string) => {
  return apiClient<ApiResponse>(
    `/api/v1/coupons/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
};
