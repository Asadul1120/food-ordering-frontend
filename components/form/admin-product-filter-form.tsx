"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Search } from "lucide-react";
import { useCategories } from "@/hooks/category.hook";

type Props = {
  onApply: (filters: { search: string; categoryId: string }) => void;
};

export default function AdminProductFilterForm({ onApply }: Props) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data?.data ?? [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onApply({
      search: search.trim(),
      categoryId,
    });
  };

  const handleClear = () => {
    setSearch("");
    setCategoryId("");

    onApply({
      search: "",
      categoryId: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73817b]"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className="h-11 w-full rounded-xl border border-[#d5ddd8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#08613f]"
        />
      </div>

      {/* Category Filter */}
      <select
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        className="h-11 min-w-[165px] rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f]"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Search Button */}
      <button
        type="submit"
        className="h-11 rounded-full bg-[#08613f] px-5 text-sm font-semibold text-white hover:bg-[#064d34]"
      >
        Search
      </button>

      {/* Clear Filters */}
      <button
        type="button"
        onClick={handleClear}
        className="h-11 rounded-full border border-[#d5ddd8] px-5 text-sm font-medium"
      >
        Clear
      </button>
    </form>
  );
}
