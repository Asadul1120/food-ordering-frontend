import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateProductAvailability,
  updateProductFeatured,
} from "@/api/admin-product.api";

import type { AdminProductQuery } from "@/types/admin-product.type";

// Fetch Admin Products
export const useAdminProducts = (query: AdminProductQuery) => {
  return useQuery({
    queryKey: ["admin", "products", query],

    queryFn: ({ signal }) => getAdminProducts(query, signal),

    staleTime: 15_000,

    retry: 1,
  });
};

// All Product Actions
export const useAdminProductActions = () => {
  const queryClient = useQueryClient();

  // Refresh Admin List, Public Menu and Dashboard
  const refreshProducts = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin", "products"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["products"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["admin", "summary"],
      }),
    ]);
  };

  const createProduct = useMutation({
    mutationFn: createAdminProduct,
    onSuccess: refreshProducts,
  });

  const updateProduct = useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: refreshProducts,
  });

  const deleteProduct = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: refreshProducts,
  });

  const changeAvailability = useMutation({
    mutationFn: updateProductAvailability,
    onSuccess: refreshProducts,
  });

  const changeFeatured = useMutation({
    mutationFn: updateProductFeatured,
    onSuccess: refreshProducts,
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    changeAvailability,
    changeFeatured,
  };
};
