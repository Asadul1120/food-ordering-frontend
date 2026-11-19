
import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";

import type {
  CreateOrderPayload,
  CreatedOrder,
  InitiatePaymentPayload,
  PaymentInitiation,
} from "@/types/order.type";

// Create new order
export const createOrder = (
  payload: CreateOrderPayload,
) => {
  return apiClient<ApiResponse<CreatedOrder>>(
    "/api/v1/orders",
    {
      method: "POST",
      body: payload,
    },
  );
};

// Initiate bKash payment
export const initiatePayment = ({
  orderId,
  guestToken,
}: InitiatePaymentPayload) => {
  return apiClient<ApiResponse<PaymentInitiation>>(
    `/api/v1/payments/initiate/${orderId}`,
    {
      method: "POST",
      headers: {
        ...(guestToken && {
          "x-guest-token": guestToken,
        }),
      },
    },
  );
};
