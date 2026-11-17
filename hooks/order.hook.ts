import { useMutation } from "@tanstack/react-query";

import { createOrder, initiatePayment } from "@/api/order.api";

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
