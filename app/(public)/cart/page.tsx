"use client";

import Link from "next/link";

import CartItem from "@/components/cart/cart-item";
import OrderSummary from "@/components/cart/order-summary";

import { useCart } from "@/hooks/cart.hook";
import { useCategories } from "@/hooks/category.hook";

export default function CartPage() {
  const { items, isPending, totalItems, updateQuantity, removeFromCart } =
    useCart();

  const categoriesQuery = useCategories();

  const categories = categoriesQuery.data?.data ?? [];

  // Cart-এর সব Product-এর total price
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#052b24]">
      {/* Menu Navigation */}
      <nav
        aria-label="Food categories"
        className="border-b border-[#dce8e0] bg-white"
      >
        <div className="mx-auto flex min-h-[40px] max-w-[1248px] items-center justify-between gap-6 px-4">
          <div className="flex min-w-0 items-center gap-7 overflow-x-auto whitespace-nowrap py-2 text-[14px]">
            <Link href="/foods" className="font-semibold text-[#08613f]">
              Full Menu
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href="/foods"
                className="text-[#3f4d46] hover:text-[#08613f]"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-6 text-[14px] text-[#3f4d46] md:flex">
            <Link href="/track-order">Track Order</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Cart Heading */}
      <section className="border-b border-[#dce8e0] bg-[#edf7f1]">
        <div className="mx-auto max-w-[1248px] px-4 py-[18px]">
          <h1 className="text-[30px] font-bold leading-[38px] tracking-tight text-[#052b24]">
            Your Cart
          </h1>

          <p className="mt-1 text-[14px] text-[#73817b]" aria-live="polite">
            {isPending
              ? "Loading cart..."
              : `${totalItems} items ready to order`}
          </p>
        </div>
      </section>

      {/* Main Cart Content */}
      <div className="mx-auto grid max-w-[1248px] items-start gap-8 px-4 pb-24 pt-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left Side - Cart Items */}
        <section aria-label="Cart items" className="min-w-0">
          {isPending ? (
            <div className="rounded-[17px] bg-white p-8 text-center text-[#73817b]">
              Loading your cart...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[17px] border border-[#edf0ec] bg-white p-8 text-center shadow-sm">
              <h2 className="text-[20px] font-semibold">Your cart is empty</h2>

              <p className="mt-2 text-[14px] text-[#73817b]">
                Add some delicious food to get started.
              </p>

              <Link
                href="/foods"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#ffcc00] px-6 text-[14px] font-semibold text-[#052b24]"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}

          {/* Add More Items */}
          {items.length > 0 && !isPending && (
            <Link
              href="/foods"
              className="mt-5 inline-block text-[14px] font-medium text-[#00603f] hover:underline"
            >
              ← Add more items
            </Link>
          )}
        </section>

        {/* Right Side - Order Summary */}
        <OrderSummary subtotal={subtotal} hasItems={items.length > 0} />
      </div>
    </div>
  );
}
