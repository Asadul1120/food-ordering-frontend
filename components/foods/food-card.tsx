"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/hooks/cart.hook";
import { getErrorMessage } from "@/lib/utils";
import type { Product } from "@/types/product.type";

type FoodCardProps = {
  product: Product;
};

export default function FoodCard({ product }: FoodCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    try {
      addToCart(product);

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <article className="flex min-h-[330px] min-w-0 flex-col rounded-[18px] border border-[#edf0ec] bg-white p-3 shadow-[0_1px_3px_rgba(15,45,30,0.12)]">
      {/* Food image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[13px] bg-[#f1f3ef]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 639px) calc(50vw - 30px), (max-width: 767px) calc(50vw - 30px), (max-width: 1023px) 30vw, (max-width: 1279px) 24vw, 194px"
          className="object-cover"
        />

        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-[#092b20]">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Food name */}
      <h2 className="mt-3 text-[16px] font-medium leading-[22px] text-[#052b24]">
        {product.name}
      </h2>

      {/* Price */}
      <p className="mt-1 text-[17px] font-medium text-[#052b24]">
        ৳
        {Number(product.price).toLocaleString("en-BD", {
          maximumFractionDigits: 2,
        })}
      </p>

      {/* Cart button */}
      <div className="mt-auto pt-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#08613f] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#064d34] disabled:cursor-not-allowed disabled:bg-[#f7f8f7] disabled:text-[#a6aeaa] disabled:shadow-none"
        >
          {product.isAvailable && <Plus size={16} aria-hidden="true" />}

          {product.isAvailable ? "Add to Cart" : "Sold out"}
        </button>
      </div>
    </article>
  );
}
