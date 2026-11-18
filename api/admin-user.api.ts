import apiClient from "@/lib/apiClient";

import type { ApiResponse } from "@/types/auth.type";
import type {
  AdminUser,
  AdminUserList,
  AdminUserQuery,
  UpdateAdminUserPayload,
  UpdateAdminUserStatusPayload,
} from "@/types/admin-user.type";

export const getAdminUsers = async (
  query: AdminUserQuery,
  signal?: AbortSignal,
) => {
  const response = await apiClient<ApiResponse<AdminUserList>>(
    "/api/v1/users",
    {
      method: "GET",
      query,
      signal,
    },
  );

  if (!response.data) {
    throw new Error("User data is unavailable");
  }

  return response.data;
};

export const getAdminUser = async (
  id: string,
  signal?: AbortSignal,
) => {
  const response = await apiClient<ApiResponse<AdminUser>>(
    `/api/v1/users/${encodeURIComponent(id)}`,
    {
      method: "GET",
      signal,
    },
  );

  if (!response.data) {
    throw new Error("User details are unavailable");
  }

  return response.data;
};

export const updateAdminUser = ({
  id,
  body,
}: UpdateAdminUserPayload) => {
  return apiClient<ApiResponse<AdminUser>>(
    `/api/v1/users/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body,
    },
  );
};

export const updateAdminUserStatus = ({
  id,
  isActive,
}: UpdateAdminUserStatusPayload) => {
  return apiClient<ApiResponse<AdminUser>>(
    `/api/v1/users/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { isActive },
    },
  );
};
