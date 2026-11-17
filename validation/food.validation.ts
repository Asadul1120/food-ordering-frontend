import { z } from "zod";

const optionalPrice = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter a valid price of 0 or more",
  );

export const foodPriceSchema = z
  .object({
    minPrice: optionalPrice,
    maxPrice: optionalPrice,
  })
  .refine(
    (value) =>
      !value.minPrice ||
      !value.maxPrice ||
      Number(value.minPrice) <= Number(value.maxPrice),
    {
      message: "Maximum price must be at least the minimum price",
      path: ["maxPrice"],
    },
  );
