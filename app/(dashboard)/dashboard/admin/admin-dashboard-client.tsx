// "use client";

// import { useState } from "react";

// import {
//   ClipboardList,
//   Clock3,
//   UtensilsCrossed,
//   Users,
//   RefreshCw,
// } from "lucide-react";

// import { useQueryClient } from "@tanstack/react-query";

// import AdminOrderFilterForm from "@/components/form/admin-order-filter-form";
// import OrderActions from "@/components/admin/order-actions";
// import OrderDetails from "@/components/admin/order-details";

// import { useAdminOrders, useAdminSummary } from "@/hooks/admin.hook";

// import {
//   formatAdminDate,
//   formatAdminMoney,
//   statusColors,
//   statusLabels,
// } from "@/lib/admin";

// import { getErrorMessage } from "@/lib/utils";

// import type { AdminOrderQuery } from "@/types/admin.type";

// export default function AdminDashboardClient() {
//   const queryClient = useQueryClient();

//   const [filters, setFilters] = useState<AdminOrderQuery>({
//     page: 1,
//     limit: 10,
//   });

//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

//   const summaryQuery = useAdminSummary();
//   const ordersQuery = useAdminOrders(filters);

//   const summary = summaryQuery.data;
//   const orders = ordersQuery.data?.orders ?? [];
//   const pagination = ordersQuery.data?.pagination;

//   const isRefreshing = summaryQuery.isFetching || ordersQuery.isFetching;

//   const stats = [
//     {
//       label: "Total orders",
//       value: summary?.totalOrders,
//       icon: ClipboardList,
//       color: "bg-[#edf7f1] text-[#08613f]",
//     },
//     {
//       label: "Pending orders",
//       value: summary?.pendingOrders,
//       icon: Clock3,
//       color: "bg-amber-50 text-amber-700",
//     },
//     {
//       label: "Available foods",
//       value: summary?.availableFoods,
//       icon: UtensilsCrossed,
//       color: "bg-orange-50 text-orange-700",
//     },
//     {
//       label: "Registered users",
//       value: summary?.totalUsers,
//       icon: Users,
//       color: "bg-blue-50 text-blue-700",
//     },
//   ];

//   return (
//     <>
//       {/* Page heading */}
//       <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
//             Restaurant overview
//           </p>

//           <h1 className="mt-2 text-3xl font-bold tracking-tight">
//             Welcome back.
//           </h1>

//           <p className="mt-2 text-sm text-[#73817b]">
//             Keep track of your orders and daily operations.
//           </p>
//         </div>

//         <button
//           type="button"
//           disabled={isRefreshing}
//           onClick={() =>
//             void queryClient.invalidateQueries({
//               queryKey: ["admin"],
//             })
//           }
//           className="flex h-11 items-center gap-2 rounded-full bg-[#ffcc00] px-5 text-sm font-semibold text-black disabled:opacity-60"
//         >
//           <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
//           Refresh
//         </button>
//       </div>

//       {/* Summary cards */}
//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {stats.map((stat) => (
//           <section
//             key={stat.label}
//             className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm"
//           >
//             <div className="flex items-center justify-between gap-3">
//               <p className="text-sm text-[#73817b]">{stat.label}</p>

//               <span className={`rounded-xl p-3 ${stat.color}`}>
//                 <stat.icon size={20} aria-hidden="true" />
//               </span>
//             </div>

//             <p className="mt-4 text-3xl font-bold">
//               {summaryQuery.isError
//                 ? "—"
//                 : stat.value === undefined
//                   ? "…"
//                   : stat.value.toLocaleString("en-BD")}
//             </p>
//           </section>
//         ))}
//       </div>

//       {summaryQuery.isError && (
//         <p role="alert" className="mt-3 text-sm text-red-600">
//           {getErrorMessage(summaryQuery.error)}{" "}
//           <button
//             type="button"
//             onClick={() => void summaryQuery.refetch()}
//             className="underline"
//           >
//             Retry summary
//           </button>
//         </p>
//       )}

//       {/* Menu information */}
//       <div className="my-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#edf7f1] px-5 py-4 text-sm">
//         <p>
//           <span className="font-semibold text-[#08613f]">
//             {summaryQuery.isError ? "—" : (summary?.activeCategories ?? "…")}
//           </span>{" "}
//           active menu categories
//         </p>

//         <p className="text-xs text-[#73817b]">
//           Automatically refreshes every 60 seconds
//         </p>
//       </div>

//       {/* Order management */}
//       <section
//         id="orders"
//         className="scroll-mt-6 overflow-hidden rounded-[22px] border border-[#e9eee9] bg-white shadow-sm"
//       >
//         <div className="border-b border-[#edf0ec] p-5 sm:p-6">
//           <div className="mb-5 flex items-center justify-between gap-3">
//             <div>
//               <h2 className="text-xl font-bold">Orders</h2>

//               <p className="mt-1 text-xs text-[#73817b]">
//                 Newest first · Search, review and update orders
//               </p>
//             </div>

//             {pagination && (
//               <span className="rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-semibold">
//                 {pagination.totalOrders} results
//               </span>
//             )}
//           </div>

//           <AdminOrderFilterForm
//             onApply={({ search, orderStatus }) => {
//               setFilters({
//                 page: 1,
//                 limit: 10,
//                 search: search || undefined,
//                 orderStatus: orderStatus || undefined,
//               });
//             }}
//           />
//         </div>

//         {/* Loading / error / empty / table */}
//         {ordersQuery.isPending ? (
//           <p role="status" className="p-10 text-center text-sm text-[#73817b]">
//             Loading orders...
//           </p>
//         ) : ordersQuery.isError ? (
//           <div role="alert" className="p-10 text-center text-sm">
//             <p>{getErrorMessage(ordersQuery.error)}</p>

//             <button
//               type="button"
//               onClick={() => void ordersQuery.refetch()}
//               className="mt-3 text-[#08613f] underline"
//             >
//               Try again
//             </button>
//           </div>
//         ) : orders.length === 0 ? (
//           <p className="p-10 text-center text-sm text-[#73817b]">
//             No orders found for these filters.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1050px] text-left text-sm">
//               <thead className="bg-[#f8faf7] text-xs text-[#73817b]">
//                 <tr>
//                   {[
//                     "Order",
//                     "Customer",
//                     "Amount",
//                     "Payment",
//                     "Status",
//                     "Actions",
//                   ].map((title) => (
//                     <th
//                       key={title}
//                       scope="col"
//                       className="px-5 py-4 font-medium"
//                     >
//                       {title}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#edf0ec]">
//                 {orders.map((order) => (
//                   <tr key={order.id} className="align-top hover:bg-[#fafcf9]">
//                     <td className="px-5 py-4">
//                       <p
//                         title={order.orderNumber}
//                         className="max-w-[160px] truncate font-semibold"
//                       >
//                         {order.orderNumber}
//                       </p>

//                       <p className="mt-1 whitespace-nowrap text-xs text-[#73817b]">
//                         {formatAdminDate(order.createdAt)}
//                       </p>
//                     </td>

//                     <td className="px-5 py-4">
//                       <p className="font-medium">{order.customerName}</p>

//                       <p className="mt-1 text-xs text-[#73817b]">
//                         {order.customerPhone}
//                       </p>
//                     </td>

//                     <td className="whitespace-nowrap px-5 py-4 font-semibold">
//                       {formatAdminMoney(order.totalAmount)}
//                     </td>

//                     <td className="px-5 py-4">
//                       {order.payments.map((payment) => (
//                         <div key={payment.id} className="mb-2">
//                           <p className="text-[11px] text-[#73817b]">
//                             {payment.paymentMethod.replaceAll("_", " ")}
//                           </p>

//                           <p
//                             className={`mt-1 text-xs font-semibold ${
//                               payment.paymentStatus === "PAID"
//                                 ? "text-emerald-700"
//                                 : "text-[#73817b]"
//                             }`}
//                           >
//                             {payment.paymentStatus}
//                           </p>
//                         </div>
//                       ))}
//                     </td>

//                     <td className="px-5 py-4">
//                       <span
//                         className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
//                           statusColors[order.orderStatus]
//                         }`}
//                       >
//                         {statusLabels[order.orderStatus]}
//                       </span>
//                     </td>

//                     <td className="min-w-[250px] px-5 py-4">
//                       <OrderActions
//                         order={order}
//                         onView={() => setSelectedOrderId(order.id)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination && !ordersQuery.isError && (
//           <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ec] p-5 text-sm">
//             <span className="text-xs text-[#73817b]">
//               Page {filters.page} · {pagination.totalOrders} matching orders
//             </span>

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 disabled={filters.page <= 1 || ordersQuery.isFetching}
//                 onClick={() =>
//                   setFilters({
//                     ...filters,
//                     page: filters.page - 1,
//                   })
//                 }
//                 className="rounded-full border px-4 py-2 disabled:opacity-40"
//               >
//                 Previous
//               </button>

//               <button
//                 type="button"
//                 disabled={
//                   filters.page >= pagination.totalPages ||
//                   ordersQuery.isFetching
//                 }
//                 onClick={() =>
//                   setFilters({
//                     ...filters,
//                     page: filters.page + 1,
//                   })
//                 }
//                 className="rounded-full border px-4 py-2 disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Order details dialog */}
//       {selectedOrderId && (
//         <OrderDetails
//           id={selectedOrderId}
//           onClose={() => setSelectedOrderId(null)}
//         />
//       )}
//     </>
//   );
// }

"use client";

import Link from "next/link";

import {
  ClipboardList,
  Clock3,
  UtensilsCrossed,
  Users,
  RefreshCw,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";


import { useAdminSummary } from "@/hooks/admin.hook";
import { getErrorMessage } from "@/lib/utils";
import OrdersManagement from "@/components/admin/orders-management";

export default function AdminDashboardClient() {
  const queryClient = useQueryClient();

  const summaryQuery = useAdminSummary();
  const summary = summaryQuery.data;

  const stats = [
    {
      label: "Total orders",
      value: summary?.totalOrders,
      icon: ClipboardList,
      color: "bg-[#edf7f1] text-[#08613f]",
    },
    {
      label: "Pending orders",
      value: summary?.pendingOrders,
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Available foods",
      value: summary?.availableFoods,
      icon: UtensilsCrossed,
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Registered users",
      value: summary?.totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
  ];

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin"],
    });
  };

  return (
    <>
      {/* Page Heading */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
            Restaurant overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Welcome back.
          </h1>

          <p className="mt-2 text-sm text-[#73817b]">
            Keep track of your orders and daily operations.
          </p>
        </div>

        <button
          type="button"
          disabled={summaryQuery.isFetching}
          onClick={() => void handleRefresh()}
          className="flex h-11 items-center gap-2 rounded-full bg-[#ffcc00] px-5 text-sm font-semibold text-black disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={summaryQuery.isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <section
            key={stat.label}
            className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[#73817b]">{stat.label}</p>

              <span className={`rounded-xl p-3 ${stat.color}`}>
                <stat.icon size={20} aria-hidden="true" />
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {summaryQuery.isError
                ? "—"
                : stat.value === undefined
                  ? "…"
                  : stat.value.toLocaleString("en-BD")}
            </p>
          </section>
        ))}
      </div>

      {/* Summary Error */}
      {summaryQuery.isError && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {getErrorMessage(summaryQuery.error)}{" "}
          <button
            type="button"
            onClick={() => void summaryQuery.refetch()}
            className="underline"
          >
            Retry summary
          </button>
        </p>
      )}

      {/* Category Information */}
      <div className="my-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#edf7f1] px-5 py-4 text-sm">
        <p>
          <span className="font-semibold text-[#08613f]">
            {summaryQuery.isError ? "—" : (summary?.activeCategories ?? "…")}
          </span>{" "}
          active menu categories
        </p>

        <p className="text-xs text-[#73817b]">
          Automatically refreshes every 60 seconds
        </p>
      </div>

      {/* Dedicated Orders Page Link */}
      <div className="mb-4 flex items-center justify-end">
        <Link
          href="/dashboard/admin/orders"
          className="text-sm font-semibold text-[#08613f] hover:underline"
        >
          View all orders →
        </Link>
      </div>

      {/* Existing Order Management UI */}
      <OrdersManagement />
    </>
  );
}
