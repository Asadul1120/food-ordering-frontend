"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import CartCouponForm from "@/components/form/cart-coupon-form";

import { useValidateCoupon } from "@/hooks/coupon.hook";

import { getErrorMessage } from "@/lib/utils";

import type { CartItem } from "@/hooks/cart.hook";
import type { CouponValidationResult } from "@/types/coupon.type";

type OrderSummaryProps = {
  subtotal: number;
  hasItems: boolean;
  items: CartItem[];
};

const FREE_DELIVERY_AMOUNT = 5000;
const DELIVERY_STARTING_PRICE = 60;

const COUPON_STORAGE_KEY = "freshlya-coupon";

export default function OrderSummary({
  subtotal,
  hasItems,
  items,
}: OrderSummaryProps) {
  const router = useRouter();

  const couponMutation = useValidateCoupon();

  const [appliedCoupon, setAppliedCoupon] =
    useState<CouponValidationResult | null>(null);

  const [checkingSavedCoupon, setCheckingSavedCoupon] = useState(false);

  // Prepare cart items for backend validation
  const couponItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    [items],
  );

  const validateCouponRequest = couponMutation.mutateAsync;

  // Validate saved coupon when cart changes or page opens
  useEffect(() => {
    const savedCode = sessionStorage.getItem(COUPON_STORAGE_KEY);

    if (!savedCode || items.length === 0) {
      if (items.length === 0) {
        sessionStorage.removeItem(COUPON_STORAGE_KEY);
      }

      setAppliedCoupon(null);
      setCheckingSavedCoupon(false);
      return;
    }

    let isCurrentRequest = true;

    setAppliedCoupon(null);
    setCheckingSavedCoupon(true);

    validateCouponRequest({
      code: savedCode,
      items: couponItems,
    })
      .then((result) => {
        if (!isCurrentRequest) return;

        setAppliedCoupon(result);
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;

        sessionStorage.removeItem(COUPON_STORAGE_KEY);

        setAppliedCoupon(null);

        toast.error(
          `Saved coupon is no longer valid: ${getErrorMessage(error)}`,
        );
      })
      .finally(() => {
        if (isCurrentRequest) {
          setCheckingSavedCoupon(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [items, couponItems, validateCouponRequest]);

  // Apply coupon
  const handleApplyCoupon = async (code: string) => {
    if (!hasItems) {
      toast.error("Add products to your cart before applying a coupon");
      return;
    }

    try {
      const result = await validateCouponRequest({
        code,
        items: couponItems,
      });

      // Save coupon for checkout
      sessionStorage.setItem(COUPON_STORAGE_KEY, result.code);

      setAppliedCoupon(result);

      toast.success(`Coupon ${result.code} applied successfully`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    sessionStorage.removeItem(COUPON_STORAGE_KEY);

    setAppliedCoupon(null);

    toast.info("Coupon removed");
  };

  // Free delivery progress
  const remaining = Math.max(0, FREE_DELIVERY_AMOUNT - subtotal);

  const progress = Math.min((subtotal / FREE_DELIVERY_AMOUNT) * 100, 100);

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-BD", {
      maximumFractionDigits: 2,
    });
  };

  // Backend-calculated totals
  const displaySubtotal = appliedCoupon
    ? Number(appliedCoupon.subtotal)
    : subtotal;

  const displayDelivery = appliedCoupon
    ? Number(appliedCoupon.deliveryCharge)
    : null;

  const displayTotal = appliedCoupon
    ? Number(appliedCoupon.totalAmount)
    : subtotal;

  const displayDiscount = appliedCoupon
    ? Number(appliedCoupon.discountAmount)
    : 0;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <aside className="rounded-[17px] border border-[#edf0ec] bg-white p-6 shadow-[0_1px_3px_rgba(15,45,30,0.10)]">
      <h2 className="text-[20px] font-semibold text-[#052b24]">
        Order Summary
      </h2>

      {/* Coupon Form */}
      <CartCouponForm
        onApply={handleApplyCoupon}
        onRemove={handleRemoveCoupon}
        appliedCode={appliedCoupon?.code ?? ""}
        isApplying={couponMutation.isPending || checkingSavedCoupon}
      />

      {/* Price Details */}
      <div className="mt-5 space-y-2 text-[14px]">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#73817b]">Subtotal</span>

          <span className="font-medium text-[#27342e]">
            ৳{formatPrice(displaySubtotal)}
          </span>
        </div>

        {/* Coupon Discount */}
        {appliedCoupon && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#08613f]">
              {appliedCoupon.discountType === "FREE_DELIVERY"
                ? "Free delivery coupon"
                : `Coupon (${appliedCoupon.code})`}
            </span>

            <span className="font-semibold text-[#08613f]">
              -৳{formatPrice(displayDiscount)}
            </span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#73817b]">Delivery</span>

          <span className="font-medium text-[#27342e]">
            {displayDelivery === null
              ? `from ৳${DELIVERY_STARTING_PRICE}`
              : appliedCoupon?.discountType === "FREE_DELIVERY"
                ? "Free"
                : `৳${formatPrice(displayDelivery)}`}
          </span>
        </div>
      </div>

      <div className="my-4 h-px bg-[#edf0ec]" />

      {/* Total */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[19px] font-semibold text-[#052b24]">Total</h3>

        <p className="text-right">
          <span className="text-[19px] font-semibold text-[#052b24]">
            ৳{formatPrice(displayTotal)}
          </span>

          {!appliedCoupon && (
            <span className="ml-1 text-[12px] text-[#73817b]">+ delivery</span>
          )}
        </p>
      </div>

      {/* Free Delivery Progress */}
      <div className="mt-4 rounded-[13px] bg-[#edf7f1] p-3">
        <p className="text-[14px] text-[#52645b]">
          {remaining > 0 ? (
            <>
              Add{" "}
              <span className="font-semibold text-[#00603f]">
                ৳{formatPrice(remaining)}
              </span>{" "}
              more for <span className="font-semibold">free delivery.</span>
            </>
          ) : (
            <span className="font-semibold text-[#00603f]">
              You have unlocked free delivery!
            </span>
          )}
        </p>

        <div
          role="progressbar"
          aria-label="Free delivery progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-[6px] overflow-hidden rounded-full bg-white"
        >
          <div
            className="h-full rounded-full bg-[#08613f] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        disabled={!hasItems || checkingSavedCoupon}
        onClick={handleCheckout}
        className="mt-6 flex h-[52px] w-full items-center justify-center rounded-full bg-[#ffcc00] text-[16px] font-semibold text-[#052b24] transition hover:bg-[#f2c200] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Proceed to Checkout
      </button>

      {/* Payment Information */}
      <p className="mt-4 text-center text-[12px] leading-5 text-[#73817b]">
        Pay with bKash, Nagad, card or Cash on Delivery
      </p>
    </aside>
  );
}
