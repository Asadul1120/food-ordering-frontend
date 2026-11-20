
"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

import type { DiscountType } from "@/types/coupon.type";

export interface CouponFilters {
  search: string;
  discountType: "ALL" | DiscountType;
  status: "ALL" | "ACTIVE" | "INACTIVE";
}

type Props = {
  onApply: (filters: CouponFilters) => void;
};

const initialFilters: CouponFilters = {
  search: "",
  discountType: "ALL",
  status: "ALL",
};

export default function AdminCouponFilterForm({
  onApply,
}: Props) {
  const [search, setSearch] = useState("");
  const [discountType, setDiscountType] =
    useState<CouponFilters["discountType"]>("ALL");
  const [status, setStatus] =
    useState<CouponFilters["status"]>("ALL");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onApply({
      search: search.trim(),
      discountType,
      status,
    });
  };

  const handleClear = () => {
    setSearch("");
    setDiscountType("ALL");
    setStatus("ALL");

    onApply(initialFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3"
    >
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
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search coupon code..."
          className="h-11 w-full rounded-xl border border-[#d5ddd8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#08613f]"
        />
      </div>

      {/* Discount Type */}
      <select
        value={discountType}
        onChange={(event) =>
          setDiscountType(
            event.target.value as CouponFilters["discountType"],
          )
        }
        aria-label="Filter by discount type"
        className="h-11 min-w-[165px] rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f]"
      >
        <option value="ALL">All Discount Types</option>
        <option value="PERCENTAGE">Percentage</option>
        <option value="FIXED">Fixed Amount</option>
        <option value="FREE_DELIVERY">Free Delivery</option>
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(event) =>
          setStatus(
            event.target.value as CouponFilters["status"],
          )
        }
        aria-label="Filter by coupon status"
        className="h-11 min-w-[140px] rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f]"
      >
        <option value="ALL">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>

      <button
        type="submit"
        className="h-11 rounded-full bg-[#08613f] px-5 text-sm font-semibold text-white hover:bg-[#064d34]"
      >
        Search
      </button>

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
