
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

type CartCouponFormProps = {
  onApply: (code: string) => void;
  onRemove: () => void;
  appliedCode: string;
  isApplying: boolean;
};

export default function CartCouponForm({
  onApply,
  onRemove,
  appliedCode,
  isApplying,
}: CartCouponFormProps) {
  const [couponCode, setCouponCode] = useState("");

  // Update input when coupon is applied or removed
  useEffect(() => {
    setCouponCode(appliedCode);
  }, [appliedCode]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    onApply(code);
  };

  return (
    <div className="mt-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={couponCode}
          onChange={(event) =>
            setCouponCode(event.target.value.toUpperCase())
          }
          placeholder="Coupon code"
          aria-label="Coupon code"
          maxLength={50}
          disabled={isApplying}
          className="h-[42px] min-w-0 flex-1 rounded-[13px] border border-[#d5ddd8] bg-white px-4 text-[14px] text-[#052b24] outline-none placeholder:text-[#73817b] focus:border-[#08613f] disabled:bg-[#f4f6f3]"
        />

        <button
          type="submit"
          disabled={isApplying}
          className="h-[42px] w-[80px] shrink-0 rounded-full border border-[#d5ddd8] bg-white text-[14px] font-medium text-[#27342e] transition hover:border-[#08613f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isApplying ? "Checking..." : "Apply"}
        </button>
      </form>

      {/* Applied Coupon */}
      {appliedCode && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#edf7f1] px-3 py-2">
          <p className="min-w-0 truncate text-xs font-semibold text-[#08613f]">
            Applied: {appliedCode}
          </p>

          <button
            type="button"
            onClick={onRemove}
            disabled={isApplying}
            className="shrink-0 text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
