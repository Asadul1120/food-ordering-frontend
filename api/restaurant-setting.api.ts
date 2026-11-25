import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/auth.type";
import type { RestaurantSetting } from "@/types/restaurant-setting.type";

const path = "/api/v1/restaurant-settings";

export const getRestaurantSetting = (signal?: AbortSignal) =>
  apiClient<ApiResponse<RestaurantSetting | null>>(path, { signal });

export const saveRestaurantSetting = (body: FormData) =>
  apiClient<ApiResponse<RestaurantSetting>>(path, {
    method: "PUT",
    body,
    retry: 0,
  });
