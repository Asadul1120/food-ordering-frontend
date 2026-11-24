import type { OrderStatus } from "@/types/admin.type";
export const orderProgress: Record<OrderStatus, number> = {
  PENDING: 1,
  CONFIRMED: 1,
  PREPARING: 2,
  READY: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
  CANCELLED: 0,
};
export const customerStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Order received",
  CONFIRMED: "Order confirmed",
  PREPARING: "Preparing your food",
  READY: "Ready for delivery",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
export const formatCustomerDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
export const getGreeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
