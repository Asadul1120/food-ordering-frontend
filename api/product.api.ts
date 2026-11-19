import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";
import type { Product, ProductList, ProductQuery } from "@/types/product.type";

// Get all public products
export const getProducts = (query: ProductQuery, signal?: AbortSignal) => {
  return apiClient<ApiResponse<ProductList>>("/api/v1/products", {
    method: "GET",
    query,
    signal,
  });
};

// Get featured products
export const getFeaturedProducts = (signal?: AbortSignal) => {
  return apiClient<ApiResponse<Product[]>>("/api/v1/products/featured", {
    method: "GET",
    signal,
  });
};

// Get a single product using its ID
export const getProductById = (id: string, signal?: AbortSignal) => {
  return apiClient<ApiResponse<Product>>(
    `/api/v1/products/${encodeURIComponent(id)}`,
    {
      method: "GET",
      signal,
    },
  );
};