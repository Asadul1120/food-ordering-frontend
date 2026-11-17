import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/api/category.api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],

    queryFn: ({ signal }) => getCategories(signal),

    staleTime: 60 * 1000,

    retry: 1,
  });
};
