
import type { Category } from "@/types/category.type";

export interface AdminCategory extends Category {
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCategoryPayload {
  id: string;
  body: FormData;
}

export interface UpdateCategoryStatusPayload {
  id: string;
  isActive: boolean;
}
