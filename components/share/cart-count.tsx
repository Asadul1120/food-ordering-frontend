"use client";

import { Suspense, type ReactNode } from "react";

import { useCart } from "@/hooks/cart.hook";

function CartBadge({ children }: { children: ReactNode }) {
  return (
    <span
      aria-live="polite"
      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffcc00] text-[11px] font-bold text-black"
    >
      {children}
    </span>
  );
}

function CartCountContent() {
  const { totalItems } = useCart();

  return <CartBadge>{totalItems}</CartBadge>;
}

export default function CartCount() {
  return (
    <Suspense fallback={<CartBadge>…</CartBadge>}>
      <CartCountContent />
    </Suspense>
  );
}
