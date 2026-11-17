import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";
import type { Category } from "@/types/category.type";

export const getCategories = (signal?: AbortSignal) => {
  return apiClient<ApiResponse<Category[]>>("/api/v1/categories", {
    method: "GET",
    signal,
  });
};
