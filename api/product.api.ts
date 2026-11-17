import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";
import type { ProductList, ProductQuery } from "@/types/product.type";

export const getProducts = (query: ProductQuery, signal?: AbortSignal) => {
  return apiClient<ApiResponse<ProductList>>("/api/v1/products", {
    method: "GET",
    query,
    signal,
  });
};
