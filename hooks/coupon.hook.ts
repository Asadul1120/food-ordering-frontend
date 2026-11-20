
import { useMutation } from "@tanstack/react-query";

import { validateCoupon } from "@/api/coupon.api";

// Validate coupon code with backend
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: validateCoupon,
  });
};
