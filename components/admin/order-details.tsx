"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { useAdminOrder } from "@/hooks/admin.hook";

import {
  formatAdminMoney,
  statusLabels,
} from "@/lib/admin";

import { getErrorMessage } from "@/lib/utils";

type OrderDetailsProps = {
  id: string;
  onClose: () => void;
};

export default function OrderDetails({
  id,
  onClose,
}: OrderDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const orderQuery = useAdminOrder(id);
  const order = orderQuery.data;

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      aria-labelledby="order-details-title"
      className="fixed inset-0 m-auto max-h-[85vh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto rounded-3xl border-0 bg-white p-6 text-[#052b24] shadow-xl backdrop:bg-black/40"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2
          id="order-details-title"
          className="text-xl font-bold"
        >
          Order details
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close order details"
          className="rounded-full bg-[#edf7f1] p-2"
        >
          <X size={18} />
        </button>
      </div>

      {orderQuery.isPending ? (
        <p role="status">Loading order...</p>
      ) : orderQuery.isError ? (
        <div role="alert">
          <p>{getErrorMessage(orderQuery.error)}</p>

          <button
            type="button"
            onClick={() => void orderQuery.refetch()}
            className="mt-3 text-sm underline"
          >
            Retry
          </button>
        </div>
      ) : order ? (
        <>
          <p className="break-all text-xs text-[#73817b]">
            {order.orderNumber}
          </p>

          <p className="mt-2 text-sm font-semibold">
            {statusLabels[order.orderStatus]}
          </p>

          <div className="my-5 rounded-2xl bg-[#edf7f1] p-4 text-sm leading-6">
            <p className="font-semibold">
              {order.customerName}
            </p>

            <p>{order.customerPhone}</p>

            <p className="whitespace-pre-wrap break-words">
              {order.deliveryAddress}
            </p>

            {order.orderNote && (
              <p className="mt-2 break-words">
                Note: {order.orderNote}
              </p>
            )}
          </div>

          <div className="divide-y divide-[#edf0ec]">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {item.productName}
                  </p>

                  <p className="mt-1 text-xs text-[#73817b]">
                    {item.quantity} ×{" "}
                    {formatAdminMoney(item.productPrice)}
                  </p>
                </div>

                <p className="shrink-0 font-semibold">
                  {formatAdminMoney(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatAdminMoney(order.subtotal)}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>
                −{formatAdminMoney(order.discountAmount)}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>
                {formatAdminMoney(order.deliveryCharge)}
              </dd>
            </div>

            <div className="flex justify-between text-base font-bold">
              <dt>Total</dt>
              <dd>{formatAdminMoney(order.totalAmount)}</dd>
            </div>
          </dl>

          <h3 className="mb-2 mt-6 text-sm font-semibold">
            Payments
          </h3>

          {order.payments.map((payment) => (
            <p
              key={payment.id}
              className="py-1 text-xs text-[#73817b]"
            >
              {payment.paymentMethod.replaceAll("_", " ")}
              {" · "}
              {payment.paymentStatus}
              {" · "}
              {formatAdminMoney(payment.amount)}
            </p>
          ))}
        </>
      ) : null}
    </dialog>
  );
}