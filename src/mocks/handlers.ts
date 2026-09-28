// MSW Handlers - Mock API responses for development and testing

import { http, HttpResponse } from 'msw';
import { PRODUCTS, CATEGORIES } from '../data';
import type { Product, Category, ProductFilters, ProductsResponse } from '../api/types';

const API_BASE_URL = '/api';

// Helper to filter products based on filters
function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let filtered = [...products];

  if (filters.category) {
    filtered = filtered.filter((p) => p.cat === filters.category);
  }
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.q) {
    const terms = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
    filtered = filtered.filter((product) => {
      const searchableText = [product.name, product.desc, product.cat, product.keyword]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return terms.every((term) => searchableText.includes(term));
    });
  }

  // Apply sorting
  switch (filters.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'relevance':
    default:
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.price - b.price;
      });
      break;
  }

  return filtered;
}

// Helper to paginate
function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = items.slice(start, start + perPage);
  return { data, total, page, perPage, totalPages };
}

export const handlers = [
  // GET /api/products - List products with filtering, sorting, pagination
  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') || '12', 10);

    const filters: ProductFilters = {};
    if (url.searchParams.get('category')) filters.category = url.searchParams.get('category')!;
    if (url.searchParams.get('minPrice')) filters.minPrice = parseFloat(url.searchParams.get('minPrice')!);
    if (url.searchParams.get('maxPrice')) filters.maxPrice = parseFloat(url.searchParams.get('maxPrice')!);
    if (url.searchParams.get('minRating')) filters.minRating = parseFloat(url.searchParams.get('minRating')!);
    if (url.searchParams.get('sort')) filters.sort = url.searchParams.get('sort') as ProductFilters['sort'];
    if (url.searchParams.get('q')) filters.q = url.searchParams.get('q')!;

    const filtered = filterProducts(PRODUCTS, filters);
    const paginated = paginate(filtered, page, perPage);

    return HttpResponse.json<ProductsResponse>({
      products: paginated.data,
      total: paginated.total,
      totalPages: paginated.totalPages,
    });
  }),

  // GET /api/products/:id - Get single product
  http.get(`${API_BASE_URL}/products/:id`, ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  // GET /api/categories - List categories
  http.get(`${API_BASE_URL}/categories`, () => {
    return HttpResponse.json<Category[]>(CATEGORIES);
  }),

  // GET /api/search - Search products
  http.get(`${API_BASE_URL}/search`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    const filters: ProductFilters = {};
    if (url.searchParams.get('category')) filters.category = url.searchParams.get('category')!;
    if (url.searchParams.get('minPrice')) filters.minPrice = parseFloat(url.searchParams.get('minPrice')!);
    if (url.searchParams.get('maxPrice')) filters.maxPrice = parseFloat(url.searchParams.get('maxPrice')!);
    if (url.searchParams.get('minRating')) filters.minRating = parseFloat(url.searchParams.get('minRating')!);
    if (url.searchParams.get('sort')) filters.sort = url.searchParams.get('sort') as ProductFilters['sort'];

    const filtered = filterProducts(PRODUCTS, { ...filters, q: query });

    return HttpResponse.json<Product[]>(filtered);
  }),

  // Cart endpoints
  http.get(`${API_BASE_URL}/cart`, () => {
    // Return empty cart for now - real implementation would use auth
    return HttpResponse.json([]);
  }),

  http.post(`${API_BASE_URL}/cart`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ productId: body.productId, quantity: body.quantity, product: PRODUCTS[0] }, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/cart/:productId`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ productId: 'p01', quantity: body.quantity, product: PRODUCTS[0] });
  }),

  http.delete(`${API_BASE_URL}/cart/:productId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Wishlist endpoints
  http.get(`${API_BASE_URL}/wishlist`, () => {
    return HttpResponse.json<string[]>([]);
  }),

  http.post(`${API_BASE_URL}/wishlist`, async ({ request }) => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.delete(`${API_BASE_URL}/wishlist/:productId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/shopper/login`, async ({ request }) => {
    const body = await request.json();
    // Mock successful login
    return HttpResponse.json({
      token: 'mock-shopper-token',
      user: { id: 'u1', email: body.email, name: 'Test User' },
    });
  }),

  http.post(`${API_BASE_URL}/auth/shopper/signup`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      token: 'mock-shopper-token',
      user: { id: 'u1', email: body.email, name: body.name },
    }, { status: 201 });
  }),

  http.post(`${API_BASE_URL}/auth/seller/login`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      token: 'mock-seller-token',
      seller: { id: 's1', email: body.email, businessName: 'Test Shop', businessType: 'individual', isVerified: false },
    });
  }),

  http.post(`${API_BASE_URL}/auth/seller/signup`, async ({ request }) => {
    return HttpResponse.json({
      token: 'mock-seller-token',
      seller: { id: 's1', businessName: 'Test Shop', businessType: 'individual', isVerified: false },
    }, { status: 201 });
  }),

  // Orders
  http.get(`${API_BASE_URL}/orders`, () => {
    return HttpResponse.json([]);
  }),

  http.get(`${API_BASE_URL}/orders/:id`, ({ params }) => {
    return HttpResponse.json({ id: params.id, status: 'pending' });
  }),

  http.post(`${API_BASE_URL}/orders`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'order-' + Date.now(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  // Seller endpoints
  http.get(`${API_BASE_URL}/seller/dashboard`, () => {
    return HttpResponse.json({
      stats: { totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 },
      recentOrders: [],
      topProducts: [],
    });
  }),

  http.get(`${API_BASE_URL}/seller/products`, () => {
    return HttpResponse.json([]);
  }),

  http.post(`${API_BASE_URL}/seller/products`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 'p-new', ...body }, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/seller/products/:id`, async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({ id: params.id, ...body });
  }),

  http.delete(`${API_BASE_URL}/seller/products/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];