import apiClient from "@/lib/apiClient";

import { getCategories } from "@/api/category.api";
import { getProducts } from "@/api/product.api";

import type { ApiResponse } from "@/types/auth.type";

import type {
  AdminOrderDetails,
  AdminOrderList,
  AdminOrderQuery,
  AdminSummary,
  OrderStatus,
} from "@/types/admin.type";

// Orders list
export const getAdminOrders = async (
  query: AdminOrderQuery,
  signal?: AbortSignal,
) => {
  const response = await apiClient<ApiResponse<AdminOrderList>>(
    "/api/v1/orders",
    {
      method: "GET",
      query,
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Order data is unavailable");
  }

  return response.data;
};

// Single order
export const getAdminOrder = async (id: string, signal?: AbortSignal) => {
  const response = await apiClient<ApiResponse<AdminOrderDetails>>(
    `/api/v1/orders/${encodeURIComponent(id)}`,
    {
      method: "GET",
      signal,
    },
  );

  if (!response.data) {
    throw new Error("Order details are unavailable");
  }

  return response.data;
};

// Dashboard summary
export const getAdminSummary = async (
  signal?: AbortSignal,
): Promise<AdminSummary> => {
  const [orders, pending, products, users, categories] = await Promise.all([
    getAdminOrders(
      {
        page: 1,
        limit: 1,
      },
      signal,
    ),

    getAdminOrders(
      {
        page: 1,
        limit: 1,
        orderStatus: "PENDING",
      },
      signal,
    ),

    getProducts(
      {
        page: 1,
        limit: 1,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      signal,
    ),

    apiClient<
      ApiResponse<{
        pagination: {
          totalUsers: number;
        };
      }>
    >("/api/v1/users", {
      method: "GET",
      query: {
        page: 1,
        limit: 1,
      },
      signal,
    }),

    getCategories(signal),
  ]);

  if (!products.data || !users.data || !categories.data) {
    throw new Error("Dashboard summary is unavailable");
  }

  return {
    totalOrders: orders.pagination.totalOrders,
    pendingOrders: pending.pagination.totalOrders,
    availableFoods: products.data.pagination.totalProducts,
    totalUsers: users.data.pagination.totalUsers,
    activeCategories: categories.data.length,
  };
};

// Update order status
export const updateAdminOrderStatus = (payload: {
  id: string;
  orderStatus: OrderStatus;
}) => {
  return apiClient<ApiResponse>(
    `/api/v1/orders/${encodeURIComponent(payload.id)}/status`,
    {
      method: "PATCH",
      body: {
        orderStatus: payload.orderStatus,
      },
    },
  );
};

// Dedicated cancellation endpoint
export const cancelAdminOrder = (id: string) => {
  return apiClient<ApiResponse>(
    `/api/v1/orders/${encodeURIComponent(id)}/cancel`,
    {
      method: "PATCH",
    },
  );
};
