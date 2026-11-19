"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AlertCircle, CheckCircle2, LoaderCircle, XCircle } from "lucide-react";

import { useCart } from "@/hooks/cart.hook";
import { useInitiatePayment } from "@/hooks/order.hook";
import { useVerifyPayment } from "@/hooks/payment.hook";

import type {
  BkashCallbackStatus,
  VerifiedPayment,
} from "@/types/payment.type";

import { getErrorMessage } from "@/lib/utils";

type CallbackViewStatus =
  | "processing"
  | "success"
  | "failed"
  | "cancelled"
  | "pending"
  | "error";

interface PendingOrder {
  id: string;
  orderNumber: string;
  guestToken?: string | null;
}

const cardClass =
  "w-full max-w-[560px] rounded-[18px] border border-[#edf0ec] bg-white p-7 text-center shadow-[0_1px_3px_rgba(15,45,30,0.10)] sm:p-9";

// Get pending order information
function readPendingOrder(): PendingOrder | null {
  try {
    const savedOrder = sessionStorage.getItem("freshlya-pending-payment");

    if (!savedOrder) return null;

    const order = JSON.parse(savedOrder) as Partial<PendingOrder>;

    if (typeof order.id !== "string" || typeof order.orderNumber !== "string") {
      return null;
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      guestToken: order.guestToken ?? null,
    };
  } catch {
    return null;
  }
}

// Validate bKash callback status
function getCallbackStatus(value: string | null): BkashCallbackStatus | null {
  const status = value?.toLowerCase();

  if (status === "success" || status === "failure" || status === "cancel") {
    return status;
  }

  return null;
}

function CallbackContent() {
  const searchParams = useSearchParams();

  const paymentID =
    searchParams.get("paymentID") || searchParams.get("paymentId");

  const callbackStatus = getCallbackStatus(searchParams.get("status"));

  const { clearCart } = useCart();

  const verifyMutation = useVerifyPayment();
  const initiateMutation = useInitiatePayment();

  const processedRequest = useRef<string | null>(null);

  const [viewStatus, setViewStatus] =
    useState<CallbackViewStatus>("processing");

  const [message, setMessage] = useState(
    "Please wait while we verify your bKash transaction.",
  );

  const [orderNumber, setOrderNumber] = useState("");

  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);

  const [retryCount, setRetryCount] = useState(0);

  // Automatically verify payment after returning from bKash
  useEffect(() => {
    const requestKey = `${paymentID ?? ""}:${callbackStatus ?? ""}:${retryCount}`;

    if (processedRequest.current === requestKey) return;

    processedRequest.current = requestKey;

    if (!paymentID) {
      setViewStatus("error");
      setMessage(
        "Payment ID was not found. Please contact support if money was deducted.",
      );
      return;
    }

    if (!callbackStatus) {
      setViewStatus("error");
      setMessage(
        "Invalid bKash callback status. Please contact support if money was deducted.",
      );
      return;
    }

    // Recover order information from session storage
    const savedOrder = readPendingOrder();

    if (savedOrder) {
      setPendingOrder(savedOrder);
      setOrderNumber(savedOrder.orderNumber);
    }

    const verify = async () => {
      setViewStatus("processing");

      setMessage("Please wait while we verify your bKash transaction.");

      try {
        const response = await verifyMutation.mutateAsync({
          paymentID,
          status: callbackStatus,
        });

        const payment: VerifiedPayment | undefined = response.data;

        if (!payment?.paymentStatus) {
          throw new Error("Payment verification response is incomplete");
        }

        // Payment successfully verified
        if (payment.paymentStatus === "PAID") {
          // Clear cart only after backend confirms payment
          clearCart();

          sessionStorage.removeItem("freshlya-coupon");

          sessionStorage.removeItem("freshlya-pending-payment");

          setViewStatus("success");

          setMessage("Your bKash payment has been verified successfully.");

          if (payment.orderNumber) {
            setOrderNumber(payment.orderNumber);
          }

          return;
        }

        // Payment failed
        if (payment.paymentStatus === "FAILED") {
          setViewStatus(callbackStatus === "cancel" ? "cancelled" : "failed");

          setMessage(
            callbackStatus === "cancel"
              ? "You cancelled the bKash payment. No successful payment was recorded."
              : "Your bKash payment was not completed. You can try again.",
          );

          return;
        }

        // Payment is still pending
        if (payment.paymentStatus === "PENDING") {
          setViewStatus("pending");

          setMessage(
            "The payment is not confirmed yet. Please verify again before trying another payment.",
          );

          return;
        }

        setViewStatus("error");

        setMessage("We could not confirm the final payment status.");
      } catch (error) {
        setViewStatus("error");
        setMessage(getErrorMessage(error));
      }
    };

    void verify();
  }, [
    paymentID,
    callbackStatus,
    retryCount,
    verifyMutation.mutateAsync,
    clearCart,
  ]);

  // Retry payment after failure or cancellation
  const handleRetryPayment = async () => {
    if (!pendingOrder) {
      setMessage(
        "The original order information is unavailable in this browser. Please contact support with your order number.",
      );
      return;
    }

    try {
      const response = await initiateMutation.mutateAsync({
        orderId: pendingOrder.id,
        guestToken: pendingOrder.guestToken,
      });

      const payment = response.data;

      const checkoutUrl = payment?.checkoutUrl;

      if (
        !payment?.requiresOnlinePayment ||
        !checkoutUrl ||
        !checkoutUrl.startsWith("https://")
      ) {
        throw new Error("bKash checkout URL is unavailable");
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  // Retry payment verification
  const handleVerifyAgain = () => {
    processedRequest.current = null;

    setRetryCount((count) => count + 1);
  };

  const isBusy = viewStatus === "processing" || initiateMutation.isPending;

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#f8faf8] px-4 py-12">
      <section className={cardClass}>
        {/* Status Icon */}
        <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#edf7f1]">
          {viewStatus === "processing" && (
            <LoaderCircle className="h-8 w-8 animate-spin text-[#08613f]" />
          )}

          {viewStatus === "success" && (
            <CheckCircle2 className="h-9 w-9 text-[#16815e]" />
          )}

          {(viewStatus === "failed" || viewStatus === "cancelled") && (
            <XCircle className="h-9 w-9 text-red-500" />
          )}

          {(viewStatus === "pending" || viewStatus === "error") && (
            <AlertCircle className="h-9 w-9 text-amber-500" />
          )}
        </div>

        {/* Heading */}
        <h1 className="mt-5 text-[23px] font-semibold text-[#052b24]">
          {viewStatus === "processing" && "Verifying your payment"}

          {viewStatus === "success" && "Payment successful!"}

          {viewStatus === "failed" && "Payment failed"}

          {viewStatus === "cancelled" && "Payment cancelled"}

          {viewStatus === "pending" && "Payment is pending"}

          {viewStatus === "error" && "Unable to verify payment"}
        </h1>

        {/* Message */}
        <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-6 text-[#64736b]">
          {message}
        </p>

        {/* Order Number */}
        {orderNumber && (
          <div className="mt-5 rounded-[12px] bg-[#f3f7f4] px-4 py-3">
            <p className="text-[11px] text-[#73817b]">Order number</p>

            <p className="mt-1 break-all text-[15px] font-semibold text-[#08613f]">
              {orderNumber}
            </p>
          </div>
        )}

        {viewStatus === "success" && (
          <p className="mt-4 text-[12px] text-[#16815e]">
            Your order is now confirmed.
          </p>
        )}

        {viewStatus === "processing" && (
          <p className="mt-5 text-[12px] text-[#73817b]">
            Do not close this page while verification is in progress.
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {(viewStatus === "pending" || viewStatus === "error") &&
            paymentID && (
              <button
                type="button"
                onClick={handleVerifyAgain}
                disabled={isBusy}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#08613f] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#064d33] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LoaderCircle className="h-4 w-4" />
                Verify Again
              </button>
            )}

          {(viewStatus === "failed" || viewStatus === "cancelled") &&
            pendingOrder && (
              <button
                type="button"
                onClick={handleRetryPayment}
                disabled={initiateMutation.isPending}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#ffcc00] px-6 py-3 text-[13px] font-semibold text-[#052b24] transition hover:bg-[#f2c200] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {initiateMutation.isPending
                  ? "Connecting to bKash..."
                  : "Try bKash Payment Again"}
              </button>
            )}

          <Link
            href="/foods"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#d5ddd8] px-6 py-3 text-[13px] font-semibold text-[#052b24] transition hover:bg-[#f5f8f6]"
          >
            Back to Menu
          </Link>
        </div>
      </section>
    </main>
  );
}

// Suspense loading component
function CallbackLoading() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#f8faf8] px-4 py-12">
      <div className={cardClass}>
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#08613f]" />

        <p className="mt-4 text-[14px] text-[#64736b]">
          Loading payment information...
        </p>
      </div>
    </main>
  );
}

export default function BkashCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackContent />
    </Suspense>
  );
}
