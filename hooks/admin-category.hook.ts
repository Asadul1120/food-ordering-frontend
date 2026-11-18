import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  updateAdminCategoryStatus,
  deleteAdminCategory,
} from "@/api/admin-category.api";

// Fetch all categories for Admin
export const useAdminCategories = () => {
  return useQuery({
    queryKey: ["admin", "categories"],

    queryFn: ({ signal }) => getAdminCategories(signal),

    staleTime: 30_000,

    retry: 1,
  });
};

// Create, Update, Activate and Delete
export const useAdminCategoryActions = () => {
  const queryClient = useQueryClient();

  // Refresh Admin, Public Categories and Products
  const refreshCategories = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["products"],
      }),
    ]);
  };

  const createCategory = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: refreshCategories,
  });

  const updateCategory = useMutation({
    mutationFn: updateAdminCategory,
    onSuccess: refreshCategories,
  });

  const updateStatus = useMutation({
    mutationFn: updateAdminCategoryStatus,
    onSuccess: refreshCategories,
  });

  const deleteCategory = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: refreshCategories,
  });

  return {
    createCategory,
    updateCategory,
    updateStatus,
    deleteCategory,
  };
};
