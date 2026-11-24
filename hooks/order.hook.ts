import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createOrder,
  initiatePayment,
  getOrderTracking,
} from "@/api/order.api";

// Order create hook
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};

// Payment initiation hook
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: initiatePayment,
  });
};

// Public order tracking hook
export const useOrderTracking = (orderNumber: string, phone: string) => {
  return useQuery({
    queryKey: ["order-tracking", orderNumber, phone],

    queryFn: ({ signal }) => getOrderTracking(orderNumber, phone, signal),

    enabled: Boolean(orderNumber && phone),

    staleTime: 5000,

    retry: false,

    // Refresh order status automatically
    refetchInterval: (query) => {
      const status = query.state.data?.orderStatus;

      if (status === "DELIVERED" || status === "CANCELLED") {
        return false;
      }

      return 15000;
    },
  });
};
