import Link from "next/link";

import OrderTracking from "@/components/order/order-tracking";
import FoodCategoryNav from "@/components/share/FoodCategoryNav";

export const instant = false;

export default function TrackOrderPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#faf7f0] text-[#052b24]">
      {/* Top Navigation */}
         
         <FoodCategoryNav />

      {/* Page Heading */}
      <section className="border-b border-[#dce8e0] bg-[#edf7f1]">
        <div className="mx-auto flex h-[99px] max-w-[1210px] flex-col justify-center px-4">
          <h1 className="text-[28px] font-bold leading-[34px] tracking-tight text-[#052b24]">
            Track Your Order
          </h1>

          <p className="mt-0.5 text-[14px] leading-5 text-[#73817b]">
            See where your food is — no account needed.
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <main className="flex min-h-[480px] flex-1 items-start justify-center bg-[#faf7f0] px-4 pb-20 pt-10">
        <OrderTracking />
      </main>

      {/* Existing Website Footer */}
    </div>
  );
}
