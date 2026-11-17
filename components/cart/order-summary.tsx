"use client";

import { toast } from "sonner";

import CartCouponForm from "@/components/form/cart-coupon-form";
import { useRouter } from "next/navigation";

type OrderSummaryProps = {
  subtotal: number;
  hasItems: boolean;
};

// Screenshot-এর display values
const FREE_DELIVERY_AMOUNT = 5000;
const DELIVERY_STARTING_PRICE = 60;

export default function OrderSummary({
  subtotal,
  hasItems,
}: OrderSummaryProps) {
  // Free delivery পেতে আরও কত টাকা লাগবে
  const remaining = Math.max(0, FREE_DELIVERY_AMOUNT - subtotal);

  // Progress bar percentage
  const progress = Math.min((subtotal / FREE_DELIVERY_AMOUNT) * 100, 100);

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-BD", {
      maximumFractionDigits: 2,
    });
  };

  // Coupon এখন সংরক্ষিত হবে, checkout-এ validate করতে হবে
  const handleApplyCoupon = (code: string) => {
    sessionStorage.setItem("freshlya-coupon", code);

    toast.info("Coupon saved. It will be checked at checkout.");
  };
  const router = useRouter();
  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <aside className="rounded-[17px] border border-[#edf0ec] bg-white p-6 shadow-[0_1px_3px_rgba(15,45,30,0.10)]">
      <h2 className="text-[20px] font-semibold text-[#052b24]">
        Order Summary
      </h2>

      {/* Coupon Form */}
      <CartCouponForm onApply={handleApplyCoupon} />

      {/* Subtotal and Delivery */}
      <div className="mt-5 space-y-2 text-[14px]">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#73817b]">Subtotal</span>

          <span className="font-medium text-[#27342e]">
            ৳{formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[#73817b]">Delivery</span>

          <span className="font-medium text-[#27342e]">
            from ৳{DELIVERY_STARTING_PRICE}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-[#edf0ec]" />

      {/* Total */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[19px] font-semibold text-[#052b24]">Total</h3>

        <p className="text-right">
          <span className="text-[19px] font-semibold text-[#052b24]">
            ৳{formatPrice(subtotal)}
          </span>

          <span className="ml-1 text-[12px] text-[#73817b]">+ delivery</span>
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
        disabled={!hasItems}
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
