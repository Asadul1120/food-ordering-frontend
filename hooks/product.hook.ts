import { useQuery } from "@tanstack/react-query";

import { getProducts, getFeaturedProducts } from "@/api/product.api";

import type { ProductQuery } from "@/types/product.type";

// Get regular products
export const useProducts = (query: ProductQuery) => {
  return useQuery({
    queryKey: ["products", query],

    queryFn: ({ signal }) => getProducts(query, signal),

    staleTime: 30 * 1000,

    retry: 1,
  });
};

// Get Admin-selected featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],

    queryFn: ({ signal }) => getFeaturedProducts(signal),

    // staleTime: 30 * 1000,
    staleTime: 3000,

    retry: 1,
  });
};
