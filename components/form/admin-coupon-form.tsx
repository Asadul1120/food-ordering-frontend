
"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { useAdminCouponActions } from "@/hooks/admin-coupon.hook";

import {
  getErrorMessage,
  getFieldError,
} from "@/lib/utils";

import type { Coupon, DiscountType } from "@/types/coupon.type";
import type { CreateCouponPayload } from "@/types/admin-coupon.type";

import {
  adminCouponSchema,
  type AdminCouponFormValues,
} from "@/validation/admin-coupon.validation";

type Props = {
  coupon: Coupon | null;
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm text-[#052b24] outline-none focus:border-[#08613f] disabled:cursor-not-allowed disabled:bg-[#f4f6f3]";

const labelClass = "mb-2 block text-sm font-medium text-[#052b24]";

// Convert date into datetime-local input format
const dateToLocalInput = (value: string) => {
  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Default form values
const getDefaultValues = (
  coupon: Coupon | null,
): AdminCouponFormValues => {
  const now = new Date();

  const nextMonth = new Date(now);
  nextMonth.setDate(nextMonth.getDate() + 30);

  return {
    code: coupon?.code ?? "",
    description: coupon?.description ?? "",

    discountType: coupon?.discountType ?? "PERCENTAGE",
    discountValue: coupon?.discountValue ?? "10",

    minOrderAmount: coupon?.minOrderAmount ?? "0",
    maxDiscountAmount: coupon?.maxDiscountAmount ?? "",

    usageLimit: coupon?.usageLimit?.toString() ?? "",
    perUserLimit: coupon?.perUserLimit?.toString() ?? "",

    startDate: coupon
      ? dateToLocalInput(coupon.startDate)
      : dateToLocalInput(now.toISOString()),

    expiryDate: coupon
      ? dateToLocalInput(coupon.expiryDate)
      : dateToLocalInput(nextMonth.toISOString()),

    isActive: coupon?.isActive ?? true,
  };
};

// Reusable field error
function FieldError({
  errors,
}: {
  errors: readonly unknown[];
}) {
  const error = getFieldError(errors);

  if (!error) return null;

  return (
    <p role="alert" className="mt-1 text-xs text-red-500">
      {error}
    </p>
  );
}

export default function AdminCouponForm({
  coupon,
  onClose,
  onSaved,
}: Props) {
  const actions = useAdminCouponActions();

  const isEdit = Boolean(coupon);

  const isSaving =
    actions.createCoupon.isPending ||
    actions.updateCoupon.isPending;

  const form = useForm({
    defaultValues: getDefaultValues(coupon),

    validators: {
      onSubmit: adminCouponSchema,
    },

    onSubmit: async ({ value }) => {
      // Prepare the data for backend
      const payload: Omit<CreateCouponPayload, "isActive"> = {
        code: value.code.trim().toUpperCase(),

        description: value.description.trim() || null,

        discountType: value.discountType,
        discountValue: value.discountValue,

        minOrderAmount: value.minOrderAmount,

        maxDiscountAmount:
          value.maxDiscountAmount || null,

        usageLimit: value.usageLimit
          ? Number(value.usageLimit)
          : null,

        perUserLimit: value.perUserLimit
          ? Number(value.perUserLimit)
          : null,

        startDate: new Date(value.startDate).toISOString(),
        expiryDate: new Date(value.expiryDate).toISOString(),
      };

      try {
        if (coupon) {
          // Update existing coupon
          await actions.updateCoupon.mutateAsync({
            id: coupon.id,
            body: payload,
          });

          toast.success("Coupon updated successfully");
        } else {
          // Create new coupon
          await actions.createCoupon.mutateAsync({
            ...payload,
            isActive: value.isActive,
          });

          toast.success("Coupon created successfully");
        }

        onSaved();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        void form.handleSubmit();
      }}
      className="space-y-5"
    >
      {/* Coupon Code */}
      <form.Field name="code">
        {(field) => (
          <div>
            <label htmlFor="coupon-code" className={labelClass}>
              Coupon Code <span className="text-red-500">*</span>
            </label>

            <input
              id="coupon-code"
              name={field.name}
              type="text"
              required
              maxLength={50}
              placeholder="e.g. WELCOME10"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.target.value.toUpperCase())
              }
              className={inputClass}
            />

            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      {/* Description */}
      <form.Field name="description">
        {(field) => (
          <div>
            <label htmlFor="coupon-description" className={labelClass}>
              Description
              <span className="ml-2 text-xs font-normal text-[#73817b]">
                (optional)
              </span>
            </label>

            <textarea
              id="coupon-description"
              name={field.name}
              rows={3}
              maxLength={1000}
              placeholder="Write coupon description..."
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.target.value)
              }
              className="w-full resize-y rounded-xl border border-[#d5ddd8] bg-white px-4 py-3 text-sm text-[#052b24] outline-none focus:border-[#08613f]"
            />

            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      {/* Discount Type and Value */}
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="discountType">
          {(field) => (
            <div>
              <label htmlFor="coupon-discount-type" className={labelClass}>
                Discount Type *
              </label>

              <select
                id="coupon-discount-type"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  const nextType = event.target.value as DiscountType;
                  const previousType = field.state.value;

                  field.handleChange(nextType);

                  // Free delivery always requires zero
                  if (nextType === "FREE_DELIVERY") {
                    form.setFieldValue("discountValue", "0");
                  } else if (previousType === "FREE_DELIVERY") {
                    form.setFieldValue("discountValue", "10");
                  }

                  // Maximum discount only works for percentage
                  if (nextType !== "PERCENTAGE") {
                    form.setFieldValue("maxDiscountAmount", "");
                  }
                }}
                className={inputClass}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (৳)</option>
                <option value="FREE_DELIVERY">Free Delivery</option>
              </select>

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.discountType}>
          {(discountType) => (
            <form.Field name="discountValue">
              {(field) => (
                <div>
                  <label htmlFor="coupon-discount-value" className={labelClass}>
                    Discount Value *
                  </label>

                  <input
                    id="coupon-discount-value"
                    name={field.name}
                    type="number"
                    min="0"
                    max={discountType === "PERCENTAGE" ? 100 : undefined}
                    step="0.01"
                    value={field.state.value}
                    disabled={discountType === "FREE_DELIVERY"}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    className={inputClass}
                  />

                  <p className="mt-1 text-[11px] text-[#73817b]">
                    {discountType === "PERCENTAGE"
                      ? "Enter a percentage from 0.01 to 100."
                      : discountType === "FIXED"
                        ? "Enter the fixed discount in BDT."
                        : "Free delivery automatically uses 0."}
                  </p>

                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
          )}
        </form.Subscribe>
      </div>

      {/* Minimum Order and Maximum Discount */}
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="minOrderAmount">
          {(field) => (
            <div>
              <label htmlFor="coupon-min-order" className={labelClass}>
                Minimum Order Amount (৳)
              </label>

              <input
                id="coupon-min-order"
                name={field.name}
                type="number"
                min="0"
                step="0.01"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                className={inputClass}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.discountType}>
          {(discountType) => (
            <form.Field name="maxDiscountAmount">
              {(field) => (
                <div>
                  <label htmlFor="coupon-max-discount" className={labelClass}>
                    Maximum Discount (৳)
                    <span className="ml-1 text-xs font-normal text-[#73817b]">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="coupon-max-discount"
                    name={field.name}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="No maximum"
                    disabled={discountType !== "PERCENTAGE"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    className={inputClass}
                  />

                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>
          )}
        </form.Subscribe>
      </div>

      {/* Usage Limits */}
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="usageLimit">
          {(field) => (
            <div>
              <label htmlFor="coupon-usage-limit" className={labelClass}>
                Total Usage Limit
                <span className="ml-1 text-xs font-normal text-[#73817b]">
                  (optional)
                </span>
              </label>

              <input
                id="coupon-usage-limit"
                name={field.name}
                type="number"
                min="1"
                step="1"
                placeholder="Unlimited"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                className={inputClass}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <form.Field name="perUserLimit">
          {(field) => (
            <div>
              <label htmlFor="coupon-per-user-limit" className={labelClass}>
                Per User Limit
                <span className="ml-1 text-xs font-normal text-[#73817b]">
                  (optional)
                </span>
              </label>

              <input
                id="coupon-per-user-limit"
                name={field.name}
                type="number"
                min="1"
                step="1"
                placeholder="Unlimited"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                className={inputClass}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
      </div>

      {/* Coupon Validity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="startDate">
          {(field) => (
            <div>
              <label htmlFor="coupon-start-date" className={labelClass}>
                Start Date & Time *
              </label>

              <input
                id="coupon-start-date"
                name={field.name}
                type="datetime-local"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                className={inputClass}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <form.Field name="expiryDate">
          {(field) => (
            <div>
              <label htmlFor="coupon-expiry-date" className={labelClass}>
                Expiry Date & Time *
              </label>

              <input
                id="coupon-expiry-date"
                name={field.name}
                type="datetime-local"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                className={inputClass}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
      </div>

      {/* Active Status - Only for new coupon */}
      {!isEdit && (
        <form.Field name="isActive">
          {(field) => (
            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#f8faf7] p-4 text-sm">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.target.checked)
                }
                className="h-4 w-4 accent-[#08613f]"
              />

              <span>
                <span className="block font-semibold text-[#052b24]">
                  Activate coupon immediately
                </span>

                <span className="mt-1 block text-xs text-[#73817b]">
                  You can change the status later.
                </span>
              </span>
            </label>
          )}
        </form.Field>
      )}

      {/* Form Buttons */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[#edf0ec] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="h-11 rounded-full border border-[#d5ddd8] px-5 text-sm font-semibold disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="h-11 rounded-full bg-[#ffcc00] px-6 text-sm font-semibold text-[#052b24] hover:bg-[#f2c200] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Saving..."
            : coupon
              ? "Update Coupon"
              : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}
