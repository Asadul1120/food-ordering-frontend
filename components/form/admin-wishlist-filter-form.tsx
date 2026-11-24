"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

import type { WishlistStatus } from "@/types/admin-wishlist.type";

export interface WishlistFilters {
  search: string;
  status: "ALL" | WishlistStatus;
}

type Props = {
  onApply: (filters: WishlistFilters) => void;
};

const initialFilters: WishlistFilters = {
  search: "",
  status: "ALL",
};

export default function AdminWishlistFilterForm({ onApply }: Props) {
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<WishlistFilters["status"]>("ALL");

  // Apply filters
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onApply({
      search: search.trim(),
      status,
    });
  };

  // Clear filters
  const handleClear = () => {
    setSearch("");
    setStatus("ALL");

    onApply(initialFilters);
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
          maxLength={100}
          aria-label="Search wishlists"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search food, customer or phone..."
          className="h-11 w-full rounded-xl border border-[#d5ddd8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#08613f]"
        />
      </div>

      {/* Status Filter */}
      <select
        value={status}
        aria-label="Filter by wishlist status"
        onChange={(event) =>
          setStatus(event.target.value as WishlistFilters["status"])
        }
        className="h-11 min-w-[150px] rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f]"
      >
        <option value="ALL">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>

      {/* Search Button */}
      <button
        type="submit"
        className="h-11 rounded-full bg-[#08613f] px-5 text-sm font-semibold text-white hover:bg-[#064d34]"
      >
        Search
      </button>

      {/* Clear Button */}
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
