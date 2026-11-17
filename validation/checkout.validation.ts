import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{8,15}$/, "Enter a valid phone number"),

  email: z.union([z.literal(""), z.email("Enter a valid email address")]),

  address: z
    .string()
    .trim()
    .min(8, "Address must be at least 8 characters")
    .max(300, "Address is too long"),

  addressLine2: z.string().trim().max(100),

  city: z.string().trim().min(2, "City is required").max(60),

  postalCode: z.string().trim().max(20),

  paymentMethod: z.enum(["CASH_ON_DELIVERY", "BKASH"]),

  orderNote: z.string().trim().max(500),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
