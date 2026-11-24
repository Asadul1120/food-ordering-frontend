import type { OrderStatus, AdminOrder } from "@/types/admin.type";

export interface CustomerOrder extends AdminOrder {
  updatedAt: string;
  orderItems: { id: string; productId: string; productName: string; productPrice: string; quantity: number; subtotal: string }[];
}
export interface MyOrdersQuery { page: number; limit: number; orderStatus?: OrderStatus }
export interface MyOrdersResponse {
  orders: CustomerOrder[];
  pagination: { totalOrders: number; currentPage: number; totalPages: number; limit: number };
}
export interface ProfilePayload {
  name?: string;
  phone?: string;
  deliveryAddress?: string | null;
  city?: string | null;
  area?: string | null;
  postalCode?: string | null;
}
export interface WishlistPayload {
  foodName: string;
  foodDescription: string;
  expectedTime: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}
export interface Wishlist {
  id: string;
  foodName: string;
  foodDescription: string;
  expectedTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: string;
}
export interface MyWishlistsResponse {
  wishlists: Wishlist[];
  pagination: { totalWishlists: number; currentPage: number; totalPages: number; limit: number };
}
