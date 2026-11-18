"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

export type CategoryFilters = {
  search: string;
  status: "ALL" | "ACTIVE" | "INACTIVE";
};

type Props = {
  onApply: (filters: CategoryFilters) => void;
};

export default function AdminCategoryFilterForm({ onApply }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CategoryFilters["status"]>("ALL");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onApply({
      search: search.trim(),
      status,
    });
  };

  const handleClear = () => {
    setSearch("");
    setStatus("ALL");

    onApply({
      search: "",
      status: "ALL",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      {/* Search Category */}
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73817b]"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          className="h-11 w-full rounded-xl border border-[#d5ddd8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#08613f]"
        />
      </div>

      {/* Active / Inactive Filter */}
      <select
        aria-label="Category status"
        value={status}
        onChange={(event) =>
          setStatus(event.target.value as CategoryFilters["status"])
        }
        className="h-11 min-w-[155px] rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f]"
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
