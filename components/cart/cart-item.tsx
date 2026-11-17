"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/hooks/cart.hook";

type CartItemProps = {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const price = Number(item.price) * item.quantity;

  const formattedPrice = price.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  });

  return (
    <article className="flex min-h-[145px] gap-4 rounded-[17px] border border-[#edf0ec] bg-white p-4 shadow-[0_1px_3px_rgba(15,45,30,0.10)]">
      {/* Product Image */}
      <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[12px] bg-[#f1f3ef] sm:h-[112px] sm:w-[112px]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 639px) 96px, 112px"
          className="object-cover"
        />
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        {/* Name and Price */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-[16px] font-semibold leading-6 text-[#052b24]">
            {item.name}
          </h2>

          <p className="shrink-0 text-[16px] font-semibold text-[#00603f]">
            ৳{formattedPrice}
          </p>
        </div>

        {/* Quantity and Remove */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          {/* Quantity Control */}
          <div className="flex h-[38px] w-[106px] items-center justify-between rounded-full border border-[#d5ddd8] bg-white">
            <button
              type="button"
              aria-label={`Decrease ${item.name} quantity`}
              disabled={item.quantity <= 1}
              onClick={() =>
                onQuantityChange(item.productId, item.quantity - 1)
              }
              className="flex h-full w-[34px] items-center justify-center text-[#00603f] disabled:cursor-not-allowed disabled:text-[#c8d2cc]"
            >
              <Minus size={15} strokeWidth={2.5} />
            </button>

            <span className="text-[14px] font-medium text-[#052b24]">
              {item.quantity}
            </span>

            <button
              type="button"
              aria-label={`Increase ${item.name} quantity`}
              disabled={item.quantity >= 99}
              onClick={() =>
                onQuantityChange(item.productId, item.quantity + 1)
              }
              className="flex h-full w-[34px] items-center justify-center text-[#00603f] disabled:cursor-not-allowed disabled:text-[#c8d2cc]"
            >
              <Plus size={15} strokeWidth={2.5} />
            </button>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="flex items-center gap-1.5 text-[14px] font-medium text-red-500 hover:text-red-600"
          >
            <Trash2 size={14} strokeWidth={2} />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
