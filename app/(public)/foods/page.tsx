"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import FoodCard from "@/components/foods/food-card";
import FoodPriceForm from "@/components/form/food-price-form";
import FoodSortSelect from "@/components/form/food-sort-select";

import { useCategories } from "@/hooks/category.hook";
import { useProducts } from "@/hooks/product.hook";

import { getErrorMessage } from "@/lib/utils";

import type { PriceFilters, ProductQuery } from "@/types/product.type";
import FoodCategoryNav from "@/components/share/FoodCategoryNav";

const sortOptions: {
  value: string;
  label: string;
  sortBy: ProductQuery["sortBy"];
  sortOrder: ProductQuery["sortOrder"];
}[] = [
  {
    value: "newest",
    label: "Newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    sortBy: "price",
    sortOrder: "desc",
  },
  {
    value: "name-asc",
    label: "Name: A to Z",
    sortBy: "name",
    sortOrder: "asc",
  },
];

export default function FoodsPage() {
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState<PriceFilters>({});

  const selectedSort = sortOptions.find((option) => option.value === sort)!;

  const categoriesQuery = useCategories();

  const productsQuery = useProducts({
    page,
    limit: 8,
    categoryId: categoryId || undefined,
    ...prices,
    sortBy: selectedSort.sortBy,
    sortOrder: selectedSort.sortOrder,
  });

  const categories = categoriesQuery.data?.data ?? [];
  const products = productsQuery.data?.data?.products ?? [];
  const pagination = productsQuery.data?.data?.pagination;

  const total = pagination?.totalProducts ?? 0;

  const firstItem =
    products.length && pagination
      ? (pagination.currentPage - 1) * pagination.limit + 1
      : 0;

  const lastItem = products.length ? firstItem + products.length - 1 : 0;

  const selectCategory = (id: string) => {
    setCategoryId(id);
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("categoryId") ?? "";

    setCategoryId(selectedCategory);
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#052b24]">
      {/* Menu navigation */}
      <nav
        aria-label="Food categories"
        className="border-b border-[#dce8e0] bg-white lg:sticky lg:top-[111px] lg:z-40"
      >
        <div className="mx-auto flex min-h-[45px] max-w-[1210px] items-center justify-between gap-6 px-4">
          <div className="flex min-w-0 items-center gap-7 overflow-x-auto whitespace-nowrap py-2 text-[14px]">
            <button
              type="button"
              onClick={() => selectCategory("")}
              className={!categoryId ? "font-semibold" : ""}
            >
              Full Menu
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={categoryId === category.id ? "font-semibold" : ""}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-6 text-[14px] md:flex">
            <Link href="/track-order">Track Order</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Page heading */}
      <section className="border-b border-[#dce8e0] bg-[#edf7f1]">
        <div className="mx-auto max-w-[1248px] px-4 py-[18px]">
          <p className="text-[13px] text-[#73817b]">
            <Link href="/">Home</Link>
            <span className="px-2">/</span>
            Menu
          </p>

          <h1 className="mt-1 text-[28px] font-bold leading-9">Our Menu</h1>

          <p className="mt-1 text-[14px] text-[#73817b]" aria-live="polite">
            {productsQuery.isPending
              ? "Loading items..."
              : productsQuery.isError
                ? "Items unavailable"
                : `${total} items`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1248px] px-4 pb-28 pt-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {[{ id: "", name: "All" }, ...categories].map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.id)}
              aria-pressed={categoryId === category.id}
              className={`min-h-[38px] rounded-full border px-4 text-[14px] transition ${
                categoryId === category.id
                  ? "border-[#08613f] bg-[#08613f] font-semibold text-white"
                  : "border-[#d5ddd8] bg-white hover:border-[#08613f]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {categoriesQuery.isError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            Categories could not be loaded.{" "}
            <button
              type="button"
              onClick={() => void categoriesQuery.refetch()}
              className="underline"
            >
              Try again
            </button>
          </p>
        )}

        {/* Result count and sorting */}
        <div className="mb-6 mt-7 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-[#73817b]" aria-live="polite">
            {productsQuery.isPending
              ? "Loading foods..."
              : productsQuery.isError
                ? "Could not load foods"
                : `Showing ${firstItem}–${lastItem} of ${total}`}
          </p>

          <div className="flex items-center gap-2 text-[14px]">
            <label htmlFor="food-sort" className="text-[#73817b]">
              Sort by
            </label>

            <FoodSortSelect
              value={sort}
              options={sortOptions}
              onChange={(value) => {
                setSort(value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Price sidebar */}
          <aside className="rounded-[18px] border border-[#edf0ec] bg-white p-5 shadow-[0_1px_3px_rgba(15,45,30,0.12)]">
            <h2 className="mb-2 text-[14px] font-semibold">Price (৳)</h2>

            <FoodPriceForm
              onApply={(filters) => {
                setPrices(filters);
                setPage(1);
              }}
            />
          </aside>

          {/* Foods */}
          <section aria-label="Foods" aria-busy={productsQuery.isFetching}>
            {productsQuery.isPending ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={index}
                    className="h-[330px] animate-pulse rounded-[18px] bg-white p-3"
                  >
                    <div className="aspect-[4/3] rounded-[13px] bg-[#e9eee9]" />
                    <div className="mt-4 h-4 rounded bg-[#e9eee9]" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-[#e9eee9]" />
                  </div>
                ))}
              </div>
            ) : productsQuery.isError ? (
              <div
                role="alert"
                className="rounded-[18px] bg-white p-8 text-center"
              >
                <p>{getErrorMessage(productsQuery.error)}</p>

                <button
                  type="button"
                  onClick={() => void productsQuery.refetch()}
                  className="mt-4 rounded-full bg-[#08613f] px-5 py-2 text-sm text-white"
                >
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <p className="rounded-[18px] bg-white p-8 text-center text-sm text-[#73817b]">
                No foods found. Try another category or price range.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <FoodCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination: একাধিক page থাকলেই দেখাবে */}
            {pagination &&
              pagination.totalPages > 1 &&
              !productsQuery.isError && (
                <div className="mt-8 flex items-center justify-center gap-4 text-sm">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-full border border-[#d5ddd8] bg-white px-4 py-2 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span>
                    Page {page} of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="rounded-full border border-[#d5ddd8] bg-white px-4 py-2 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
          </section>
        </div>
      </div>
    </div>
  );
}
