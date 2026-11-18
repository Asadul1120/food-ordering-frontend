import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminUser,
  getAdminUsers,
  updateAdminUser,
  updateAdminUserStatus,
} from "@/api/admin-user.api";

import type { AdminUserQuery } from "@/types/admin-user.type";

export const useAdminUsers = (query: AdminUserQuery) => {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: ({ signal }) => getAdminUsers(query, signal),
    staleTime: 15_000,
    retry: 1,
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: ({ signal }) => getAdminUser(id, signal),
    enabled: Boolean(id),
    staleTime: 15_000,
    retry: 1,
  });
};

export const useAdminUserActions = () => {
  const queryClient = useQueryClient();

  const refreshUsers = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["admin", "user"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["admin", "summary"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["user"],
      }),
    ]);
  };

  const updateUser = useMutation({
    mutationFn: updateAdminUser,
    onSuccess: refreshUsers,
  });

  const updateStatus = useMutation({
    mutationFn: updateAdminUserStatus,
    onSuccess: refreshUsers,
  });

  return {
    updateUser,
    updateStatus,
  };
};
