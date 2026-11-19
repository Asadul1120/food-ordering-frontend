
export type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "BKASH";

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderNote?: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;

  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  subtotal: string;
  deliveryCharge: string;
  discountAmount: string;
  totalAmount: string;
  orderStatus: string;
  guestToken?: string | null;
}

export interface InitiatePaymentPayload {
  orderId: string;
  guestToken?: string | null;
}

export interface PaymentInitiation {
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  requiresOnlinePayment: boolean;
  checkoutUrl: string | null;
}
