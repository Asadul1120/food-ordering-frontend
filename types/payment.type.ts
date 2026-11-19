export type BkashCallbackStatus = "success" | "failure" | "cancel";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface VerifyPaymentPayload {
  paymentID: string;
  status: BkashCallbackStatus;
}

export interface VerifiedPayment {
  paymentStatus: PaymentStatus;
  alreadyVerified?: boolean;
  orderId?: string;
  orderNumber?: string;
  transactionId?: string | null;
  amount?: string | number;
  paidAt?: string | null;
}
