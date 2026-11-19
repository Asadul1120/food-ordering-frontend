
import { useMutation } from "@tanstack/react-query";

import { verifyPayment } from "@/api/payment.api";

// Verify payment hook
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment,
  });
};
