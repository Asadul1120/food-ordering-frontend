"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import type { Product } from "@/types/product.type";

const CART_KEY = "freshlya-cart";

const cartSchema = z.array(
  z.object({
    productId: z.string(),
    name: z.string(),
    price: z.string(),
    imageUrl: z.string(),
    quantity: z.number().int().min(1).max(99),
  }),
);

// Browser থেকে আগে সংরক্ষণ করা cart পড়া
function getStoredCart(): z.infer<typeof cartSchema> {
  try {
    const stored = localStorage.getItem(CART_KEY);

    const result = cartSchema.safeParse(JSON.parse(stored || "[]"));

    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getStoredCart,
    staleTime: Infinity,
  });

  const addToCart = (product: Product) => {
    if (!product.isAvailable) {
      throw new Error("This food is sold out");
    }

    const cart = getStoredCart();

    const existing = cart.find((item) => item.productId === product.id);

    if (existing && existing.quantity >= 99) {
      throw new Error("Maximum quantity for one food is 99");
    }

    if (existing) {
      // একই item থাকলে quantity বাড়বে
      existing.quantity += 1;
      existing.price = product.price;
      existing.name = product.name;
      existing.imageUrl = product.imageUrl;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // Cart ব্যবহার করা components আপডেট হবে
    queryClient.setQueryData(["cart"], cart);
  };

  return {
    items,
    addToCart,

    totalItems: items.reduce((total, item) => total + item.quantity, 0),
  };
};
