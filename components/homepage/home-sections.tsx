
"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Bike,
  CreditCard,
  UtensilsCrossed,
} from "lucide-react";

import { toast } from "sonner";

import { useCart } from "@/hooks/cart.hook";
import { useCategories } from "@/hooks/category.hook";
import { useFeaturedProducts } from "@/hooks/product.hook";

import { getErrorMessage } from "@/lib/utils";
import type { Product } from "@/types/product.type";

// ============================================
// HOW IT WORKS - Original Content
// ============================================

const steps = [
  {
    number: "1",
    title: "Choose your meal",
    description:
      "Browse the menu and add your favorites to the cart.",
  },
  {
    number: "2",
    title: "Place & pay",
    description:
      "Pay with bKash, Nagad, card or choose Cash on Delivery.",
  },
  {
    number: "3",
    title: "Enjoy at home",
    description:
      "We prepare it fresh and deliver it hot to your door.",
  },
];

// ============================================
// WHY SIDE KITCHEN - Original Content
// ============================================

const features = [
  {
    icon: UtensilsCrossed,
    title: "Restaurant & Café",
    description: "Meals, drinks, and café favorites",
  },
  {
    icon: Bike,
    title: "Easy Online Ordering",
    description: "Browse the menu and order online",
  },
  {
    icon: CreditCard,
    title: "Local Payment Options",
    description: "bKash, Nagad, SSLCOMMERZ & COD",
  },
];

// ============================================
// HOME SECTIONS COMPONENT
// ============================================

const HomeSections = () => {
  // ------------------------------------------
  // 1. GET CATEGORIES FROM BACKEND
  // ------------------------------------------

  const categoriesQuery = useCategories();

  const categories = categoriesQuery.data?.data ?? [];

  // ------------------------------------------
  // 2. GET ONLY FEATURED PRODUCTS
  // ------------------------------------------

  // Backend API:
  // GET /api/v1/products/featured

  const featuredQuery = useFeaturedProducts();

  // Only show products where isFeatured is true.
  // No regular/latest products are added here.

  const products = (featuredQuery.data?.data ?? []).filter(
    (product) => product.isFeatured === true,
  );

  // Product loading state
  const productsLoading = featuredQuery.isPending;

  // Product error state
  const productsFailed = featuredQuery.isError;

  // ------------------------------------------
  // 3. CART FUNCTIONALITY
  // ------------------------------------------

  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product);

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ------------------------------------------
  // 4. COMPONENT UI
  // ------------------------------------------

  return (
    <>
      {/* ===================================== */}
      {/* EXPLORE MENU SECTION */}
      {/* ===================================== */}

      <section className="bg-[#faf7f0] px-5 py-14">
        <div className="mx-auto max-w-[1155px]">
          {/* Section Header */}

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#063b29]">
              Explore the Menu
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Pick a category and find your favorite
            </p>
          </div>

          {/* Categories Grid */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Loading Skeleton */}

            {categoriesQuery.isPending &&
              Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-[2.25] animate-pulse rounded-2xl bg-[#d3e8db] shadow-sm"
                />
              ))}

            {/* Dynamic Categories */}

            {!categoriesQuery.isPending &&
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/foods?categoryId=${encodeURIComponent(
                    category.id,
                  )}`}
                  className="group relative aspect-[2.25] overflow-hidden rounded-2xl bg-[#d3e8db] shadow-sm"
                >
                  {/* Category Image */}

                  {category.imageUrl && (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 575px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Gradient Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#001b10]/80 via-transparent to-transparent" />

                  {/* Category Information */}

                  <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-5">
                    <h3 className="text-lg font-bold text-white">
                      {category.name}
                    </h3>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffcc00] text-xl font-bold text-black transition group-hover:translate-x-1">
                      <ArrowRight
                        size={20}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              ))}
          </div>

          {/* Category Error */}

          {categoriesQuery.isError && (
            <p
              role="alert"
              className="mt-4 text-center text-sm text-red-600"
            >
              Could not load categories.{" "}
              <button
                type="button"
                className="underline"
                onClick={() =>
                  void categoriesQuery.refetch()
                }
              >
                Try again
              </button>
            </p>
          )}

          {/* Empty Categories */}

          {categoriesQuery.isSuccess &&
            categories.length === 0 && (
              <p className="mt-4 text-center text-sm text-gray-500">
                No categories available right now.
              </p>
            )}
        </div>
      </section>

      {/* ===================================== */}
      {/* SIDE KITCHEN FAVORITES SECTION */}
      {/* ONLY FEATURED PRODUCTS */}
      {/* ===================================== */}

      <section className="bg-white px-5 py-14">
        <div className="mx-auto max-w-[1155px]">
          {/* Section Header */}

          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
            <div>
              <h2 className="text-2xl font-bold text-[#063b29]">
                Side Kitchen Favorites
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Handpicked meals and café favorites
              </p>
            </div>

            <Link
              href="/foods"
              className="rounded-full border border-gray-200 px-5 py-2 text-xs font-medium text-gray-700 transition hover:border-[#08613f] hover:text-[#08613f]"
            >
              View Full Menu{" "}
              <ArrowRight
                size={14}
                strokeWidth={2}
                className="inline-block align-[-2px]"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Products Grid */}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Loading Skeleton */}

            {productsLoading &&
              Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-sm"
                >
                  <div className="aspect-square animate-pulse rounded-lg bg-gray-100" />

                  <div className="mt-3 h-5 animate-pulse rounded bg-gray-100" />

                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              ))}

            {/* --------------------------------- */}
            {/* FEATURED PRODUCTS ONLY */}
            {/* --------------------------------- */}

            {!productsLoading &&
              products.map((product) => {
               const productHref = `/foods/${product.id}`;

                const soldOut = !product.isAvailable;

                return (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Product Image */}

                    <Link
                      href={productHref}
                      className="relative block aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 280px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Sold Out Overlay */}

                      {soldOut && (
                        <>
                          <div className="absolute inset-0 bg-black/40" />

                          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-800">
                            Sold out
                          </span>
                        </>
                      )}
                    </Link>

                    {/* Product Information */}

                    <div className="flex min-h-[145px] flex-col px-1 pt-3">
                      {/* Product Name */}

                      <Link href={productHref}>
                        <h3 className="min-h-[38px] text-sm font-semibold leading-5 text-gray-800 hover:text-[#08613f]">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Product Price */}

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        ৳
                        {Number(
                          product.price,
                        ).toLocaleString("en-BD", {
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      {/* Add to Cart */}

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                        disabled={soldOut}
                        className={`mt-auto flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold text-white transition ${
                          soldOut
                            ? "cursor-not-allowed bg-gray-200 text-gray-400"
                            : "bg-[#08613f] hover:bg-[#064d34]"
                        }`}
                      >
                        {soldOut
                          ? "Sold out"
                          : "+ Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Product Error */}

          {productsFailed && (
            <p
              role="alert"
              className="mt-4 text-center text-sm text-red-600"
            >
              Could not load featured products.{" "}
              <button
                type="button"
                className="underline"
                onClick={() =>
                  void featuredQuery.refetch()
                }
              >
                Try again
              </button>
            </p>
          )}

          {/* No Featured Products */}

          {!productsLoading &&
            !productsFailed &&
            products.length === 0 && (
              <p className="mt-4 text-center text-sm text-gray-500">
                No featured foods available right now.
              </p>
            )}
        </div>
      </section>

      {/* ===================================== */}
      {/* HOW IT WORKS SECTION */}
      {/* ORIGINAL DESIGN */}
      {/* ===================================== */}

      <section className="bg-[#faf7f0] px-5 py-14">
        <div className="mx-auto max-w-[1155px]">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#063b29]">
              How It Works
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              From craving to doorstep in three steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-xl border border-gray-100 bg-white px-6 py-7 text-center shadow-sm"
              >
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#08613f] text-sm font-bold text-white">
                  {step.number}
                </span>

                <h3 className="mt-4 text-base font-bold text-[#063b29]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* WHY SIDE KITCHEN SECTION */}
      {/* ORIGINAL DESIGN */}
      {/* ===================================== */}

      <section className="bg-[#edf7f1] px-5 py-14">
        <div className="mx-auto max-w-[1155px]">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#063b29]">
            Why Side Kitchen
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-100 bg-white px-5 py-7 text-center shadow-sm"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#08613f] text-xl text-white">
                  <feature.icon
                    size={22}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <h3 className="mt-4 text-sm font-bold text-[#063b29]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* FIND US SECTION */}
      {/* ORIGINAL DESIGN */}
      {/* ===================================== */}

      <section className="bg-[#faf7f0] px-5 py-14">
        <div className="mx-auto max-w-[1155px]">
          <div className="grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:grid-cols-2">
            {/* Restaurant Information */}

            <div className="p-7 sm:p-10">
              <h2 className="text-2xl font-bold text-[#063b29]">
                Find Us
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                {/* Address */}

                <div>
                  <h3 className="font-semibold text-[#08613f]">
                    Address
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Side Kitchen, Rayer Bazar,
                    Mohammadpur, Dhaka.
                  </p>
                </div>

                {/* Hours */}

                <div>
                  <h3 className="font-semibold text-[#08613f]">
                    Hours
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Every day · 10 AM – 10 PM
                  </p>
                </div>

                {/* Delivery */}

                <div>
                  <h3 className="font-semibold text-[#08613f]">
                    Delivery
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Rayer Bazar, Mohammadpur,
                    Dhaka-1209
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}

              <div className="mt-6 flex flex-wrap gap-2">
                {/* Call Us */}

                <a
                  href="tel:+8809658788505"
                  className="rounded-full bg-[#08613f] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#064d34]"
                >
                  Call Us
                </a>

                {/* WhatsApp */}

                <a
                  href="https://wa.me/8801904070111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-200 px-5 py-2.5 text-xs font-medium text-gray-700 transition hover:border-[#08613f]"
                >
                  WhatsApp
                </a>

                {/* Google Maps */}

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Side+Kitchen+Rayer+Bazar+Mohammadpur+Dhaka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-200 px-5 py-2.5 text-xs font-medium text-gray-700 transition hover:border-[#08613f]"
                >
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Order CTA */}

            <div className="flex min-h-[280px] flex-col items-center justify-center bg-gradient-to-br from-[#03291c] to-[#08613f] p-8 text-center">
              <h2 className="text-3xl font-extrabold text-white">
                Hungry?
              </h2>

              <p className="mt-1 text-2xl font-bold text-[#ffcc00]">
                We're cooking.
              </p>

              <Link
                href="/foods"
                className="mt-6 rounded-full bg-[#ffcc00] px-7 py-3 text-sm font-bold text-black transition hover:bg-yellow-400"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
