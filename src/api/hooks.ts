// React Query Hooks - data fetching with caching, background updates, etc.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Product, type Category, type ProductFilters, type ProductsResponse, type CartItem, type User, type Seller, type Order, type SellerDashboardData } from './client';

// Query Keys
export const queryKeys = {
  products: (filters: ProductFilters = {}) => ['products', filters] as const,
  product: (id: string) => ['product', id] as const,
  categories: () => ['categories'] as const,
  search: (query: string, filters: ProductFilters = {}) => ['search', query, filters] as const,
  cart: () => ['cart'] as const,
  wishlist: () => ['wishlist'] as const,
  orders: () => ['orders'] as const,
  order: (id: string) => ['order', id] as const,
  sellerDashboard: () => ['sellerDashboard'] as const,
  sellerProducts: () => ['sellerProducts'] as const,
};

// Products
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => api.getProducts(filters as Record<string, string>),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => api.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsPaginated(page: number, perPage: number, filters: ProductFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.products(filters), page, perPage],
    queryFn: () => api.getProductsPaginated(page, perPage, filters),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: api.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Search
export function useSearchProducts(query: string, filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.search(query, filters),
    queryFn: () => api.searchProducts(query, filters),
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Cart
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart(),
    queryFn: api.getCart,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => api.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    },
  });
}

// Wishlist
export function useWishlist() {
  return useQuery({
    queryKey: queryKeys.wishlist(),
    queryFn: api.getWishlist,
    staleTime: 1 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => api.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => api.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() });
    },
  });
}

// Auth
export function useLoginShopper() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.loginShopper(email, password),
  });
}

export function useSignupShopper() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) =>
      api.signupShopper(data),
  });
}

export function useLoginSeller() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.loginSeller(email, password),
  });
}

export function useSignupSeller() {
  return useMutation({
    mutationFn: (data: Record<string, string>) => api.signupSeller(data),
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders(),
    queryFn: api.getOrders,
    staleTime: 2 * 60 * 1000,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => api.getOrder(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { items: Array<{ productId: string; quantity: number }>; shippingAddress: Record<string, string>; paymentMethod: string }) =>
      api.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    },
  });
}

// Seller
export function useSellerDashboard() {
  return useQuery({
    queryKey: queryKeys.sellerDashboard(),
    queryFn: api.getSellerDashboard,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSellerProducts() {
  return useQuery({
    queryKey: queryKeys.sellerProducts(),
    queryFn: api.getSellerProducts,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => api.createSellerProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sellerProducts() });
    },
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      api.updateSellerProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sellerProducts() });
    },
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteSellerProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sellerProducts() });
    },
  });
}