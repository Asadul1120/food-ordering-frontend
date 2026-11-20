
import type { Coupon, DiscountType } from "@/types/coupon.type";

export interface AdminCouponQuery {
  page: number;
  limit: number;
  search?: string;
  discountType?: DiscountType;
  isActive?: boolean;
}

export interface AdminCouponList {
  coupons: Coupon[];

  pagination: {
    totalCoupons: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface CreateCouponPayload {
  code: string;
  description?: string | null;

  discountType: DiscountType;
  discountValue: string;

  minOrderAmount?: string;
  maxDiscountAmount?: string | null;

  usageLimit?: number | null;
  perUserLimit?: number | null;

  startDate: string;
  expiryDate: string;

  isActive?: boolean;
}

export type UpdateCouponPayload = Partial<
  Omit<CreateCouponPayload, "isActive">
>;

export interface UpdateAdminCouponPayload {
  id: string;
  body: UpdateCouponPayload;
}

export interface UpdateAdminCouponStatusPayload {
  id: string;
  isActive: boolean;
}
