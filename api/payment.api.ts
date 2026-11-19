
import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";

import type {
  VerifyPaymentPayload,
  VerifiedPayment,
} from "@/types/payment.type";

// Verify bKash payment
export const verifyPayment = (
  payload: VerifyPaymentPayload,
) => {
  return apiClient<ApiResponse<VerifiedPayment>>(
    "/api/v1/payments/verify",
    {
      method: "POST",
      body: payload,
    },
  );
};
