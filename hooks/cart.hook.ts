"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import type { Product } from "@/types/product.type";

const CART_KEY = "freshlya-cart";
const CART_EVENT = "freshlya-cart-updated";

// Cart item validation
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

const EMPTY_CART: CartItem[] = [];

// Cached snapshot prevents unnecessary re-renders
let lastStoredValue: string | null | undefined;
let lastCart: CartItem[] = EMPTY_CART;

// Read cart from localStorage
function getStoredCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);

    const result = cartSchema.safeParse(JSON.parse(stored || "[]"));

    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

// Browser snapshot
function getCartSnapshot(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);

    // Return the same array when storage hasn't changed
    if (stored === lastStoredValue) {
      return lastCart;
    }

    lastStoredValue = stored;

    const result = cartSchema.safeParse(JSON.parse(stored || "[]"));

    lastCart = result.success ? result.data : EMPTY_CART;

    return lastCart;
  } catch {
    lastCart = EMPTY_CART;
    return lastCart;
  }
}

// Server snapshot must always be stable
function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

// Listen for cart changes
function subscribeToCart(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_KEY || event.key === null) {
      onChange();
    }
  };

  window.addEventListener(CART_EVENT, onChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CART_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

// Hydration-safe loading status
function subscribeToNothing() {
  return () => {};
}

function getClientLoadingStatus() {
  return false;
}

function getServerLoadingStatus() {
  return true;
}

export const useCart = () => {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const isPending = useSyncExternalStore(
    subscribeToNothing,
    getClientLoadingStatus,
    getServerLoadingStatus,
  );

  // Save cart and notify all components
  const saveCart = (cart: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event(CART_EVENT));
  };

  // Add product to cart
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

  // Increase or decrease quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity)) return;
    if (quantity < 1 || quantity > 99) return;

    const cart = getStoredCart();

    const product = cart.find((item) => item.productId === productId);

    if (!product) return;

    product.quantity = quantity;

    saveCart(cart);
  };

  // Remove product
  const removeFromCart = (productId: string) => {
    const cart = getStoredCart();

    const updatedCart = cart.filter((item) => item.productId !== productId);

    saveCart(updatedCart);
  };

  // Clear all products
  const clearCart = () => {
    saveCart([]);
  };

  // Total quantity
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return {
    items,
    isPending,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
  };
};
