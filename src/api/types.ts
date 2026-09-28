// API Types - matching backend response structures

export interface Product {
  id: string;
  name: string;
  cat: string;
  price: number;
  was: number | null;
  rating: number;
  reviews: number;
  keyword: string;
  lock: number;
  desc: string;
  img?: string;
}

export interface Category {
  id: string;
  name: string;
  keyword: string;
  lock: number;
  img?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'rating';
  q?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
}

export interface CategoriesResponse {
  categories: Category[];
}