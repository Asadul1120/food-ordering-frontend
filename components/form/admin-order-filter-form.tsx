"use client";

import { useForm } from "@tanstack/react-form";
import { Search } from "lucide-react";

import {
  orderStatuses,
  statusLabels,
} from "@/lib/admin";

import type { OrderStatus } from "@/types/admin.type";

type Filters = {
  search: string;
  orderStatus: OrderStatus | "";
};

type AdminOrderFilterFormProps = {
  onApply: (filters: Filters) => void;
};

export default function AdminOrderFilterForm({
  onApply,
}: AdminOrderFilterFormProps) {
  const form = useForm({
    defaultValues: {
      search: "",
      orderStatus: "",
    } as Filters,

    onSubmit: ({ value }) => {
      onApply({
        ...value,
        search: value.search.trim(),
      });
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="flex flex-wrap gap-3"
    >
      <form.Field name="search">
        {(field) => (
          <div className="relative min-w-[180px] flex-1">
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-3 top-3 text-[#73817b]"
            />

            <input
              aria-label="Search orders"
              name={field.name}
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.target.value)
              }
              placeholder="Order number, customer or phone"
              className="h-10 w-full rounded-xl border border-[#d5ddd8] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#08613f]"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="orderStatus">
        {(field) => (
          <select
            aria-label="Order status"
            name={field.name}
            value={field.state.value}
            onChange={(event) =>
              field.handleChange(
                event.target.value as Filters["orderStatus"],
              )
            }
            className="h-10 rounded-xl border border-[#d5ddd8] bg-white px-3 text-sm outline-none focus:border-[#08613f]"
          >
            <option value="">All statuses</option>

            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        )}
      </form.Field>

      <button
        type="submit"
        className="h-10 rounded-full bg-[#08613f] px-5 text-sm font-semibold text-white"
      >
        Search
      </button>

      <button
        type="button"
        onClick={() => {
          form.reset();

          onApply({
            search: "",
            orderStatus: "",
          });
        }}
        className="h-10 rounded-full border border-[#d5ddd8] px-4 text-sm"
      >
        Reset
      </button>
    </form>
  );
}