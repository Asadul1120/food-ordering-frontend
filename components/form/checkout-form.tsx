"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useCart } from "@/hooks/cart.hook";
import { useCreateOrder, useInitiatePayment } from "@/hooks/order.hook";

import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/validation/checkout.validation";

import { getErrorMessage, getFieldError } from "@/lib/utils";

// Reusable input styling
const inputClass =
  "h-[42px] w-full rounded-[12px] border border-[#d5ddd8] bg-white px-4 text-[13px] text-[#052b24] outline-none transition focus:border-[#08613f] focus:ring-2 focus:ring-[#08613f]/10";

const labelClass = "mb-[6px] block text-[13px] font-medium text-[#052b24]";

const cardClass =
  "rounded-[17px] border border-[#edf0ec] bg-white p-6 shadow-[0_1px_3px_rgba(15,45,30,0.10)]";

const paymentOptions = [
  {
    value: "CASH_ON_DELIVERY",
    title: "Cash on Delivery",
    description: "Pay when your food arrives",
    enabled: true,
  },
  {
    value: "SSLCOMMERZ",
    title: "Card / Mobile Banking",
    description: "via SSLCommerz",
    enabled: false,
  },
  {
    value: "BKASH",
    title: "bKash",
    description: "Pay with your bKash account",
    enabled: true,
  },
  {
    value: "NAGAD",
    title: "Nagad",
    description: "Pay with your Nagad account",
    enabled: false,
  },
] as const;

function FieldError({ errors }: { errors: readonly unknown[] }) {
  const error = getFieldError(errors);

  if (!error) return null;

  return (
    <p role="alert" className="mt-1 text-[12px] text-red-500">
      {error}
    </p>
  );
}

function StepHeading({
  number,
  title,
  required = false,
  optional = false,
}: {
  number: number;
  title: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#08613f] text-[13px] font-semibold text-white">
        {number}
      </span>

      <h2 className="text-[17px] font-semibold text-[#052b24]">
        {title}

        {required && <span className="ml-1 text-red-500">*</span>}

        {optional && (
          <span className="ml-2 text-[12px] font-normal text-[#73817b]">
            (optional)
          </span>
        )}
      </h2>
    </div>
  );
}

export default function CheckoutForm() {
  const { items } = useCart();
  const queryClient = useQueryClient();

  const orderMutation = useCreateOrder();
  const paymentMutation = useInitiatePayment();

  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    orderNumber: string;
    paymentMethod: "CASH_ON_DELIVERY" | "BKASH";
  } | null>(null);

  const isSubmitting = orderMutation.isPending || paymentMutation.isPending;

  // Current cart total
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  // Backend currently sets delivery charge to zero
  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge;

  const formatPrice = (amount: number) => {
    return amount.toLocaleString("en-BD", {
      maximumFractionDigits: 2,
    });
  };

  // Start bKash checkout
  const startBkashPayment = async (orderId: string) => {
    const response = await paymentMutation.mutateAsync(orderId);
    const url = response.data?.checkoutUrl;

    if (!url || !url.startsWith("https://")) {
      throw new Error("bKash checkout URL is unavailable");
    }

    window.location.assign(url);
  };

  const form = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      paymentMethod: "CASH_ON_DELIVERY",
      orderNote: "",
    } as CheckoutFormValues,

    validators: {
      onSubmit: checkoutSchema,
    },

    onSubmit: async ({ value }) => {
      if (items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // Combine address fields because the backend
      // accepts one deliveryAddress string
      const deliveryAddress = [
        value.address,
        value.addressLine2,
        value.city,
        value.postalCode,
      ]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(", ");

      if (deliveryAddress.length > 500) {
        toast.error("Delivery address is too long");
        return;
      }

      const couponCode = sessionStorage.getItem("freshlya-coupon");

      const payload = {
        customerName: value.fullName.trim(),
        customerPhone: value.phone.trim(),
        deliveryAddress,
        paymentMethod: value.paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        ...(value.orderNote.trim() && {
          orderNote: value.orderNote.trim(),
        }),
        ...(couponCode && {
          couponCode,
        }),
      };

      try {
        const response = await orderMutation.mutateAsync(payload);

        const order = response.data;

        if (!order?.id || !order?.orderNumber) {
          throw new Error("Order response is incomplete");
        }

        // Save the order number for confirmation
        setCompletedOrder({
          id: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: value.paymentMethod,
        });

        // bKash requires online payment
        if (value.paymentMethod === "BKASH") {
          try {
            await startBkashPayment(order.id);
          } catch (error) {
            toast.error(getErrorMessage(error));
          }

          return;
        }

        // Cash on Delivery order was created successfully
        localStorage.setItem("freshlya-cart", "[]");

        queryClient.setQueryData(["cart"], []);

        sessionStorage.removeItem("freshlya-coupon");

        toast.success("Order placed successfully!");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  // Show confirmation after creating an order
  if (completedOrder) {
    const isBkash = completedOrder.paymentMethod === "BKASH";

    return (
      <div className={`${cardClass} max-w-[700px]`}>
        <h2 className="text-[24px] font-semibold text-[#052b24]">
          {isBkash
            ? "Order created — payment pending"
            : "Order placed successfully!"}
        </h2>

        <p className="mt-3 text-[14px] text-[#73817b]">Your order number:</p>

        <p className="mt-1 break-all text-[16px] font-semibold text-[#08613f]">
          {completedOrder.orderNumber}
        </p>

        <p className="mt-4 text-[14px] text-[#52645b]">
          {isBkash
            ? "Complete your bKash payment to finish paying for this order."
            : "Your order has been received. Please save your order number for tracking."}
        </p>

        {isBkash ? (
          <button
            type="button"
            disabled={paymentMutation.isPending}
            onClick={async () => {
              try {
                await startBkashPayment(completedOrder.id);
              } catch (error) {
                toast.error(getErrorMessage(error));
              }
            }}
            className="mt-6 rounded-full bg-[#ffcc00] px-6 py-3 text-[14px] font-semibold text-[#052b24] disabled:opacity-60"
          >
            {paymentMutation.isPending
              ? "Connecting to bKash..."
              : "Continue bKash Payment"}
          </button>
        ) : (
          <Link
            href="/foods"
            className="mt-6 inline-flex rounded-full bg-[#ffcc00] px-6 py-3 text-[14px] font-semibold text-[#052b24]"
          >
            Back to Menu
          </Link>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        void form.handleSubmit();
      }}
      className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      {/* Left Side */}
      <div className="min-w-0 space-y-6">
        {/* Step 1: Delivery Address */}
        <section className={cardClass}>
          <StepHeading number={1} title="Delivery Address" />

          <div className="mt-4 rounded-[13px] bg-[#edf7f1] px-4 py-4 text-[12px] leading-5 text-[#52645b]">
            No account needed — just fill in your details below. Have an
            account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#00603f] underline"
            >
              Login
            </Link>{" "}
            to use your saved addresses.
          </div>

          <p className="mt-3 text-[12px] text-[#73817b]">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>

          <div className="mt-5 space-y-[18px]">
            {/* Name and Mobile */}
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="fullName">
                {(field) => (
                  <div>
                    <label htmlFor="checkout-name" className={labelClass}>
                      Full name <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="checkout-name"
                      name={field.name}
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. Rahim Uddin"
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

              <form.Field name="phone">
                {(field) => (
                  <div>
                    <label htmlFor="checkout-phone" className={labelClass}>
                      Mobile number <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="checkout-phone"
                      name={field.name}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className={inputClass}
                    />

                    <p className="mt-1 text-[11px] text-[#73817b]">
                      We'll call this number if we need to confirm your
                      delivery.
                    </p>

                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Email */}
            <form.Field name="email">
              {(field) => (
                <div>
                  <label htmlFor="checkout-email" className={labelClass}>
                    Email{" "}
                    <span className="font-normal text-[#73817b]">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="checkout-email"
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className={inputClass}
                  />

                  <p className="mt-1 text-[11px] text-[#73817b]">
                    We'll send your order receipt here.
                  </p>

                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            {/* Main Address */}
            <form.Field name="address">
              {(field) => (
                <div>
                  <label htmlFor="checkout-address" className={labelClass}>
                    Address <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="checkout-address"
                    name={field.name}
                    type="text"
                    autoComplete="address-line1"
                    required
                    placeholder="House, road, area"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className={inputClass}
                  />

                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            {/* Address Line 2 */}
            <form.Field name="addressLine2">
              {(field) => (
                <div>
                  <label htmlFor="checkout-address-2" className={labelClass}>
                    Address line 2{" "}
                    <span className="font-normal text-[#73817b]">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="checkout-address-2"
                    name={field.name}
                    type="text"
                    autoComplete="address-line2"
                    placeholder="Flat, floor, landmark"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className={inputClass}
                  />

                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            {/* City and Postal Code */}
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="city">
                {(field) => (
                  <div>
                    <label htmlFor="checkout-city" className={labelClass}>
                      City <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="checkout-city"
                      name={field.name}
                      type="text"
                      autoComplete="address-level2"
                      required
                      placeholder="e.g. Savar"
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

              <form.Field name="postalCode">
                {(field) => (
                  <div>
                    <label htmlFor="checkout-postal" className={labelClass}>
                      Postal code{" "}
                      <span className="font-normal text-[#73817b]">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="checkout-postal"
                      name={field.name}
                      type="text"
                      autoComplete="postal-code"
                      placeholder="e.g. 1340"
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
          </div>
        </section>

        {/* Step 2: Payment Method */}
        <section className={cardClass}>
          <StepHeading number={2} title="Payment Method" required />

          <form.Field name="paymentMethod">
            {(field) => (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => {
                  const selected = field.state.value === option.value;

                  return (
                    <label
                      key={option.value}
                      title={
                        option.enabled
                          ? undefined
                          : "Payment method coming soon"
                      }
                      className={`flex min-h-[76px] items-center gap-3 rounded-[13px] border px-4 py-3 ${
                        selected
                          ? "border-2 border-[#08613f] bg-[#edf7f1]"
                          : "border-[#e6ebe7] bg-white"
                      } ${
                        option.enabled ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={selected}
                        disabled={!option.enabled}
                        onBlur={field.handleBlur}
                        onChange={() => {
                          if (
                            option.value === "CASH_ON_DELIVERY" ||
                            option.value === "BKASH"
                          ) {
                            field.handleChange(option.value);
                          }
                        }}
                        className="h-[14px] w-[14px] shrink-0 accent-[#08613f]"
                      />

                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-[#052b24]">
                          {option.title}
                        </span>

                        <span className="block text-[12px] leading-5 text-[#73817b]">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </form.Field>
        </section>

        {/* Step 3: Order Notes */}
        <section className={cardClass}>
          <StepHeading number={3} title="Order Notes" optional />

          <form.Field name="orderNote">
            {(field) => (
              <div className="mt-4">
                <textarea
                  name={field.name}
                  rows={3}
                  maxLength={500}
                  placeholder="Delivery instructions, spice level, allergies..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="min-h-[82px] w-full resize-y rounded-[12px] border border-[#d5ddd8] bg-white px-4 py-3 text-[13px] text-[#052b24] outline-none placeholder:text-[#73817b] focus:border-[#08613f] focus:ring-2 focus:ring-[#08613f]/10"
                />

                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>
        </section>
      </div>

      {/* Right Side: Order Summary */}
      <aside className={`${cardClass} lg:sticky lg:top-6`}>
        <h2 className="text-[20px] font-semibold text-[#052b24]">
          Order Summary
        </h2>

        {/* Products */}
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-[13px] text-[#73817b]">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between gap-3 text-[13px]"
              >
                <span className="min-w-0 text-[#52645b]">
                  <span className="font-medium text-[#052b24]">
                    {item.quantity}x
                  </span>{" "}
                  {item.name}
                </span>

                <span className="shrink-0 font-medium text-[#052b24]">
                  ৳{formatPrice(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="my-4 h-px bg-[#edf0ec]" />

        {/* Subtotal */}
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between gap-3">
            <span className="text-[#73817b]">Subtotal</span>
            <span className="font-medium text-[#052b24]">
              ৳{formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-[#73817b]">Delivery</span>
            <span className="font-medium text-[#052b24]">
              ৳{formatPrice(deliveryCharge)}
            </span>
          </div>
        </div>

        <div className="my-4 h-px bg-[#edf0ec]" />

        {/* Total */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[17px] font-semibold text-[#052b24]">
            Total
          </span>

          <span className="text-[17px] font-semibold text-[#08613f]">
            ৳{formatPrice(total)}
          </span>
        </div>

        {/* Pre-order Notice */}
        <div className="mt-4 rounded-full bg-[#fff7dc] px-3 py-2 text-center text-[11px] font-medium text-[#052b24]">
          Pre-order · we start cooking at 3PM tomorrow
        </div>

        {/* Place Order */}
        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="mt-4 flex h-[52px] w-full items-center justify-center rounded-full bg-[#ffcc00] text-[15px] font-semibold text-[#052b24] transition hover:bg-[#f2c200] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : "Place Pre-order"}
        </button>

        {/* Terms */}
        <p className="mt-3 text-center text-[11px] leading-4 text-[#73817b]">
          By placing your order you agree to our{" "}
          <span className="underline">Terms &amp; Conditions</span> and{" "}
          <span className="underline">Refund &amp; Cancellation.</span>
        </p>
      </aside>
    </form>
  );
}
