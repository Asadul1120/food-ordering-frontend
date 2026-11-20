
export type DiscountType =
  | "PERCENTAGE"
  | "FIXED"
  | "FREE_DELIVERY";

export interface Coupon {
  id: string;
  code: string;
  description: string | null;

  discountType: DiscountType;
  discountValue: string;

  minOrderAmount: string;
  maxDiscountAmount: string | null;

  usageLimit: number | null;
  perUserLimit: number | null;
  usedCount: number;

  startDate: string;
  expiryDate: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CouponValidationPayload {
  code: string;

  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountType: DiscountType;

  subtotal: string;
  discountAmount: string;
  deliveryCharge: string;
  totalAmount: string;
}
