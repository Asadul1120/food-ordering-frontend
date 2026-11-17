export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface AdminPayment {
  id: string;
  amount: string;

  paymentMethod:
    | "CASH_ON_DELIVERY"
    | "BKASH"
    | "NAGAD"
    | "STRIPE"
    | "SSLCOMMERZ";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  subtotal: string;
  discountAmount: string;
  deliveryCharge: string;
  totalAmount: string;
  orderStatus: OrderStatus;
  createdAt: string;
  payments: AdminPayment[];
}

export interface AdminOrderDetails extends AdminOrder {
  orderNote: string | null;

  orderItems: {
    id: string;
    productName: string;
    productPrice: string;
    quantity: number;
    subtotal: string;
  }[];
}

export interface AdminOrderQuery {
  page: number;
  limit: number;
  search?: string;
  orderStatus?: OrderStatus;
}

export interface AdminOrderList {
  orders: AdminOrder[];

  pagination: {
    totalOrders: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface AdminSummary {
  totalOrders: number;
  pendingOrders: number;
  availableFoods: number;
  totalUsers: number;
  activeCategories: number;
}