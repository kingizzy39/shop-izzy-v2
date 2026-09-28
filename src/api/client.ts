// API Client - handles HTTP requests to the backend

import type { Product, Category, ProductFilters, ProductsResponse, CartItem, User, Seller, SignupData, SellerSignupData, OrderData, Address, Order, OrderItem, SellerDashboardData } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new ApiError(
      errorText || response.statusText,
      response.status,
      response.statusText
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('shopperToken') || localStorage.getItem('sellerToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const api = {
  // Products
  async getProducts(filters: Record<string, string> = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse<ProductsResponse>(response);
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse<Product>(response);
  },

  async getProductsPaginated(
    page: number,
    perPage: number,
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
      ),
    });
    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse<ProductsResponse>(response);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getHeaders(),
    });
    return handleResponse<Category[]>(response);
  },

  // Search
  async searchProducts(query: string, filters: ProductFilters = {}): Promise<Product[]> {
    const params = new URLSearchParams({
      q: query,
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
      ),
    });
    const response = await fetch(`${API_BASE_URL}/search?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(response);
  },

  // Cart
  async getCart(): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getHeaders(),
    });
    return handleResponse<CartItem[]>(response);
  },

  async addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse<CartItem>(response);
  },

  async updateCartItem(productId: string, quantity: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<CartItem>(response);
  },

  async removeFromCart(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<void>(response);
  },

  // Wishlist
  async getWishlist(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getHeaders(),
    });
    return handleResponse<string[]>(response);
  },

  async addToWishlist(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId }),
    });
    return handleResponse<void>(response);
  },

  async removeFromWishlist(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<void>(response);
  },

  // Auth
  async loginShopper(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/shopper/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string; user: User }>(response);
  },

  async signupShopper(data: SignupData): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/shopper/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ token: string; user: User }>(response);
  },

  async loginSeller(email: string, password: string): Promise<{ token: string; seller: Seller }> {
    const response = await fetch(`${API_BASE_URL}/auth/seller/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string; seller: Seller }>(response);
  },

  async signupSeller(data: SellerSignupData): Promise<{ token: string; seller: Seller }> {
    const response = await fetch(`${API_BASE_URL}/auth/seller/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ token: string; seller: Seller }>(response);
  },

  // Orders
  async createOrder(data: OrderData): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Order>(response);
  },

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(),
    });
    return handleResponse<Order[]>(response);
  },

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse<Order>(response);
  },

  // Seller
  async getSellerDashboard(): Promise<SellerDashboardData> {
    const response = await fetch(`${API_BASE_URL}/seller/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse<SellerDashboardData>(response);
  },

  async getSellerProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/seller/products`, {
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(response);
  },

  async createSellerProduct(data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/seller/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },

  async updateSellerProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/seller/products/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },

  async deleteSellerProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/seller/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<void>(response);
  },
};

// Additional types needed for the API
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Seller {
  id: string;
  email: string;
  businessName: string;
  businessType: string;
  isVerified: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface SellerSignupData {
  email: string;
  password: string;
  businessName: string;
  businessType: string;
  contactPerson: string;
  phone: string;
  address: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface OrderData {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface SellerDashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  recentOrders: Order[];
  topProducts: Array<{ product: Product; sales: number }>;
}

export { ApiError };
export type { ProductFilters, Product, Category, ProductsResponse, Category as CategoryType };