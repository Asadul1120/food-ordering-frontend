// "use client";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { z } from "zod";

// import type { Product } from "@/types/product.type";

// const CART_KEY = "freshlya-cart";

// const cartSchema = z.array(
//   z.object({
//     productId: z.string(),
//     name: z.string(),
//     price: z.string(),
//     imageUrl: z.string(),
//     quantity: z.number().int().min(1).max(99),
//   }),
// );

// // Browser থেকে আগে সংরক্ষণ করা cart পড়া
// function getStoredCart(): z.infer<typeof cartSchema> {
//   try {
//     const stored = localStorage.getItem(CART_KEY);

//     const result = cartSchema.safeParse(JSON.parse(stored || "[]"));

//     return result.success ? result.data : [];
//   } catch {
//     return [];
//   }
// }

// export const useCart = () => {
//   const queryClient = useQueryClient();

//   const { data: items = [] } = useQuery({
//     queryKey: ["cart"],
//     queryFn: getStoredCart,
//     staleTime: Infinity,
//   });

//   const addToCart = (product: Product) => {
//     if (!product.isAvailable) {
//       throw new Error("This food is sold out");
//     }

//     const cart = getStoredCart();

//     const existing = cart.find((item) => item.productId === product.id);

//     if (existing && existing.quantity >= 99) {
//       throw new Error("Maximum quantity for one food is 99");
//     }

//     if (existing) {
//       // একই item থাকলে quantity বাড়বে
//       existing.quantity += 1;
//       existing.price = product.price;
//       existing.name = product.name;
//       existing.imageUrl = product.imageUrl;
//     } else {
//       cart.push({
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         imageUrl: product.imageUrl,
//         quantity: 1,
//       });
//     }

//     localStorage.setItem(CART_KEY, JSON.stringify(cart));

//     // Cart ব্যবহার করা components আপডেট হবে
//     queryClient.setQueryData(["cart"], cart);
//   };

//   return {
//     items,
//     addToCart,

//     totalItems: items.reduce((total, item) => total + item.quantity, 0),
//   };
// };

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

export type CartItem = z.infer<typeof cartSchema>[number];

// LocalStorage থেকে Cart পড়া
function getStoredCart(): CartItem[] {
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

  const { data: items = [], isPending } = useQuery({
    queryKey: ["cart"],
    queryFn: getStoredCart,
    staleTime: Infinity,
  });

  // Cart save এবং UI update
  const saveCart = (cart: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    queryClient.setQueryData(["cart"], cart);
  };

  // Add to Cart
  const addToCart = (product: Product) => {
    if (!product.isAvailable) {
      throw new Error("This food is sold out");
    }

    const cart = getStoredCart();

    const existing = cart.find((item) => item.productId === product.id);

    if (existing) {
      if (existing.quantity >= 99) {
        throw new Error("Maximum quantity is 99");
      }

      existing.quantity += 1;
      existing.name = product.name;
      existing.price = product.price;
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

    saveCart(cart);
  };

  // Product quantity পরিবর্তন
  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity)) return;
    if (quantity < 1 || quantity > 99) return;

    const cart = getStoredCart();

    const product = cart.find((item) => item.productId === productId);

    if (!product) return;

    product.quantity = quantity;

    saveCart(cart);
  };

  // Cart থেকে Product Remove
  const removeFromCart = (productId: string) => {
    const cart = getStoredCart();

    const updatedCart = cart.filter((item) => item.productId !== productId);

    saveCart(updatedCart);
  };

  // Total quantity
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return {
    items,
    isPending,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalItems,
  };
};
