
import { z } from "zod";

const amountPattern = /^\d{1,8}(\.\d{1,2})?$/;

export const adminCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Coupon code is required")
      .max(50, "Coupon code cannot exceed 50 characters"),

    description: z.string().max(
      1000,
      "Description is too long",
    ),

    discountType: z.enum([
      "PERCENTAGE",
      "FIXED",
      "FREE_DELIVERY",
    ]),

    discountValue: z
      .string()
      .regex(
        amountPattern,
        "Enter a valid amount with up to 2 decimals",
      ),

    minOrderAmount: z
      .string()
      .regex(
        amountPattern,
        "Enter a valid minimum order amount",
      ),

    maxDiscountAmount: z.string().refine(
      (value) => value === "" || amountPattern.test(value),
      "Enter a valid maximum discount amount",
    ),

    usageLimit: z.string().refine(
      (value) =>
        value === "" ||
        (/^\d+$/.test(value) &&
          Number(value) >= 1 &&
          Number(value) <= 2147483647),
      "Usage limit must be between 1 and 2147483647",
    ),

    perUserLimit: z.string().refine(
      (value) =>
        value === "" ||
        (/^\d+$/.test(value) &&
          Number(value) >= 1 &&
          Number(value) <= 2147483647),
      "Per-user limit must be between 1 and 2147483647",
    ),

    startDate: z.string().min(1, "Start date is required"),

    expiryDate: z.string().min(1, "Expiry date is required"),

    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    const discountValue = Number(values.discountValue);

    // Free delivery must have a value of zero
    if (values.discountType === "FREE_DELIVERY") {
      if (discountValue !== 0) {
        context.addIssue({
          code: "custom",
          path: ["discountValue"],
          message: "Free delivery requires a discount value of 0",
        });
      }
    } else if (discountValue <= 0) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Discount value must be greater than 0",
      });
    }

    // Percentage cannot exceed 100
    if (
      values.discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage cannot exceed 100",
      });
    }

    // Maximum discount is only for percentage coupons
    if (values.maxDiscountAmount !== "") {
      if (values.discountType !== "PERCENTAGE") {
        context.addIssue({
          code: "custom",
          path: ["maxDiscountAmount"],
          message:
            "Maximum discount is only available for percentage coupons",
        });
      } else if (Number(values.maxDiscountAmount) <= 0) {
        context.addIssue({
          code: "custom",
          path: ["maxDiscountAmount"],
          message: "Maximum discount must be greater than 0",
        });
      }
    }

    // Expiry date must be after start date
    const startTime = new Date(values.startDate).getTime();
    const expiryTime = new Date(values.expiryDate).getTime();

    if (
      !Number.isFinite(startTime) ||
      !Number.isFinite(expiryTime)
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Please enter valid dates",
      });
    } else if (expiryTime <= startTime) {
      context.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Expiry date must be after the start date",
      });
    }
  });

export type AdminCouponFormValues = z.infer<
  typeof adminCouponSchema
>;
