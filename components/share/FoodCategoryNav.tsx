"use client";

import Link from "next/link";

import { useCategories } from "@/hooks/category.hook";


type FoodCategoryNavProps = {
  selectedCategoryId?: string;
};

export default function FoodCategoryNav({
  selectedCategoryId,
}: FoodCategoryNavProps) {
  // Get categories using the existing API hook
  const categoriesQuery = useCategories();

  // Show only active categories
  const categories = (categoriesQuery.data?.data ?? []).filter(
    (category) => category.isActive,
  );

  // Detect whether this navigation is on FoodsPage
  const isFoodsPage = selectedCategoryId !== undefined;

  return (
    <nav
      aria-label="Food categories"
      className="border-b border-[#dce8e0] bg-white"
    >
      <div className="mx-auto flex min-h-[45px] max-w-[1210px] items-center justify-between gap-6 px-4">
        {/* Left: Full Menu and Categories */}
        <div className="flex min-w-0 items-center gap-7 overflow-x-auto whitespace-nowrap py-2 text-[14px]">
          {/* Full Menu */}
          <Link
            href="/foods"
            className={!selectedCategoryId ? "font-semibold" : ""}
            aria-current={
              isFoodsPage && !selectedCategoryId ? "page" : undefined
            }
          >
            Full Menu
          </Link>

          {/* Dynamic Categories */}
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/foods?categoryId=${encodeURIComponent(category.id)}`}
              className={
                selectedCategoryId === category.id ? "font-semibold" : ""
              }
              aria-current={
                selectedCategoryId === category.id ? "page" : undefined
              }
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Right: Other Navigation Links */}
        <div className="hidden shrink-0 items-center gap-6 text-[14px] md:flex">
          <Link href="/track-order">Track Order</Link>

          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
