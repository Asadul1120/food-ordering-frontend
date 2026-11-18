import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";
import type { ProductList } from "@/types/product.type";
import type { AdminProductQuery } from "@/types/admin-product.type";

// Admin Product List
export const getAdminProducts = async (
  query: AdminProductQuery,
  signal?: AbortSignal,
) => {
  const response = await apiClient<ApiResponse<ProductList>>(
    "/api/v1/products/admin",
    {
      method: "GET",
      query,
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Product data is unavailable");
  }

  return response.data;
};

// Create Product with image
export const createAdminProduct = (body: FormData) => {
  return apiClient<ApiResponse>("/api/v1/products", {
    method: "POST",
    body,
  });
};

// Update Product
export const updateAdminProduct = ({
  id,
  body,
}: {
  id: string;
  body: FormData;
}) => {
  return apiClient<ApiResponse>(`/api/v1/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body,
  });
};

// Change Availability
export const updateProductAvailability = ({
  id,
  isAvailable,
}: {
  id: string;
  isAvailable: boolean;
}) => {
  return apiClient<ApiResponse>(
    `/api/v1/products/${encodeURIComponent(id)}/availability`,
    {
      method: "PATCH",
      body: { isAvailable },
    },
  );
};

// Change Featured Status
export const updateProductFeatured = ({
  id,
  isFeatured,
}: {
  id: string;
  isFeatured: boolean;
}) => {
  return apiClient<ApiResponse>(
    `/api/v1/products/${encodeURIComponent(id)}/featured`,
    {
      method: "PATCH",
      body: { isFeatured },
    },
  );
};

// Delete Product
export const deleteAdminProduct = (id: string) => {
  return apiClient<ApiResponse>(`/api/v1/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};
