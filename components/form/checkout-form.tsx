"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { useCart } from "@/hooks/cart.hook";
import { useCreateOrder, useInitiatePayment } from "@/hooks/order.hook";
import { useValidateCoupon } from "@/hooks/coupon.hook";

import type { CouponValidationResult } from "@/types/coupon.type";

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

// Available payment methods
const paymentOptions = [
  {
    value: "CASH_ON_DELIVERY",
    title: "Cash on Delivery",
    description: "Pay when your food arrives",
  },
  {
    value: "BKASH",
    title: "bKash",
    description: "Pay with your bKash account",
  },
] as const;

// Field error component
function FieldError({ errors }: { errors: readonly unknown[] }) {
  const error = getFieldError(errors);

  if (!error) return null;

  return (
    <p role="alert" className="mt-1 text-[12px] text-red-500">
      {error}
    </p>
  );
}

// Step heading component
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
  const { items, clearCart } = useCart();

  const orderMutation = useCreateOrder();
  const paymentMutation = useInitiatePayment();
  const couponMutation = useValidateCoupon();

  // Store validated coupon information
  const [appliedCoupon, setAppliedCoupon] =
    useState<CouponValidationResult | null>(null);

  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // Prepare cart items for coupon validation
  const couponItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    [items],
  );

  const validateCoupon = couponMutation.mutateAsync;

  // Revalidate saved coupon when checkout opens or cart changes
  useEffect(() => {
    const savedCode = sessionStorage.getItem("freshlya-coupon");

    if (!savedCode || items.length === 0) {
      setAppliedCoupon(null);
      setCheckingCoupon(false);
      return;
    }

    let isCurrentRequest = true;

    setAppliedCoupon(null);
    setCheckingCoupon(true);

    validateCoupon({
      code: savedCode,
      items: couponItems,
    })
      .then((result) => {
        if (!isCurrentRequest) return;

        setAppliedCoupon(result);

        sessionStorage.setItem("freshlya-coupon", result.code);
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;

        sessionStorage.removeItem("freshlya-coupon");

        setAppliedCoupon(null);

        toast.error(`Coupon is no longer valid: ${getErrorMessage(error)}`);
      })
      .finally(() => {
        if (isCurrentRequest) {
          setCheckingCoupon(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [items, couponItems, validateCoupon]);

  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    orderNumber: string;
    paymentMethod: "CASH_ON_DELIVERY" | "BKASH";
    guestToken: string | null;
  } | null>(null);

  // Check whether any checkout operation is running
  const isSubmitting =
    orderMutation.isPending ||
    paymentMutation.isPending ||
    couponMutation.isPending ||
    checkingCoupon;

  // Calculate cart subtotal
  const cartSubtotal = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  // Use backend-calculated values when coupon is applied
  const subtotal = appliedCoupon
    ? Number(appliedCoupon.subtotal)
    : cartSubtotal;

  const discountAmount = appliedCoupon
    ? Number(appliedCoupon.discountAmount)
    : 0;

  const deliveryCharge = appliedCoupon
    ? Number(appliedCoupon.deliveryCharge)
    : 0;

  const total = appliedCoupon
    ? Number(appliedCoupon.totalAmount)
    : cartSubtotal + deliveryCharge;

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    sessionStorage.removeItem("freshlya-coupon");

    setAppliedCoupon(null);

    toast.info("Coupon removed");
  };

  // Format price
  const formatPrice = (amount: number) => {
    return amount.toLocaleString("en-BD", {
      maximumFractionDigits: 2,
    });
  };

  // Start bKash checkout
  const startBkashPayment = async (
    orderId: string,
    guestToken?: string | null,
  ) => {
    const response = await paymentMutation.mutateAsync({
      orderId,
      guestToken,
    });

    const payment = response.data;

    if (!payment?.requiresOnlinePayment) {
      throw new Error("Online payment is unavailable");
    }

    const url = payment.checkoutUrl;

    if (!url || !url.startsWith("https://")) {
      throw new Error("bKash checkout URL is unavailable");
    }

    // Redirect customer to bKash payment page
    window.location.assign(url);
  };

  // Checkout form
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
      if (completedOrder) return;

      if (items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // Combine all delivery address fields
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

      try {
        // Get coupon code saved from cart page
        let couponCode = sessionStorage.getItem("freshlya-coupon");

        // Validate coupon again before creating order
        // Backend will also validate and redeem it during order creation
        if (couponCode) {
          try {
            const couponResult = await validateCoupon({
              code: couponCode,
              items: couponItems,
            });

            couponCode = couponResult.code;

            sessionStorage.setItem("freshlya-coupon", couponCode);

            setAppliedCoupon(couponResult);
          } catch (error) {
            sessionStorage.removeItem("freshlya-coupon");

            setAppliedCoupon(null);

            toast.error(
              `Coupon could not be applied: ${getErrorMessage(error)}`,
            );

            return;
          }
        }

        // Prepare order payload
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

        // Create order
        const response = await orderMutation.mutateAsync(payload);

        const order = response.data;

        if (!order?.id || !order?.orderNumber) {
          throw new Error("Order response is incomplete");
        }

        // Save created order information
        const orderData = {
          id: order.id,
          orderNumber: order.orderNumber,
          paymentMethod: value.paymentMethod,
          guestToken: order.guestToken ?? null,
        };

        setCompletedOrder(orderData);

        // Backend has redeemed the coupon for this order
        // Remove it so it cannot be used for another order
        sessionStorage.removeItem("freshlya-coupon");

        setAppliedCoupon(null);

        // bKash online payment
        if (value.paymentMethod === "BKASH") {
          const pendingPayment = {
            id: order.id,
            orderNumber: order.orderNumber,
            guestToken: order.guestToken ?? null,
          };

          sessionStorage.setItem(
            "freshlya-pending-payment",
            JSON.stringify(pendingPayment),
          );

          try {
            await startBkashPayment(order.id, pendingPayment.guestToken);
          } catch (error) {
            toast.error(getErrorMessage(error));
          }

          return;
        }

        // Cash on Delivery
        clearCart();

        toast.success("Order placed successfully!");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  // Show order confirmation
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

        {/* Payment Method */}
        <div className="mt-4 rounded-[12px] bg-[#edf7f1] p-4">
          <p className="text-[12px] text-[#73817b]">Payment Method</p>

          <p className="mt-1 text-[14px] font-semibold text-[#052b24]">
            {isBkash ? "bKash" : "Cash on Delivery"}
          </p>
        </div>

        <p className="mt-4 text-[14px] text-[#52645b]">
          {isBkash
            ? "Complete your bKash payment to confirm your order."
            : "Your order has been received. Please save your order number for tracking."}
        </p>

        {/* Continue bKash Payment */}
        {isBkash ? (
          <button
            type="button"
            disabled={paymentMutation.isPending}
            onClick={async () => {
              try {
                sessionStorage.setItem(
                  "freshlya-pending-payment",
                  JSON.stringify(completedOrder),
                );

                await startBkashPayment(
                  completedOrder.id,
                  completedOrder.guestToken,
                );
              } catch (error) {
                toast.error(getErrorMessage(error));
              }
            }}
            className="mt-6 rounded-full bg-[#ffcc00] px-6 py-3 text-[14px] font-semibold text-[#052b24] transition hover:bg-[#f2c200] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paymentMutation.isPending
              ? "Connecting to bKash..."
              : "Continue bKash Payment"}
          </button>
        ) : (
          <Link
            href="/foods"
            className="mt-6 inline-flex rounded-full bg-[#ffcc00] px-6 py-3 text-[14px] font-semibold text-[#052b24] transition hover:bg-[#f2c200]"
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
            before placing your order.
          </div>

          <p className="mt-3 text-[12px] text-[#73817b]">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>

          <div className="mt-5 space-y-[18px]">
            {/* Name and Mobile */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full Name */}
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

              {/* Mobile Number */}
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
              {/* City */}
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

              {/* Postal Code */}
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
              <div className="mt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentOptions.map((option) => {
                    const selected = field.state.value === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex min-h-[76px] cursor-pointer items-center gap-3 rounded-[13px] border px-4 py-3 transition ${
                          selected
                            ? "border-2 border-[#08613f] bg-[#edf7f1]"
                            : "border-[#e6ebe7] bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={option.value}
                          checked={selected}
                          onBlur={field.handleBlur}
                          onChange={() => field.handleChange(option.value)}
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

                {/* Payment instruction */}
                <div className="mt-4 rounded-[12px] bg-[#edf7f1] px-4 py-3">
                  <p className="text-[12px] leading-5 text-[#52645b]">
                    {field.state.value === "BKASH"
                      ? "You will be redirected to the secure bKash payment page after placing your order."
                      : "Pay for your order in cash when your food arrives."}
                  </p>
                </div>

                <FieldError errors={field.state.meta.errors} />
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

        {/* Coupon Validation Loading */}
        {checkingCoupon && (
          <p className="mt-3 text-[12px] text-[#73817b]">
            Checking your applied coupon...
          </p>
        )}

        {/* Applied Coupon */}
        {appliedCoupon && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] bg-[#edf7f1] px-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#08613f]">
                Coupon applied: {appliedCoupon.code}
              </p>

              <p className="mt-1 text-[11px] text-[#52645b]">
                {appliedCoupon.discountType === "PERCENTAGE"
                  ? "Percentage discount"
                  : appliedCoupon.discountType === "FIXED"
                    ? "Fixed amount discount"
                    : "Free delivery coupon"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemoveCoupon}
              disabled={isSubmitting}
              className="shrink-0 text-[11px] font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}

        {/* Subtotal, Discount and Delivery Charge */}
        <div className="mt-4 space-y-2 text-[13px]">
          <div className="flex justify-between gap-3">
            <span className="text-[#73817b]">Subtotal</span>

            <span className="font-medium text-[#052b24]">
              ৳{formatPrice(subtotal)}
            </span>
          </div>

          {/* Coupon Discount */}
          {appliedCoupon && (
            <div className="flex justify-between gap-3">
              <span className="text-[#08613f]">
                {appliedCoupon.discountType === "FREE_DELIVERY"
                  ? "Free delivery"
                  : "Coupon discount"}
              </span>

              <span className="font-semibold text-[#08613f]">
                {appliedCoupon.discountType === "FREE_DELIVERY"
                  ? "Applied"
                  : `-৳${formatPrice(discountAmount)}`}
              </span>
            </div>
          )}

          {/* Delivery Charge */}
          <div className="flex justify-between gap-3">
            <span className="text-[#73817b]">Delivery</span>

            <span className="font-medium text-[#052b24]">
              {appliedCoupon?.discountType === "FREE_DELIVERY"
                ? "Free"
                : `৳${formatPrice(deliveryCharge)}`}
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

        {/* Place Order Button */}
        <form.Subscribe selector={(state) => state.values.paymentMethod}>
          {(paymentMethod) => (
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="mt-4 flex h-[52px] w-full items-center justify-center rounded-full bg-[#ffcc00] text-[15px] font-semibold text-[#052b24] transition hover:bg-[#f2c200] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Processing..."
                : paymentMethod === "BKASH"
                  ? "Continue to bKash"
                  : "Place Pre-order"}
            </button>
          )}
        </form.Subscribe>

        {/* Terms and Conditions */}
        <p className="mt-3 text-center text-[11px] leading-4 text-[#73817b]">
          By placing your order you agree to our{" "}
          <span className="underline">Terms &amp; Conditions</span> and{" "}
          <span className="underline">Refund &amp; Cancellation.</span>
        </p>
      </aside>
    </form>
  );
}
