import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminWishlists,
  getAdminWishlist,
  updateAdminWishlistStatus,
  deleteAdminWishlist,
} from "@/api/admin-wishlist.api";

import type { AdminWishlistQuery } from "@/types/admin-wishlist.type";

// Get all wishlists
export const useAdminWishlists = (query: AdminWishlistQuery) => {
  return useQuery({
    queryKey: ["admin", "wishlists", query],

    queryFn: ({ signal }) => getAdminWishlists(query, signal),

    staleTime: 15_000,
    retry: 1,
  });
};

// Get single wishlist
export const useAdminWishlist = (id: string) => {
  return useQuery({
    queryKey: ["admin", "wishlist", id],

    queryFn: ({ signal }) => getAdminWishlist(id, signal),

    enabled: Boolean(id),

    staleTime: 15_000,
    retry: 1,
  });
};

// Wishlist actions
export const useAdminWishlistActions = () => {
  const queryClient = useQueryClient();

  // Update status
  const updateStatus = useMutation({
    mutationFn: updateAdminWishlistStatus,

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin", "wishlists"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["admin", "wishlist", variables.id],
        }),

        queryClient.invalidateQueries({
          queryKey: ["customer-wishlists"],
        }),
      ]);
    },
  });

  // Delete wishlist
  const deleteWishlist = useMutation({
    mutationFn: deleteAdminWishlist,

    onSuccess: async (_data, id) => {
      queryClient.removeQueries({
        queryKey: ["admin", "wishlist", id],
        exact: true,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin", "wishlists"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["customer-wishlists"],
        }),
      ]);
    },
  });

  return {
    updateStatus,
    deleteWishlist,
  };
};
