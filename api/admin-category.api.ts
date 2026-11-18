import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";
import type {
  AdminCategory,
  UpdateCategoryPayload,
  UpdateCategoryStatusPayload,
} from "@/types/admin-category.type";

// Get all categories, including inactive
export const getAdminCategories = async (signal?: AbortSignal) => {
  const response = await apiClient<ApiResponse<AdminCategory[]>>(
    "/api/v1/categories/admin",
    {
      method: "GET",
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Category data is unavailable");
  }

  return response.data;
};

// Create category with optional image
export const createAdminCategory = (body: FormData) => {
  return apiClient<ApiResponse<AdminCategory>>("/api/v1/categories", {
    method: "POST",
    body,
  });
};

// Update category information or image
export const updateAdminCategory = ({ id, body }: UpdateCategoryPayload) => {
  return apiClient<ApiResponse<AdminCategory>>(
    `/api/v1/categories/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body,
    },
  );
};

// Activate or deactivate category
export const updateAdminCategoryStatus = ({
  id,
  isActive,
}: UpdateCategoryStatusPayload) => {
  return apiClient<ApiResponse<AdminCategory>>(
    `/api/v1/categories/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: { isActive },
    },
  );
};

// Delete category
export const deleteAdminCategory = (id: string) => {
  return apiClient<ApiResponse>(
    `/api/v1/categories/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
};
