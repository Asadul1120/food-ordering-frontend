"use client";
import Link from "next/link";
import { useGetMe } from "@/hooks/auth.hook";
// import { useCustomerDashboard, useMyWishlists } from "@/hooks/customer.hook";
import { formatAdminMoney } from "@/lib/admin";
// import { getGreeting, orderProgress, formatCustomerDate } from "@/lib/customer";
import CustomerOrderCard from "./customer-order-card";
import { useCustomerDashboard, useMyWishlists } from "@/hooks/customer.hook";
import { formatCustomerDate, getGreeting, orderProgress } from "@/lib/customer";

const steps = ["Order received", "Preparing", "Out for delivery", "Delivered"];
const panel =
  "rounded-[17px] border border-[#edf0ec] bg-white shadow-[0_1px_2px_rgba(15,45,30,0.10)]";

export default function CustomerDashboard() {
  const { data } = useGetMe();
  const user = data?.data;
  const userId = user?.role === "CUSTOMER" ? user.id : "";
  const ordersQuery = useCustomerDashboard(userId);
  const wishlistQuery = useMyWishlists(userId, 1, 1);
  const dashboard = ordersQuery.data;
  const order = dashboard?.currentOrder;
  const wishlistCount = wishlistQuery.data?.data?.pagination.totalWishlists;
  const addressCount =
    user?.profile === undefined ? "—" : user.profile?.deliveryAddress ? 1 : 0;
  const stats = [
    {
      label: "Orders",
      value: dashboard?.totalOrders,
      href: "/customer/orders",
    },
    {
      label: "In progress",
      value: dashboard?.inProgress,
      href: "/customer/orders",
    },
    { label: "Wishlist", value: wishlistCount, href: "/customer/wishlist" },
    { label: "Addresses", value: addressCount, href: "/customer/addresses" },
  ];
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="min-h-[186px] rounded-[24px] bg-[radial-gradient(ellipse_at_top_right,#f1efc8_0%,#eaf5ee_42%)] p-6 sm:p-8">
        <p className="text-[14px] font-medium text-[#075638]">
          {getGreeting()} 👋
        </p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]">
          {user?.name.split(" ")[0]}, what are we having today?
        </h1>
        <div className="mt-5 flex flex-wrap gap-2 text-[14px] font-medium">
          <Link
            href="/foods"
            className="rounded-full bg-[#095d40] px-5 py-3 font-semibold text-white shadow-sm hover:bg-[#064d34]"
          >
            Browse the menu
          </Link>
          <Link
            href="/track-order"
            className="rounded-full border border-[#d4dcd6] bg-white px-5 py-3 hover:bg-[#f7faf8]"
          >
            Track an order
          </Link>
        </div>
      </section>
      {/* Dashboard counts */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            href={stat.href}
            key={stat.label}
            className={`${panel} min-h-[90px] p-4 hover:border-[#b5d3c1]`}
          >
            <p className="text-[23px] font-bold leading-7">
              {stat.value ?? "—"}
            </p>
            <p className="mt-1 text-[14px] text-[#66716d]">{stat.label}</p>
          </Link>
        ))}
      </section>
      {/* Live order */}
      {ordersQuery.isError ? (
        <section className={`${panel} p-6`}>
          <p>Unable to load your orders.</p>
          <button
            className="mt-2 text-[#08613f] underline"
            onClick={() => void ordersQuery.refetch()}
          >
            Retry
          </button>
        </section>
      ) : ordersQuery.isPending ? (
        <section role="status" className={`${panel} p-6`}>
          Loading your orders...
        </section>
      ) : order ? (
        <section className={`${panel} p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold text-[#075638]">
                YOUR ORDER RIGHT NOW
              </p>
              <h2 className="mt-1 text-[17px] font-bold">
                {order.orderNumber}
              </h2>
              <p className="mt-1 text-[14px] text-[#66716d]">
                {order.orderItems.reduce(
                  (total, item) => total + item.quantity,
                  0,
                )}{" "}
                item(s) · {formatAdminMoney(order.totalAmount)} · Placed{" "}
                {formatCustomerDate(order.createdAt)}
              </p>
            </div>
            <Link
              href={`/customer/orders?order=${encodeURIComponent(order.id)}`}
              className="rounded-full border border-[#d4dcd6] px-5 py-3 text-[14px] font-medium hover:bg-[#f5f8f6]"
            >
              View order
            </Link>
          </div>
          <div
            className="mt-6 grid grid-cols-4 gap-2"
            aria-label={`Order progress: ${order.orderStatus}`}
          >
            {steps.map((step, index) => (
              <div key={step} className="text-center">
                <div
                  className={`h-[6px] rounded-full ${index < orderProgress[order.orderStatus] ? "bg-[#095d40]" : "bg-[#eff1ee]"}`}
                />
                <p className="mt-2 text-[11px] sm:text-[12px]">{step}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className={`${panel} p-6`}>
          <p className="font-semibold">No order in progress</p>
          <p className="mt-1 text-sm text-[#66716d]">
            Your active orders will appear here.
          </p>
          <Link
            href="/foods"
            className="mt-3 inline-block font-medium text-[#08613f]"
          >
            Browse the menu
          </Link>
        </section>
      )}
      {wishlistQuery.isError && (
        <p className="text-sm text-[#66716d]">
          Wishlist count unavailable.{" "}
          <button
            className="underline"
            onClick={() => void wishlistQuery.refetch()}
          >
            Retry
          </button>
        </p>
      )}
      {/* Recent orders */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">Recent orders</h2>
          <Link
            href="/customer/orders"
            className="text-[14px] font-medium text-[#075638]"
          >
            See all
          </Link>
        </div>
        {dashboard?.recentOrders.map((item) => (
          <CustomerOrderCard key={item.id} order={item} />
        ))}
        {dashboard && dashboard.recentOrders.length === 0 && (
          <p className={`${panel} p-5 text-sm text-[#66716d]`}>
            You have not placed an order yet.
          </p>
        )}
      </section>
    </div>
  );
}
