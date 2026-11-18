
export interface AdminProductQuery {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  sortBy: "createdAt" | "price" | "name";
  sortOrder: "asc" | "desc";
}
