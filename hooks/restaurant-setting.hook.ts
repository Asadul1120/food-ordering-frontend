import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurantSetting,
  saveRestaurantSetting,
} from "@/api/restaurant-setting.api";

const queryKey = ["restaurant-setting"] as const;

export const useRestaurantSetting = () =>
  useQuery({
    queryKey,
    queryFn: ({ signal }) => getRestaurantSetting(signal),
  });

export const useSaveRestaurantSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveRestaurantSetting,
    onSuccess: async (response) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, response);
    },
  });
};
