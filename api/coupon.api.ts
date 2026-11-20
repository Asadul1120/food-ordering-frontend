
import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";

import type {
  CouponValidationPayload,
  CouponValidationResult,
} from "@/types/coupon.type";

// Validate a coupon before checkout
export const validateCoupon = async (
  body: CouponValidationPayload,
) => {
  const response = await apiClient<
    ApiResponse<CouponValidationResult>
  >("/api/v1/coupons/validate", {
    method: "POST",
    body,
  });

  if (!response.data) {
    throw new Error("Coupon validation data is unavailable");
  }

  return response.data;
};
