"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetMe } from "@/hooks/auth.hook";

import { getErrorMessage } from "@/lib/utils";
import { formatAdminMoney } from "@/lib/admin";

import CustomerOrderCard from "./customer-order-card";
import { useMyOrderById, useMyOrders } from "@/hooks/customer.hook";
import { customerStatusLabels, formatCustomerDate } from "@/lib/customer";

export default function CustomerOrders() {
  const user = useGetMe().data?.data;
  const userId = user?.role === "CUSTOMER" ? user.id : "";
  const orderId = useSearchParams().get("order") ?? "";
  const [page, setPage] = useState(1);
  const orders = useMyOrders(userId, { page, limit: 10 });
  const detail = useMyOrderById(userId, orderId);
  const order = detail.data?.data;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {orderId && (
        <section className="space-y-3 rounded-[17px] border border-[#edf0ec] bg-white p-5 shadow-sm">
          <div className="flex justify-between gap-2">
            <h2 className="font-bold">Order details</h2>
            <Link
              href="/customer/orders"
              className="text-sm text-[#08613f] underline"
            >
              Close
            </Link>
          </div>
          {detail.isPending && <p>Loading order...</p>}
          {detail.isError && (
            <p role="alert">{getErrorMessage(detail.error)}</p>
          )}
          {order && (
            <>
              <p className="font-semibold">
                {order.orderNumber} · {customerStatusLabels[order.orderStatus]}
              </p>
              <p className="text-sm">{formatCustomerDate(order.createdAt)}</p>
              <p className="text-sm">Delivery: {order.deliveryAddress}</p>
              <div className="divide-y divide-[#edf0ec]">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3 py-2 text-sm"
                  >
                    <span>
                      {item.quantity} × {item.productName}
                    </span>
                    <span>{formatAdminMoney(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <p className="font-bold">
                Total: {formatAdminMoney(order.totalAmount)}
              </p>
              {order.payments[0] && (
                <p className="text-sm">
                  Payment:{" "}
                  {order.payments[0].paymentMethod.replaceAll("_", " ")} ·{" "}
                  {order.payments[0].paymentStatus}
                </p>
              )}
            </>
          )}
        </section>
      )}
      {orders.isPending && <p>Loading your orders...</p>}
      {orders.isError && (
        <p role="alert">
          {getErrorMessage(orders.error)}{" "}
          <button onClick={() => void orders.refetch()} className="underline">
            Retry
          </button>
        </p>
      )}
      {orders.data?.data?.orders.map((item) => (
        <CustomerOrderCard key={item.id} order={item} />
      ))}
      {orders.data?.data?.orders.length === 0 && (
        <p className="rounded-xl bg-white p-5">No orders yet.</p>
      )}
      {orders.data?.data && (
        <div className="flex items-center justify-between text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full border bg-white px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={page >= orders.data.data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full border bg-white px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
