import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelAdminOrder,
  getAdminOrder,
  getAdminOrders,
  getAdminSummary,
  updateAdminOrderStatus,
} from "@/api/admin.api";

import type { AdminOrderQuery } from "@/types/admin.type";

export const useAdminSummary = () => {
  return useQuery({
    queryKey: ["admin", "summary"],

    queryFn: ({ signal }) => getAdminSummary(signal),

    staleTime: 30_000,

    refetchInterval: 60_000,

    retry: 1,
  });
};

export const useAdminOrders = (query: AdminOrderQuery) => {
  return useQuery({
    queryKey: ["admin", "orders", query],

    queryFn: ({ signal }) => getAdminOrders(query, signal),

    staleTime: 15_000,

    refetchInterval: 60_000,

    retry: 1,
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ["admin", "order", id],

    queryFn: ({ signal }) => getAdminOrder(id, signal),

    staleTime: 0,

    retry: 1,
  });
};

export const useAdminOrderActions = () => {
  const queryClient = useQueryClient();

  const refreshOrders = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      }),
    ]);
  };

  const updateStatus = useMutation({
    mutationFn: updateAdminOrderStatus,
    onSettled: refreshOrders,
  });

  const cancelOrder = useMutation({
    mutationFn: cancelAdminOrder,
    onSettled: refreshOrders,
  });

  return {
    updateStatus,
    cancelOrder,
  };
};