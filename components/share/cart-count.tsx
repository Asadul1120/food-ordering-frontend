"use client";

import { useCart } from "@/hooks/cart.hook";

export default function CartCount() {
  const { totalItems } = useCart();

  return (
    <span
      aria-live="polite"
      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffcc00] text-[11px] font-bold text-black"
    >
      {totalItems}
    </span>
  );
}
