"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  FolderOpen,
  Package,
  RefreshCw,
  UtensilsCrossed,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { getAdminOrders } from "@/api/admin.api";
import { getAdminUsers } from "@/api/admin-user.api";

import { useAdminOrders, useAdminSummary } from "@/hooks/admin.hook";

import { useAdminProducts } from "@/hooks/admin-product.hook";
import { useAdminCategories } from "@/hooks/admin-category.hook";
import { useAdminUsers } from "@/hooks/admin-user.hook";

import {
  formatAdminDate,
  formatAdminMoney,
  orderStatuses,
  statusColors,
  statusLabels,
} from "@/lib/admin";

import { getErrorMessage } from "@/lib/utils";

import type { OrderStatus } from "@/types/admin.type";
import type { UserRole } from "@/types/auth.type";

// Backend-supported user roles and payment statuses
const userRoles: UserRole[] = ["ADMIN", "STAFF", "CUSTOMER"];

const paymentStatuses = ["PAID", "PENDING", "FAILED", "REFUNDED"] as const;

// Display numbers in a readable format
const numberFormat = (value: number) => value.toLocaleString("en-BD");

// Reusable dashboard summary card
function ReportCard({
  title,
  value,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  value?: number;
  icon: LucideIcon;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#73817b]">{title}</p>

        <span className={`rounded-xl p-3 ${color}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold">
        {value === undefined ? "—" : numberFormat(value)}
      </p>
    </Link>
  );
}

// ===================================================
// ADMIN DASHBOARD
// ===================================================

export default function AdminDashboardClient() {
  const queryClient = useQueryClient();

  // -------------------------------------------------
  // 1. GET DASHBOARD DATA
  // -------------------------------------------------

  // Existing summary API
  const summaryQuery = useAdminSummary();

  // Latest 10 orders
  const ordersQuery = useAdminOrders({
    page: 1,
    limit: 10,
  });

  // Latest 5 products
  const productsQuery = useAdminProducts({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // All categories
  const categoriesQuery = useAdminCategories();

  // Latest 5 registered users
  const usersQuery = useAdminUsers({
    page: 1,
    limit: 5,
  });

  // -------------------------------------------------
  // 2. ORDER STATUS REPORT
  // -------------------------------------------------

  // Backend supports filtering orders by orderStatus.
  // Request limit 1 because only the total count is needed.

  const orderStatusQuery = useQuery({
    queryKey: ["admin", "dashboard", "order-status-counts"],

    queryFn: async ({ signal }) => {
      return Promise.all(
        orderStatuses.map(async (status) => {
          const result = await getAdminOrders(
            {
              page: 1,
              limit: 1,
              orderStatus: status,
            },
            signal,
          );

          return {
            status,
            count: result.pagination.totalOrders,
          };
        }),
      );
    },

    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  // -------------------------------------------------
  // 3. USER ROLE REPORT
  // -------------------------------------------------

  // Fetch the count for each role separately.
  const userRoleQuery = useQuery({
    queryKey: ["admin", "dashboard", "user-role-counts"],

    queryFn: async ({ signal }) => {
      return Promise.all(
        userRoles.map(async (role) => {
          const result = await getAdminUsers(
            {
              page: 1,
              limit: 1,
              role,
            },
            signal,
          );

          return {
            role,
            count: result.pagination.totalUsers,
          };
        }),
      );
    },

    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  // -------------------------------------------------
  // 4. PREPARE THE REPORT DATA
  // -------------------------------------------------

  const summary = summaryQuery.data;

  const recentOrders = ordersQuery.data?.orders ?? [];
  const recentProducts = productsQuery.data?.products ?? [];
  const recentUsers = usersQuery.data?.users ?? [];
  const categories = categoriesQuery.data ?? [];

  // Category counts
  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCategories = categories.length - activeCategories;

  // Get count of a particular order status
  const statusCount = (status: OrderStatus) =>
    orderStatusQuery.data?.find((item) => item.status === status)?.count;

  // Payment data from the latest 10 orders ONLY
  const recentPayments = recentOrders.flatMap((order) => order.payments);

  // Total order amount for the latest 10 orders
  const recentOrderValue = recentOrders.reduce(
    (total, order) => total + Number(order.totalAmount),
    0,
  );

  // Total PAID payment amount from these orders
  const recentPaidValue = recentPayments
    .filter((payment) => payment.paymentStatus === "PAID")
    .reduce((total, payment) => total + Number(payment.amount), 0);

  // -------------------------------------------------
  // 5. REFRESH DASHBOARD
  // -------------------------------------------------

  const isRefreshing =
    summaryQuery.isFetching ||
    ordersQuery.isFetching ||
    productsQuery.isFetching ||
    categoriesQuery.isFetching ||
    usersQuery.isFetching ||
    orderStatusQuery.isFetching ||
    userRoleQuery.isFetching;

  const refreshDashboard = () => {
    void queryClient.invalidateQueries({
      queryKey: ["admin"],
    });
  };

  // -------------------------------------------------
  // 6. SUMMARY CARDS
  // -------------------------------------------------

  const cards = [
    {
      title: "Total orders",
      value: summary?.totalOrders,
      icon: ClipboardList,
      color: "bg-[#edf7f1] text-[#08613f]",
      href: "/dashboard/admin/orders",
    },
    {
      title: "Pending orders",
      value: summary?.pendingOrders,
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
      href: "/dashboard/admin/orders",
    },
    {
      title: "Delivered orders",
      value: statusCount("DELIVERED"),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
      href: "/dashboard/admin/orders",
    },
    {
      title: "Cancelled orders",
      value: statusCount("CANCELLED"),
      icon: XCircle,
      color: "bg-red-50 text-red-700",
      href: "/dashboard/admin/orders",
    },
    {
      title: "Total products",
      value: productsQuery.data?.pagination.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-700",
      href: "/dashboard/admin/products",
    },
    {
      title: "Available foods",
      value: summary?.availableFoods,
      icon: UtensilsCrossed,
      color: "bg-orange-50 text-orange-700",
      href: "/dashboard/admin/products",
    },
    {
      title: "Total categories",
      value: categoriesQuery.data?.length,
      icon: FolderOpen,
      color: "bg-purple-50 text-purple-700",
      href: "/dashboard/admin/categories",
    },
    {
      title: "Registered users",
      value: summary?.totalUsers,
      icon: Users,
      color: "bg-cyan-50 text-cyan-700",
      href: "/dashboard/admin/users",
    },
  ];

  // -------------------------------------------------
  // 7. DASHBOARD UI
  // -------------------------------------------------

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
            Restaurant overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#73817b]">
            Orders, products, categories, users and payment activity in one
            place.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshDashboard}
          disabled={isRefreshing}
          className="flex h-11 items-center gap-2 rounded-full bg-[#ffcc00] px-5 text-sm font-semibold text-black disabled:opacity-60"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {[
        summaryQuery,
        ordersQuery,
        productsQuery,
        categoriesQuery,
        usersQuery,
        orderStatusQuery,
        userRoleQuery,
      ].some((query) => query.isError) && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Some report data could not be loaded. Please press Refresh.
        </p>
      )}

      {/* SUMMARY REPORT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <ReportCard key={card.title} {...card} />
        ))}
      </div>

      {/* ORDER REPORT + USER REPORT */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* ORDER STATUS REPORT */}
        <section className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">Order status report</h2>

          <p className="mt-1 text-xs text-[#73817b]">
            All orders · Exact counts from backend filters
          </p>

          {orderStatusQuery.isPending ? (
            <p className="mt-5 text-sm text-[#73817b]">
              Loading order statuses...
            </p>
          ) : orderStatusQuery.isError ? (
            <p className="mt-5 text-sm text-red-600">
              {getErrorMessage(orderStatusQuery.error)}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {orderStatusQuery.data.map(({ status, count }) => {
                const percent = summary?.totalOrders
                  ? (count / summary.totalOrders) * 100
                  : 0;

                return (
                  <div key={status}>
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[status]}`}
                      >
                        {statusLabels[status]}
                      </span>

                      <span className="font-semibold">
                        {numberFormat(count)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#edf0ec]">
                      <div
                        className="h-full rounded-full bg-[#08613f]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link
            href="/dashboard/admin/orders"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#08613f] hover:underline"
          >
            Manage orders
            <ArrowRight size={15} />
          </Link>
        </section>

        {/* USER ROLE REPORT */}
        <section className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">User report</h2>

          <p className="mt-1 text-xs text-[#73817b]">
            All registered accounts by role
          </p>

          {userRoleQuery.isPending ? (
            <p className="mt-5 text-sm text-[#73817b]">Loading user roles...</p>
          ) : userRoleQuery.isError ? (
            <p className="mt-5 text-sm text-red-600">
              {getErrorMessage(userRoleQuery.error)}
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {userRoleQuery.data.map(({ role, count }) => {
                const percent = summary?.totalUsers
                  ? (count / summary.totalUsers) * 100
                  : 0;

                return (
                  <div key={role}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">
                        {role.toLowerCase()}
                      </span>

                      <span className="font-semibold">
                        {numberFormat(count)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#edf0ec]">
                      <div
                        className="h-full rounded-full bg-[#08613f]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CATEGORY SUMMARY */}
          <div className="mt-7 rounded-2xl bg-[#edf7f1] px-4 py-4 text-sm">
            <p className="font-semibold text-[#08613f]">Category summary</p>

            {categoriesQuery.isPending ? (
              <p className="mt-2 text-[#73817b]">Loading categories...</p>
            ) : categoriesQuery.isError ? (
              <p className="mt-2 text-red-600">
                {getErrorMessage(categoriesQuery.error)}
              </p>
            ) : (
              <p className="mt-2 text-[#73817b]">
                {activeCategories} active · {inactiveCategories} inactive
              </p>
            )}
          </div>

          <Link
            href="/dashboard/admin/users"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#08613f] hover:underline"
          >
            Manage users
            <ArrowRight size={15} />
          </Link>
        </section>
      </div>

      {/* RECENT PAYMENT REPORT */}
      <section className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-[#08613f]" />

              <h2 className="text-xl font-bold">Recent payment overview</h2>
            </div>

            <p className="mt-1 text-xs text-[#73817b]">
              Only the latest 10 orders, not the all-time sales report
            </p>
          </div>

          <Link
            href="/dashboard/admin/orders"
            className="text-sm font-semibold text-[#08613f] hover:underline"
          >
            View all orders →
          </Link>
        </div>

        {ordersQuery.isPending ? (
          <p className="mt-5 text-sm text-[#73817b]">
            Loading recent payment data...
          </p>
        ) : ordersQuery.isError ? (
          <p className="mt-5 text-sm text-red-600">
            {getErrorMessage(ordersQuery.error)}
          </p>
        ) : (
          <>
            {/* PAYMENT AMOUNT CARDS */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f8faf7] p-5">
                <p className="text-sm text-[#73817b]">
                  Value of latest {recentOrders.length} orders
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatAdminMoney(String(recentOrderValue))}
                </p>
              </div>

              <div className="rounded-2xl bg-[#edf7f1] p-5">
                <p className="text-sm text-[#73817b]">
                  Paid transactions in these orders
                </p>

                <p className="mt-2 text-2xl font-bold text-[#08613f]">
                  {formatAdminMoney(String(recentPaidValue))}
                </p>
              </div>
            </div>

            {/* PAYMENT STATUS COUNTS */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {paymentStatuses.map((status) => (
                <div
                  key={status}
                  className="rounded-xl border border-[#edf0ec] p-4"
                >
                  <p className="text-xs font-medium text-[#73817b]">
                    {status} payments
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    {numberFormat(
                      recentPayments.filter(
                        (payment) => payment.paymentStatus === status,
                      ).length,
                    )}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* LATEST ORDERS TABLE */}
      <section className="overflow-hidden rounded-[22px] border border-[#e9eee9] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-bold">Latest orders</h2>

            <p className="mt-1 text-xs text-[#73817b]">Most recent 10 orders</p>
          </div>

          <Link
            href="/dashboard/admin/orders"
            className="text-sm font-semibold text-[#08613f] hover:underline"
          >
            Manage orders →
          </Link>
        </div>

        {ordersQuery.isPending ? (
          <p className="p-8 text-center text-sm text-[#73817b]">
            Loading orders...
          </p>
        ) : ordersQuery.isError ? (
          <p className="p-8 text-center text-sm text-red-600">
            {getErrorMessage(ordersQuery.error)}
          </p>
        ) : recentOrders.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#73817b]">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[#f8faf7] text-xs text-[#73817b]">
                <tr>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Order
                  </th>

                  <th scope="col" className="px-5 py-4 font-medium">
                    Customer
                  </th>

                  <th scope="col" className="px-5 py-4 font-medium">
                    Amount
                  </th>

                  <th scope="col" className="px-5 py-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf0ec]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fafcf9]">
                    <td className="px-5 py-4">
                      <p
                        title={order.orderNumber}
                        className="max-w-[200px] truncate font-semibold"
                      >
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-[#73817b]">
                        {formatAdminDate(order.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-4">{order.customerName}</td>

                    <td className="px-5 py-4 font-medium">
                      {formatAdminMoney(order.totalAmount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.orderStatus]}`}
                      >
                        {statusLabels[order.orderStatus]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* RECENT PRODUCTS AND USERS */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* RECENT PRODUCTS */}
        <section className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Recent products</h2>

            <Link
              href="/dashboard/admin/products"
              className="text-sm font-semibold text-[#08613f] hover:underline"
            >
              View all →
            </Link>
          </div>

          {productsQuery.isPending ? (
            <p className="mt-5 text-sm text-[#73817b]">Loading products...</p>
          ) : productsQuery.isError ? (
            <p className="mt-5 text-sm text-red-600">
              {getErrorMessage(productsQuery.error)}
            </p>
          ) : recentProducts.length === 0 ? (
            <p className="mt-5 text-sm text-[#73817b]">No products yet.</p>
          ) : (
            <div className="mt-5 divide-y divide-[#edf0ec]">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>

                    <p className="mt-1 text-xs text-[#73817b]">
                      {product.category.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {formatAdminMoney(product.price)}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        product.isAvailable ? "text-[#08613f]" : "text-red-600"
                      }`}
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RECENT USERS */}
        <section className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Recent users</h2>

            <Link
              href="/dashboard/admin/users"
              className="text-sm font-semibold text-[#08613f] hover:underline"
            >
              View all →
            </Link>
          </div>

          {usersQuery.isPending ? (
            <p className="mt-5 text-sm text-[#73817b]">Loading users...</p>
          ) : usersQuery.isError ? (
            <p className="mt-5 text-sm text-red-600">
              {getErrorMessage(usersQuery.error)}
            </p>
          ) : recentUsers.length === 0 ? (
            <p className="mt-5 text-sm text-[#73817b]">No users yet.</p>
          ) : (
            <div className="mt-5 divide-y divide-[#edf0ec]">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.name}</p>

                    <p className="mt-1 truncate text-xs text-[#73817b]">
                      {user.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold">{user.role}</p>

                    <p
                      className={`mt-1 text-xs ${
                        user.isActive ? "text-[#08613f]" : "text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* REFRESH INFORMATION */}
      <p className="text-right text-xs text-[#73817b]">
        Order and user distribution refresh every 60 seconds.
      </p>
    </div>
  );
}
