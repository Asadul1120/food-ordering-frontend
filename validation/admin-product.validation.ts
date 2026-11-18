
import { z } from "zod";

export const adminProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  categoryId: z.string().min(1, "Select a category"),

  slug: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase English letters, numbers and hyphens",
      ),
  ]),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters"),

  price: z
    .string()
    .trim()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Enter a price with up to 2 decimal places",
    )
    .refine(
      (value) => Number(value) > 0,
      "Price must be greater than 0",
    ),

  preparationTime: z.string().refine(
    (value) =>
      value === "" ||
      (/^\d+$/.test(value) && Number(value) > 0),
    "Preparation time must be a positive whole number",
  ),
});

export type AdminProductFormValues = z.infer<
  typeof adminProductSchema
>;
