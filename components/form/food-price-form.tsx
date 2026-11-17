"use client";

import { useForm } from "@tanstack/react-form";

import { foodPriceSchema } from "@/validation/food.validation";
import { getFieldError } from "@/lib/utils";
import type { PriceFilters } from "@/types/product.type";

type FoodPriceFormProps = {
  onApply: (filters: PriceFilters) => void;
};

export default function FoodPriceForm({ onApply }: FoodPriceFormProps) {
  const form = useForm({
    defaultValues: {
      minPrice: "",
      maxPrice: "",
    },

    validators: {
      onSubmit: foodPriceSchema,
    },

    onSubmit: ({ value }) => {
      onApply({
        minPrice: value.minPrice.trim() ? Number(value.minPrice) : undefined,

        maxPrice: value.maxPrice.trim() ? Number(value.maxPrice) : undefined,
      });
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        void form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-[1fr_10px_1fr] items-start gap-2">
        {/* Minimum price */}
        <form.Field name="minPrice">
          {(field) => {
            const error = getFieldError(field.state.meta.errors);

            return (
              <div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Min"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-label="Minimum price"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "min-price-error" : undefined}
                  className="h-[42px] w-full min-w-0 rounded-[13px] border border-[#d5ddd8] bg-white px-3 text-[14px] outline-none focus:border-[#086442]"
                />

                {error && (
                  <p
                    id="min-price-error"
                    role="alert"
                    className="mt-1 text-xs text-red-600"
                  >
                    {error}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <span className="pt-3 text-center text-[#64716b]">–</span>

        {/* Maximum price */}
        <form.Field name="maxPrice">
          {(field) => {
            const error = getFieldError(field.state.meta.errors);

            return (
              <div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Max"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-label="Maximum price"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "max-price-error" : undefined}
                  className="h-[42px] w-full min-w-0 rounded-[13px] border border-[#d5ddd8] bg-white px-3 text-[14px] outline-none focus:border-[#086442]"
                />

                {error && (
                  <p
                    id="max-price-error"
                    role="alert"
                    className="mt-1 text-xs text-red-600"
                  >
                    {error}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <button
        type="submit"
        className="mt-6 h-10 w-full rounded-full bg-[#08613f] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#064d34]"
      >
        Apply filters
      </button>
    </form>
  );
}
