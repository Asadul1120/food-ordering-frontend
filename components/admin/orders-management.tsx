"use client";

import { useState } from "react";

import AdminOrderFilterForm from "@/components/form/admin-order-filter-form";
import OrderActions from "@/components/admin/order-actions";
import OrderDetails from "@/components/admin/order-details";

import { useAdminOrders } from "@/hooks/admin.hook";

import {
  formatAdminDate,
  formatAdminMoney,
  statusColors,
  statusLabels,
} from "@/lib/admin";

import { getErrorMessage } from "@/lib/utils";

import type { AdminOrderQuery } from "@/types/admin.type";

export default function OrdersManagement() {
  // Search, status and pagination
  const [filters, setFilters] = useState<AdminOrderQuery>({
    page: 1,
    limit: 10,
  });

  // Selected order for details dialog
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Existing TanStack Query hook
  const ordersQuery = useAdminOrders(filters);

  const orders = ordersQuery.data?.orders ?? [];
  const pagination = ordersQuery.data?.pagination;

  const handlePreviousPage = () => {
    setFilters((current) => ({
      ...current,
      page: Math.max(1, current.page - 1),
    }));
  };

  const handleNextPage = () => {
    if (!pagination) return;

    setFilters((current) => ({
      ...current,
      page: Math.min(pagination.totalPages, current.page + 1),
    }));
  };

  return (
    <>
      <section
        id="orders"
        className="scroll-mt-6 overflow-hidden rounded-[22px] border border-[#e9eee9] bg-white shadow-sm"
      >
        {/* Header and filters */}
        <div className="border-b border-[#edf0ec] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Orders</h2>

              <p className="mt-1 text-xs text-[#73817b]">
                Newest first · Search, review and update orders
              </p>
            </div>

            {pagination && (
              <span className="rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-semibold">
                {pagination.totalOrders} results
              </span>
            )}
          </div>

          {/* Existing filter form */}
          <AdminOrderFilterForm
            onApply={({ search, orderStatus }) => {
              setFilters({
                page: 1,
                limit: 10,
                search: search || undefined,
                orderStatus: orderStatus || undefined,
              });
            }}
          />
        </div>

        {/* Loading */}
        {ordersQuery.isPending ? (
          <p role="status" className="p-10 text-center text-sm text-[#73817b]">
            Loading orders...
          </p>
        ) : ordersQuery.isError ? (
          /* Error */
          <div role="alert" className="p-10 text-center text-sm">
            <p>{getErrorMessage(ordersQuery.error)}</p>

            <button
              type="button"
              onClick={() => void ordersQuery.refetch()}
              className="mt-3 text-[#08613f] underline"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* Empty result */
          <p className="p-10 text-center text-sm text-[#73817b]">
            No orders found for these filters.
          </p>
        ) : (
          /* Orders Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#f8faf7] text-xs text-[#73817b]">
                <tr>
                  {[
                    "Order",
                    "Customer",
                    "Amount",
                    "Payment",
                    "Status",
                    "Actions",
                  ].map((title) => (
                    <th
                      key={title}
                      scope="col"
                      className="px-5 py-4 font-medium"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf0ec]">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top hover:bg-[#fafcf9]">
                    {/* Order Number */}
                    <td className="px-5 py-4">
                      <p
                        title={order.orderNumber}
                        className="max-w-[160px] truncate font-semibold"
                      >
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 whitespace-nowrap text-xs text-[#73817b]">
                        {formatAdminDate(order.createdAt)}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-medium">{order.customerName}</p>

                      <p className="mt-1 text-xs text-[#73817b]">
                        {order.customerPhone}
                      </p>
                    </td>

                    {/* Total Amount */}
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {formatAdminMoney(order.totalAmount)}
                    </td>

                    {/* Payments */}
                    <td className="px-5 py-4">
                      {order.payments.length === 0 ? (
                        <span className="text-xs text-[#73817b]">
                          No payment record
                        </span>
                      ) : (
                        order.payments.map((payment) => (
                          <div key={payment.id} className="mb-2">
                            <p className="text-[11px] text-[#73817b]">
                              {payment.paymentMethod.replaceAll("_", " ")}
                            </p>

                            <p
                              className={`mt-1 text-xs font-semibold ${
                                payment.paymentStatus === "PAID"
                                  ? "text-emerald-700"
                                  : "text-[#73817b]"
                              }`}
                            >
                              {payment.paymentStatus}
                            </p>
                          </div>
                        ))
                      )}
                    </td>

                    {/* Order Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColors[order.orderStatus]
                        }`}
                      >
                        {statusLabels[order.orderStatus]}
                      </span>
                    </td>

                    {/* Existing Order Actions */}
                    <td className="min-w-[250px] px-5 py-4">
                      <OrderActions
                        order={order}
                        onView={() => setSelectedOrderId(order.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && !ordersQuery.isError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ec] p-5 text-sm">
            <span className="text-xs text-[#73817b]">
              Page {pagination.currentPage} of{" "}
              {Math.max(1, pagination.totalPages)}
              {" · "}
              {pagination.totalOrders} matching orders
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={filters.page <= 1 || ordersQuery.isFetching}
                onClick={handlePreviousPage}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  filters.page >= pagination.totalPages ||
                  ordersQuery.isFetching
                }
                onClick={handleNextPage}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Existing Order Details Dialog */}
      {selectedOrderId && (
        <OrderDetails
          id={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </>
  );
}
