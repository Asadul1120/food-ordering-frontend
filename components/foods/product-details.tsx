"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Bike, CreditCard, Flame, Minus, Plus, Star } from "lucide-react";

import { toast } from "sonner";

import { useCategories } from "@/hooks/category.hook";
import { useCart } from "@/hooks/cart.hook";

import { useProductById, useProducts } from "@/hooks/product.hook";

import { getErrorMessage } from "@/lib/utils";

import type { Product } from "@/types/product.type";
import FoodCategoryNav from "../share/FoodCategoryNav";

// ============================================
// PRICE FORMAT HELPER
// ============================================

const taka = (value: number | string) =>
  `৳${Number(value).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

// ============================================
// RELATED PRODUCTS
// ============================================

function RelatedProducts({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const relatedQuery = useProducts({
    page: 1,
    limit: 20,
    categoryId: product.categoryId,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Exclude current product
  const related = (relatedQuery.data?.data?.products ?? [])
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  // Add related product to cart
  const addRelatedToCart = (item: Product) => {
    try {
      addToCart(item);

      toast.success(`${item.name} added to cart`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <section className="mt-14 max-w-[850px]">
      <h2 className="mb-5 text-[24px] font-bold text-[#052b24] sm:text-[26px]">
        You may also like
      </h2>

      {/* Loading */}
      {relatedQuery.isPending ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-[310px] animate-pulse rounded-xl bg-white"
            />
          ))}
        </div>
      ) : relatedQuery.isError ? (
        <p className="text-sm text-red-600">
          Could not load suggestions.{" "}
          <button
            type="button"
            onClick={() => void relatedQuery.refetch()}
            className="underline"
          >
            Try again
          </button>
        </p>
      ) : related.length === 0 ? (
        <p className="text-sm text-[#73817b]">
          No similar foods available yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <article
              key={item.id}
              className="flex min-w-0 flex-col rounded-[16px] border border-[#edf0ec] bg-white p-3 shadow-[0_1px_3px_rgba(15,45,30,0.10)]"
            >
              {/* Product Image */}
              <Link
                href={`/foods/${item.id}`}
                className="relative block aspect-[4/3] overflow-hidden rounded-[12px] bg-gray-100"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 45vw, 260px"
                  className="object-cover transition duration-500 hover:scale-105"
                />

                {!item.isAvailable && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
                    Sold out
                  </span>
                )}
              </Link>

              {/* Product Name */}
              <Link
                href={`/foods/${item.id}`}
                className="mt-3 line-clamp-2 min-h-[42px] text-[14px] font-semibold leading-5 text-[#052b24] hover:text-[#08613f] sm:text-[15px]"
              >
                {item.name}
              </Link>

              {/* Price */}
              <p className="mt-2 text-[15px] font-semibold text-[#052b24]">
                {taka(item.price)}
              </p>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => addRelatedToCart(item)}
                disabled={!item.isAvailable}
                className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#08613f] text-[13px] font-semibold text-white transition hover:bg-[#064d34] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                {item.isAvailable ? (
                  <>
                    <Plus size={15} />
                    Add to Cart
                  </>
                ) : (
                  "Sold out"
                )}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================
// PRODUCT DETAILS COMPONENT
// ============================================

export default function ProductDetails({ id }: { id: string }) {
  // ------------------------------------------
  // 1. QUANTITY STATE
  // ------------------------------------------

  const [quantity, setQuantity] = useState(1);

  // ------------------------------------------
  // 2. EXISTING HOOKS
  // ------------------------------------------

  const { addToCart } = useCart();

  const productQuery = useProductById(id);

  const categoriesQuery = useCategories();

  // ------------------------------------------
  // 3. BACKEND DATA
  // ------------------------------------------

  const product = productQuery.data?.data;

  const categories = categoriesQuery.data?.data ?? [];

  // ------------------------------------------
  // 4. PRICE CALCULATION
  // ------------------------------------------

  const unitPrice = Number(product?.price ?? 0);

  const totalPrice = unitPrice * quantity;

  // ------------------------------------------
  // 5. ADD TO CART
  // ------------------------------------------

  const handleAddToCart = () => {
    if (!product) return;

    try {
      addToCart(product, quantity);

      toast.success(`${quantity} × ${product.name} added to cart`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#052b24]">
      {/* ==================================== */}
      {/* CATEGORY NAVIGATION */}
      {/* ==================================== */}

      <FoodCategoryNav />

      {/* ==================================== */}
      {/* MAIN CONTENT */}
      {/* ==================================== */}

      <main className="mx-auto max-w-[1100px] px-4 pb-28 pt-7 sm:px-5 sm:pt-8">
        {/* ================================== */}
        {/* LOADING STATE */}
        {/* ================================== */}

        {productQuery.isPending ? (
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div className="aspect-square animate-pulse rounded-[20px] bg-[#e9eee9]" />

            <div className="space-y-6">
              <div className="h-10 animate-pulse rounded bg-[#e9eee9]" />

              <div className="h-6 w-1/3 animate-pulse rounded bg-[#e9eee9]" />

              <div className="h-20 animate-pulse rounded bg-[#e9eee9]" />

              <div className="h-12 animate-pulse rounded-full bg-[#e9eee9]" />
            </div>
          </div>
        ) : productQuery.isError || !product ? (
          /* ================================= */
          /* PRODUCT ERROR */
          /* ================================= */

          <div
            role="alert"
            className="rounded-[18px] bg-white p-10 text-center"
          >
            <h1 className="text-2xl font-bold">Product unavailable</h1>

            <p className="mt-3 text-base text-[#73817b]">
              {productQuery.isError
                ? getErrorMessage(productQuery.error)
                : "This product could not be found."}
            </p>

            <Link
              href="/foods"
              className="mt-6 inline-block rounded-full bg-[#08613f] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#064d34]"
            >
              Back to menu
            </Link>
          </div>
        ) : (
          <>
            {/* ================================= */}
            {/* BREADCRUMB */}
            {/* ================================= */}

            <nav
              aria-label="Breadcrumb"
              className="mb-6 text-[13px] text-[#73817b]"
            >
              <Link href="/" className="hover:text-[#08613f]">
                Home
              </Link>

              <span className="px-2">/</span>

              <Link
                href={`/foods?categoryId=${product.categoryId}`}
                className="hover:text-[#08613f]"
              >
                {product.category.name}
              </Link>

              <span className="px-2">/</span>

              <span className="font-medium text-[#052b24]">{product.name}</span>
            </nav>

            {/* ================================= */}
            {/* PRODUCT IMAGE + DETAILS */}
            {/* ================================= */}

            <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
              {/* LEFT: PRODUCT IMAGE */}

              <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#e9eee9]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, 520px"
                  className="object-cover"
                />
              </div>

              {/* RIGHT: PRODUCT INFORMATION */}

              <div className="min-w-0">
                {/* Product Name */}

                <h1 className="text-[30px] font-bold leading-tight text-[#052b24] sm:text-[32px]">
                  {product.name}
                </h1>

                {/* Rating */}

                <div
                  className="mt-3 flex items-center gap-1 text-[#08613f]"
                  aria-label="No ratings yet"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={15} strokeWidth={1.5} />
                  ))}

                  <span className="ml-1 text-[13px] text-[#73817b]">(0)</span>
                </div>

                {/* Product Price */}

                <p className="mt-5 text-[27px] font-semibold text-[#052b24] sm:text-[28px]">
                  {taka(product.price)}
                </p>

                {/* Product Description */}

                <p className="mt-4 text-[14px] leading-7 text-[#47554f] sm:text-[15px]">
                  {product.description || "Freshly prepared for your order."}
                </p>

                {/* ================================= */}
                {/* QUANTITY SELECTOR */}
                {/* ================================= */}

                <div className="mt-7 flex items-center justify-between gap-4">
                  <div className="inline-flex h-11 items-center gap-5 rounded-full border border-[#dce4df] bg-white px-4">
                    {/* Decrease */}

                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      disabled={quantity === 1}
                      className="text-[#08613f] transition hover:opacity-70 disabled:opacity-40"
                    >
                      <Minus size={16} />
                    </button>

                    {/* Quantity */}

                    <span className="w-5 text-center text-[15px] font-semibold">
                      {quantity}
                    </span>

                    {/* Increase */}

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        setQuantity((current) => Math.min(99, current + 1))
                      }
                      disabled={quantity === 99}
                      className="text-[#08613f] transition hover:opacity-70 disabled:opacity-40"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Total Price */}

                  <div className="text-right text-[13px] text-[#73817b]">
                    <p>
                      {quantity} × {taka(unitPrice)}
                    </p>

                    <p className="text-[17px] font-bold text-[#052b24]">
                      {taka(totalPrice)}
                    </p>
                  </div>
                </div>

                {/* ================================= */}
                {/* ADD TO CART */}
                {/* ================================= */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className="mt-5 flex h-[48px] w-full items-center justify-center rounded-full bg-[#08613f] text-[15px] font-semibold text-white transition hover:bg-[#064d34] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {product.isAvailable
                    ? `Add to Cart · ${taka(totalPrice)}`
                    : "Sold out"}
                </button>

                {/* ================================= */}
                {/* DELIVERY INFORMATION */}
                {/* ================================= */}

                <div className="mt-5 overflow-hidden rounded-[16px] border border-[#edf0ec] bg-white">
                  {/* Cooked Fresh */}

                  <div className="flex items-center gap-4 border-b border-[#edf0ec] p-4">
                    <span className="rounded-xl bg-[#edf7f1] p-3 text-[#08613f]">
                      <Flame size={19} />
                    </span>

                    <div>
                      <p className="text-[14px] font-semibold">Cooked fresh</p>

                      <p className="mt-1 text-[13px] text-[#73817b]">
                        Made when you order, never reheated
                      </p>
                    </div>
                  </div>

                  {/* Delivery */}

                  <div className="flex items-center gap-4 border-b border-[#edf0ec] p-4">
                    <span className="rounded-xl bg-[#edf7f1] p-3 text-[#08613f]">
                      <Bike size={19} />
                    </span>

                    <div>
                      <p className="text-[14px] font-semibold">
                        Delivery in Savar
                      </p>

                      <p className="mt-1 text-[13px] text-[#73817b]">
                        Every day 3 PM–11 PM · pre-order anytime
                      </p>
                    </div>
                  </div>

                  {/* Payment */}

                  <div className="flex items-center gap-4 p-4">
                    <span className="rounded-xl bg-[#edf7f1] p-3 text-[#08613f]">
                      <CreditCard size={19} />
                    </span>

                    <div>
                      <p className="text-[14px] font-semibold">Pay your way</p>

                      <p className="mt-1 text-[13px] text-[#73817b]">
                        bKash, Nagad, card or Cash on Delivery
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================================= */}
                {/* ABOUT THIS ITEM */}
                {/* ================================= */}

                <section className="mt-6 rounded-[16px] border border-[#edf0ec] bg-white p-6">
                  <h2 className="text-[16px] font-bold">About this item</h2>

                  <p className="mt-4 whitespace-pre-line text-[14px] leading-7 text-[#47554f]">
                    {product.description ||
                      "No description has been added for this item yet."}
                  </p>
                </section>
              </div>
            </div>

            {/* ================================= */}
            {/* REVIEWS SECTION */}
            {/* ================================= */}

            <section className="mt-14 max-w-[700px]" id="reviews">
              <h2 className="mb-5 text-[24px] font-bold sm:text-[26px]">
                Reviews (0)
              </h2>

              {/* Empty Reviews */}

              <div className="flex items-center gap-4 rounded-[16px] border border-[#edf0ec] bg-white p-5 shadow-sm">
                <span className="rounded-xl bg-[#fff0ba] p-3 text-[#052b24]">
                  <Star size={23} />
                </span>

                <div>
                  <p className="text-[15px] font-semibold">No reviews yet</p>

                  <p className="mt-1 text-[13px] text-[#73817b]">
                    Reviews will be available when the review feature is added.
                  </p>
                </div>
              </div>

              {/* Review Button */}

              <button
                type="button"
                disabled
                title="Review submission is not available yet"
                className="mt-3 rounded-full border border-[#dce4df] bg-white px-5 py-2.5 text-[13px] font-medium text-[#73817b] disabled:cursor-not-allowed"
              >
                Sign in to write a review
              </button>
            </section>

            {/* ================================= */}
            {/* RELATED PRODUCTS */}
            {/* ================================= */}

            <RelatedProducts product={product} />
          </>
        )}
      </main>
    </div>
  );
}
