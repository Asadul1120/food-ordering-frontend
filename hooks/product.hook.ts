import { useQuery } from "@tanstack/react-query";

import {
  getProducts,
  getFeaturedProducts,
  getProductById,
} from "@/api/product.api";

import type { ProductQuery } from "@/types/product.type";

// All products
export const useProducts = (query: ProductQuery) => {
  return useQuery({
    queryKey: ["products", query],

    queryFn: ({ signal }) => getProducts(query, signal),

    staleTime: 30 * 1000,
    retry: 1,
  });
};

// Featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],

    queryFn: ({ signal }) => getFeaturedProducts(signal),

    staleTime: 30 * 1000,
    retry: 1,
  });
};

// Single product details by ID
export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ["products", "detail", id],

    queryFn: ({ signal }) => getProductById(id, signal),

    enabled: Boolean(id),

    staleTime: 30 * 1000,
    retry: 1,
  });
};
