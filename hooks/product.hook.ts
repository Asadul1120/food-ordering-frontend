import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/api/product.api";
import type { ProductQuery } from "@/types/product.type";

export const useProducts = (query: ProductQuery) => {
  return useQuery({
    queryKey: ["products", query],

    queryFn: ({ signal }) => getProducts(query, signal),

    staleTime: 30 * 1000,

    retry: 1,
  });
};
