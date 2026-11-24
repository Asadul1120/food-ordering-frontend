import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { OrderStatus } from "@/types/admin.type";
import type { MyOrdersQuery } from "@/types/customer.type";
import {
  createWishlist,
  getMyOrderById,
  getMyOrders,
  getMyWishlists,
  updateMyProfile,
} from "@/api/customer.api";

const activeStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
];

export const useCustomerDashboard = (userId: string) => {
  return useQuery({
    queryKey: ["customer-orders", userId, "dashboard"],
    enabled: Boolean(userId),
    queryFn: async () => {
      // Count every active status, not just the recent orders on screen.
      const [recent, ...active] = await Promise.all([
        getMyOrders({ page: 1, limit: 3 }),
        ...activeStatuses.map((orderStatus) =>
          getMyOrders({ page: 1, limit: 1, orderStatus }),
        ),
      ]);
      if (!recent.data || active.some((response) => !response.data)) {
        throw new Error("Order information is unavailable");
      }
      const currentOrders = active.flatMap(
        (response) => response.data?.orders ?? [],
      );
      currentOrders.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      );
      return {
        totalOrders: recent.data.pagination.totalOrders,
        inProgress: active.reduce(
          (total, response) =>
            total + (response.data?.pagination.totalOrders ?? 0),
          0,
        ),
        currentOrder: currentOrders[0],
        recentOrders: recent.data.orders,
      };
    },
    refetchInterval: 15000,
    retry: false,
  });
};
export const useMyOrders = (userId: string, query: MyOrdersQuery) =>
  useQuery({
    queryKey: ["customer-orders", userId, query],
    queryFn: () => getMyOrders(query),
    enabled: Boolean(userId),
    retry: false,
    refetchInterval: 15000,
  });
export const useMyWishlists = (userId: string, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["customer-wishlists", userId, page, limit],
    queryFn: () => getMyWishlists(page, limit),
    enabled: Boolean(userId),
    retry: false,
  });
export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWishlist,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["customer-wishlists"] }),
  });
};
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user"], exact: true }),
  });
};

export const useMyOrderById = (userId: string, id: string) =>
  useQuery({
    queryKey: ["customer-orders", userId, "detail", id],
    queryFn: () => getMyOrderById(id),
    enabled: Boolean(userId && id),
    retry: false,
    refetchInterval: 15000,
  });
