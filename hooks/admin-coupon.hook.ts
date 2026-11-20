
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminCoupon,
  getAdminCoupons,
  updateAdminCoupon,
  updateAdminCouponStatus,
} from "@/api/admin-coupon.api";

import type { AdminCouponQuery } from "@/types/admin-coupon.type";

// Get all admin coupons
export const useAdminCoupons = (query: AdminCouponQuery) => {
  return useQuery({
    queryKey: ["admin", "coupons", query],
    queryFn: ({ signal }) => getAdminCoupons(query, signal),
    staleTime: 15_000,
    retry: 1,
  });
};

// Get single coupon
export const useAdminCoupon = (id: string) => {
  return useQuery({
    queryKey: ["admin", "coupon", id],
    queryFn: ({ signal }) => getAdminCoupon(id, signal),
    enabled: Boolean(id),
    staleTime: 15_000,
    retry: 1,
  });
};

// All coupon actions
export const useAdminCouponActions = () => {
  const queryClient = useQueryClient();

  // Refresh admin data after coupon changes
  const refreshCoupons = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin"],
    });
  };

  const createCoupon = useMutation({
    mutationFn: createAdminCoupon,
    onSuccess: refreshCoupons,
  });

  const updateCoupon = useMutation({
    mutationFn: updateAdminCoupon,
    onSuccess: refreshCoupons,
  });

  const updateStatus = useMutation({
    mutationFn: updateAdminCouponStatus,
    onSuccess: refreshCoupons,
  });

  const deleteCoupon = useMutation({
    mutationFn: deleteAdminCoupon,
    onSuccess: refreshCoupons,
  });

  return {
    createCoupon,
    updateCoupon,
    updateStatus,
    deleteCoupon,
  };
};
