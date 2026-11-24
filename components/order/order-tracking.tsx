"use client";

import { useState, type FormEvent } from "react";

import {
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  RefreshCw,
  UserRound,
  XCircle,
} from "lucide-react";

import { useOrderTracking } from "@/hooks/order.hook";

import { formatAdminDate, statusColors, statusLabels } from "@/lib/admin";

import { getErrorMessage } from "@/lib/utils";

export default function OrderTracking() {
  // Customer input
  const [orderNumber, setOrderNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Submitted search information
  const [searchedOrderNumber, setSearchedOrderNumber] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");

  // Fetch order from backend
  const trackingQuery = useOrderTracking(searchedOrderNumber, searchedPhone);

  const order = trackingQuery.data;

  // Search order
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = orderNumber.trim().toUpperCase();
    const phone = mobileNumber.trim();

    if (!code || !phone) {
      return;
    }

    // Save submitted values
    setSearchedOrderNumber(code);
    setSearchedPhone(phone);
  };

  // Refresh tracking information
  const handleRefresh = () => {
    void trackingQuery.refetch();
  };

  // Payment information
  const latestPayment = order?.payments?.[0];

  const isSearching = trackingQuery.isFetching;

  return (
    <div className="mx-auto w-full max-w-[512px]">
      {/* Tracking Form */}
      <section className="rounded-[18px] border border-[#edf0ec] bg-white p-6 shadow-[0_1px_3px_rgba(15,45,30,0.10)]">
        <h2 className="text-[17px] font-semibold leading-6 text-[#052b24]">
          Find your order
        </h2>

        <p className="mt-1 text-[14px] leading-5 text-[#73817b]">
          Enter your order number and the mobile number you ordered with.
        </p>

        <form onSubmit={handleSearch} className="mt-5">
          {/* Order Number */}
          <div>
            <label
              htmlFor="tracking-order-number"
              className="mb-2 block text-[14px] font-medium text-[#052b24]"
            >
              Order number <span className="text-red-500">*</span>
            </label>

            <input
              id="tracking-order-number"
              name="orderNumber"
              type="text"
              required
              maxLength={50}
              autoComplete="off"
              placeholder="e.g. FL-261120-4827"
              value={orderNumber}
              onChange={(event) => {
                setOrderNumber(event.target.value.toUpperCase());

                setSearchedOrderNumber("");
                setSearchedPhone("");
              }}
              className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] bg-white px-4 text-[13px] text-[#052b24] outline-none transition placeholder:text-[#73817b] focus:border-[#08613f] focus:ring-2 focus:ring-[#08613f]/10"
            />

            <p className="mt-1 text-[12px] leading-4 text-[#73817b]">
              It's on your order page and in the confirmation email.
            </p>
          </div>

          {/* Mobile Number */}
          <div className="mt-4">
            <label
              htmlFor="tracking-mobile-number"
              className="mb-2 block text-[14px] font-medium text-[#052b24]"
            >
              Mobile number <span className="text-red-500">*</span>
            </label>

            <input
              id="tracking-mobile-number"
              name="mobileNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={16}
              pattern="[+]?[0-9]{8,15}"
              placeholder="01XXXXXXXXX"
              value={mobileNumber}
              onChange={(event) => {
                setMobileNumber(event.target.value);

                setSearchedOrderNumber("");
                setSearchedPhone("");
              }}
              className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] bg-white px-4 text-[13px] text-[#052b24] outline-none transition placeholder:text-[#73817b] focus:border-[#08613f] focus:ring-2 focus:ring-[#08613f]/10"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={
              !orderNumber.trim() || !mobileNumber.trim() || isSearching
            }
            className="mt-4 flex h-[40px] w-full items-center justify-center gap-2 rounded-full bg-[#08613f] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#064d34] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Checking Order...
              </>
            ) : (
              "Track Order"
            )}
          </button>
        </form>

        {/* Error Message */}
        {searchedOrderNumber && trackingQuery.isError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[12px] border border-red-100 bg-red-50 p-3"
          >
            <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

            <div>
              <p className="text-[13px] font-semibold text-red-600">
                Order not found
              </p>

              <p className="mt-1 text-[12px] leading-5 text-red-500">
                {getErrorMessage(trackingQuery.error)}
              </p>

              <p className="mt-1 text-[12px] text-red-500">
                Please check your order number and mobile number.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Order Information */}
      {order && (
        <section className="mt-5 rounded-[18px] border border-[#edf0ec] bg-white p-6 shadow-[0_1px_3px_rgba(15,45,30,0.10)]">
          {/* Order Heading */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#08613f]">
                <CheckCircle2 size={17} />

                <span className="text-[12px] font-semibold">Order found</span>
              </div>

              <h3 className="mt-2 text-[17px] font-bold text-[#052b24]">
                {order.orderNumber}
              </h3>
            </div>

            <span
              className={`rounded-full px-3 py-2 text-[11px] font-semibold ${
                statusColors[order.orderStatus]
              }`}
            >
              {statusLabels[order.orderStatus]}
            </span>
          </div>

          <div className="my-5 h-px bg-[#edf0ec]" />

          {/* Customer Name */}
          <div className="flex items-start gap-3">
            <UserRound size={18} className="mt-0.5 shrink-0 text-[#08613f]" />

            <div>
              <p className="text-[11px] text-[#73817b]">Customer Name</p>

              <p className="mt-1 text-[13px] font-medium text-[#052b24]">
                {order.customerName}
              </p>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="mt-4 flex items-start gap-3">
            <CreditCard size={18} className="mt-0.5 shrink-0 text-[#08613f]" />

            <div>
              <p className="text-[11px] text-[#73817b]">Mobile Number</p>

              <p className="mt-1 text-[13px] font-medium text-[#052b24]">
                {order.customerPhone}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mt-4 flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-[#08613f]" />

            <div>
              <p className="text-[11px] text-[#73817b]">Delivery Address</p>

              <p className="mt-1 text-[13px] leading-5 text-[#052b24]">
                {order.deliveryAddress}
              </p>
            </div>
          </div>

          {/* Order Date */}
          <div className="mt-4 flex items-start gap-3">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-[#08613f]" />

            <div>
              <p className="text-[11px] text-[#73817b]">Order Date</p>

              <p className="mt-1 text-[13px] font-medium text-[#052b24]">
                {formatAdminDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Payment Status */}
          {latestPayment && (
            <div className="mt-5 rounded-[12px] bg-[#f7faf7] p-4">
              <p className="text-[11px] text-[#73817b]">Payment Status</p>

              <p
                className={`mt-1 text-[13px] font-semibold ${
                  latestPayment.paymentStatus === "PAID"
                    ? "text-[#08613f]"
                    : latestPayment.paymentStatus === "FAILED"
                      ? "text-red-500"
                      : "text-amber-700"
                }`}
              >
                {latestPayment.paymentStatus}
              </p>

              {latestPayment.paidAt && (
                <p className="mt-1 text-[11px] text-[#73817b]">
                  Paid on: {formatAdminDate(latestPayment.paidAt)}
                </p>
              )}
            </div>
          )}

          {/* Last Updated */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf0ec] pt-4">
            <p className="text-[11px] text-[#73817b]">
              Last updated: {formatAdminDate(order.updatedAt)}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isSearching}
              aria-label="Refresh order status"
              className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#08613f] disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isSearching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Automatic Update Notice */}
          {order.orderStatus !== "DELIVERED" &&
            order.orderStatus !== "CANCELLED" && (
              <p className="mt-3 text-[11px] text-[#73817b]">
                Order status updates automatically every 15 seconds.
              </p>
            )}
        </section>
      )}
    </div>
  );
}
