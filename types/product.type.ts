export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime: number | null;

  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductQuery {
  page: number;
  limit: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: "createdAt" | "price" | "name";
  sortOrder: "asc" | "desc";
}

export interface ProductList {
  products: Product[];

  pagination: {
    totalProducts: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export type PriceFilters = Pick<ProductQuery, "minPrice" | "maxPrice">;
