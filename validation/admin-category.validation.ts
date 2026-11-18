import { z } from "zod";

export const adminCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Category name cannot exceed 80 characters"),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine(
      (value) => value === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      "Use lowercase English letters, numbers and hyphens",
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters"),
});

export type AdminCategoryFormValues = z.infer<typeof adminCategorySchema>;
