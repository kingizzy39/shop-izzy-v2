# Next Steps — Detailed Implementation Plans

> Created: 2026-09-27
> Status: All core features complete. Four remaining workstreams.

---

## Overview

| Workstream        | Effort    | Dependencies    | Value                         |
| ----------------- | --------- | --------------- | ----------------------------- |
| **A. Test Suite** | ~2-3 days | None            | Foundation for safe refactors |
| **B. Pagination** | ~0.5 day  | None            | UX fix for large catalogs     |
| **C. Search**     | ~1 day    | None            | Core discovery feature        |
| **D. API Layer**  | ~2-3 days | (A recommended) | Backend readiness             |

**Recommended order:** A → B → C → D (tests first enables safe changes to B/C/D)

---

## Option A: Test Suite (Vitest + React Testing Library)

### Goal

Achieve meaningful coverage on critical paths: auth, cart, checkout, seller dashboard.

### 1. Setup (30 min)

```bash
# Install dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event

# Add test script to package.json
# "test": "vitest run",
# "test:watch": "vitest",
# "test:coverage": "vitest run --coverage"
```

**Files to create:**

```
vitest.config.ts           # Vitest config with React, coverage
src/test/setup.ts          # Global test setup (jest-dom, mocks)
src/test/utils.tsx         # Render wrapper with providers (Router, Zustand, Sentry)
```

### 2. Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "src/main.tsx",
        "src/vite-env.d.ts",
      ],
    },
  },
});
```

### 3. Test Setup (`src/test/setup.ts`)

```typescript
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Sentry
vi.mock("@sentry/react", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
  init: vi.fn(),
}));

// Mock PostHog
Object.defineProperty(window, "posthog", {
  value: { capture: vi.fn(), identify: vi.fn() },
  writable: true,
});

// Mock localStorage for Zustand persist
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });
```

### 4. Render Wrapper (`src/test/utils.tsx`)

```tsx
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useStore } from "../store";

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

### 5. Priority Test Files (in order)

| File                                  | Target           | Key Scenarios                                       |
| ------------------------------------- | ---------------- | --------------------------------------------------- |
| `src/store/cart.test.ts`              | Cart store       | add/remove/update/clear, persist, totals            |
| `src/store/auth.test.ts`              | Auth store       | login/logout/signup, redirect state, persist        |
| `src/routes/AuthPage.test.tsx`        | Auth page        | tab switching, validation, submit, seller link      |
| `src/routes/Cart.test.tsx`            | Cart page        | empty state, quantity edits, checkout link          |
| `src/routes/Checkout.test.tsx`        | Checkout         | form validation, order submission, success redirect |
| `src/components/Layout.test.tsx`      | Layout           | nav links, cart badge, auth state UI                |
| `src/routes/CategoryListing.test.tsx` | Category page    | filters, sorting, URL sync                          |
| `src/routes/SellerDashboard.test.tsx` | Seller dashboard | tabs, product CRUD, order status updates            |

### 6. CI Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run test:coverage
```

---

## Option B: Pagination (CategoryListing)

### Goal

Add server-ready pagination to CategoryListing with URL-synced page state.

### Current State

- `src/routes/CategoryListing.jsx` — filters/sort sync to URL via `useSearchParams`
- Mock data: `src/data.ts` → `products` array (55 items)
- No page parameter in URL or UI

### 1. URL Schema

```
(category route)
/category                    → page 1, all categories
/category?page=3             → page 3
/category/fashion            → page 1, fashion category
/category/fashion?page=2     → page 2, fashion category
/category/fashion?page=2&sort=price-asc&minPrice=1000&maxPrice=50000
```

### 2. Constants

```typescript
// src/utils/constants.ts (add)
export const PRODUCTS_PER_PAGE = 12; // 3 rows × 4 cols on desktop
```

### 3. Data Layer (`src/data.ts`)

```typescript
// Add paginated getter
export function getProductsPaginated(
  category: string | null,
  page: number,
  perPage: number,
  filters: ProductFilters = {},
): { products: Product[]; total: number; totalPages: number } {
  let filtered = products;

  if (category) filtered = filtered.filter((p) => p.category === category);
  // ... apply other filters (price, rating, inStock)

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return { products: paginated, total, totalPages };
}
```

### 4. CategoryListing Updates (`src/routes/CategoryListing.jsx`)

```jsx
// Add to existing useSearchParams logic
const [searchParams, setSearchParams] = useSearchParams();
const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

// In useEffect for filters/sort, preserve page or reset to 1
// When category/filters/sort change → setSearchParams({ ...params, page: '1' })

// Fetch paginated data
const { products, total, totalPages } = useMemo(
  () => getProductsPaginated(category, page, PRODUCTS_PER_PAGE, filters),
  [category, page, filters],
);

// Pagination UI component (reusable)
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(newPage) =>
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: String(newPage),
    })
  }
  baseUrl={category ? `/category/${category}` : "/category"}
/>;
```

### 5. Pagination Component (`src/components/Pagination.tsx`)

```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  baseUrl: string;
  maxVisible?: number; // default 5
}

// Render: Prev, 1, ..., current-1, current, current+1, ..., totalPages, Next
// Use <Link> for SEO-friendly URLs, onClick for SPA navigation
```

### 6. Testing

- Unit: `getProductsPaginated` edge cases (empty, single page, last page partial)
- Integration: CategoryListing renders correct page, URL updates, filters reset page

---

## Option C: Search

### Goal

Global product search with debounced input, results page, URL-synced query.

### 1. URL Schema

```
/search?q=iphone                    → search results page 1
/search?q=iphone&page=2             → page 2
/search?q=iphone&category=fashion   → filtered search
```

### 2. Search Data Function (`src/data.ts`)

```typescript
export function searchProducts(
  query: string,
  page: number,
  perPage: number,
  filters: ProductFilters = {},
): { products: Product[]; total: number; totalPages: number } {
  const normalizedQuery = query.toLowerCase().trim();

  let filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery) ||
      p.tags?.some((t) => t.toLowerCase().includes(normalizedQuery)),
  );

  // Apply additional filters
  if (filters.category)
    filtered = filtered.filter((p) => p.category === filters.category);
  // ... price, rating, inStock

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;

  return {
    products: filtered.slice(start, start + perPage),
    total,
    totalPages,
  };
}
```

### 3. Search Input Component (`src/components/SearchInput.tsx`)

```tsx
// Debounced input (300ms)
// On submit → navigate to `/search?q=${encodeURIComponent(query)}`
// Shows recent searches from localStorage (optional)
```

### 4. Search Results Page (`src/routes/SearchResults.jsx`)

```jsx
// New route file
// Reuses CategoryListing's filter/sort/pagination logic
// Adds "Search Results for: 'query'" header
// Shows result count + time
// Empty state with suggestions
```

### 5. Routing (`src/App.tsx`)

```tsx
import SearchResults from "./routes/SearchResults";

// In Routes:
<Route element={<Layout />}>
  <Route path="/search" element={<SearchResults />} />
  {/* existing routes */}
</Route>;
```

### 6. Header Integration (`src/components/Layout.tsx`)

```tsx
// Add SearchInput to header (desktop) or mobile drawer
// On mobile: expand on focus, collapse on blur/submit
```

### 7. Testing

- Unit: `searchProducts` — fuzzy match, case insensitivity, tag matching
- Integration: SearchInput debounce, navigation, results page renders
- E2E: Type → submit → results → paginate → filter → sort

---

## Option D: API Layer (Backend Readiness)

### Goal

Replace mock data imports with API service layer, add React Query for caching, prepare for real backend.

### 1. Architecture

```
src/
├── api/
│   ├── client.ts          # Axios/Fetch wrapper with interceptors
│   ├── endpoints.ts       # API endpoint constants
│   ├── products.ts        # Product API calls
│   ├── auth.ts            # Auth API calls
│   ├── cart.ts            # Cart API calls
│   ├── orders.ts          # Order API calls
│   └── seller.ts          # Seller API calls
├── hooks/
│   ├── useProducts.ts     # React Query hooks for products
│   ├── useAuth.ts         # React Query hooks for auth
│   └── ...
└── stores/
    └── (Zustand for client-only state: UI, optimistic updates)
```

### 2. Dependencies

```bash
npm install @tanstack/react-query axios
npm install -D msw  # Mock Service Worker for API mocking in tests/dev
```

### 3. API Client (`src/api/client.ts`)

```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  withCredentials: true, // for cookie-based auth
});

// Request interceptor: attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401, refresh token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt refresh, else redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### 4. React Query Provider (`src/main.tsx`)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

### 5. Product API (`src/api/products.ts`)

```typescript
import { api } from "./client";
import type { Product, ProductFilters, PaginatedResponse } from "../types";

export const productsApi = {
  list: (params: { page: number; perPage: number } & ProductFilters) =>
    api.get<PaginatedResponse<Product>>("/products", { params }),

  get: (id: string) => api.get<Product>(`/products/${id}`),

  search: (
    query: string,
    params: { page: number; perPage: number } & ProductFilters,
  ) =>
    api.get<PaginatedResponse<Product>>("/products/search", {
      params: { q: query, ...params },
    }),

  getCategories: () => api.get<string[]>("/categories"),

  // Seller-only
  create: (data: CreateProductDTO) =>
    api.post<Product>("/seller/products", data),
  update: (id: string, data: UpdateProductDTO) =>
    api.patch<Product>(`/seller/products/${id}`, data),
  delete: (id: string) => api.delete(`/seller/products/${id}`),
};
```

### 6. React Query Hooks (`src/hooks/useProducts.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/products";

export const useProducts = (params: ProductListParams) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.list(params),
    select: (res) => res.data,
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.get(id),
    enabled: !!id,
    select: (res) => res.data,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};
```

### 7. MSW Setup for Dev/Tests (`src/mocks/`)

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { products } from "../data";

export const handlers = [
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const perPage = Number(url.searchParams.get("perPage") || 12);
    // ... filter/sort logic mirroring getProductsPaginated
    return HttpResponse.json({ data: paginated, total, totalPages });
  }),
  http.get("/api/products/:id", ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    return product
      ? HttpResponse.json(product)
      : new HttpResponse(null, { status: 404 });
  }),
  // ... auth, cart, orders, seller handlers
];

// src/mocks/browser.ts (dev)
export const worker = setupWorker(...handlers);

// src/mocks/node.ts (tests)
export const server = setupServer(...handlers);
```

### 8. Migration Strategy (Incremental)

| Phase | Action                                       | Files                                    |
| ----- | -------------------------------------------- | ---------------------------------------- |
| 1     | Add API layer + React Query + MSW            | New files only                           |
| 2     | Switch CategoryListing to `useProducts` hook | `CategoryListing.jsx`                    |
| 3     | Switch ProductDetail to `useProduct` hook    | `ProductDetail.jsx`                      |
| 4     | Switch SearchResults to search hook          | `SearchResults.jsx`                      |
| 5     | Migrate Cart/Checkout to API mutations       | `Cart.jsx`, `Checkout.jsx`               |
| 6     | Migrate Auth to API                          | `AuthPage.jsx`, `store/auth.ts`          |
| 7     | Migrate Seller Dashboard to API              | `SellerDashboard.jsx`, `store/seller.ts` |
| 8     | Remove `src/data.ts` imports from components | Cleanup                                  |

### 9. Environment Variables

```bash
# .env.example (add)
VITE_API_URL=http://localhost:4000/api
VITE_MSW_ENABLED=true
```

---

## Cross-Cutting Concerns

### TypeScript Types (`src/types/api.ts`)

```typescript
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
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popularity";
}
```

### Error Handling Pattern

```typescript
// API error type
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
}

// Toast integration in mutation onError
```

### Loading/Skeleton States

- Reuse existing skeleton components
- React Query `isLoading` / `isFetching` for granular states

---

## Effort Summary

| Workstream        | Setup | Core Implementation | Testing | Polish | Total     |
| ----------------- | ----- | ------------------- | ------- | ------ | --------- |
| **A. Tests**      | 30m   | 2 days              | -       | 4h     | ~2.5 days |
| **B. Pagination** | 15m   | 3h                  | 1h      | 30m    | ~0.5 day  |
| **C. Search**     | 30m   | 6h                  | 2h      | 1h     | ~1 day    |
| **D. API Layer**  | 1h    | 2 days              | 1 day   | 4h     | ~3.5 days |

**Total if sequential:** ~7.5 days
**Total if parallel (A + B/C, then D):** ~5 days

---

## Decision Matrix

| If you want...                    | Start with                         |
| --------------------------------- | ---------------------------------- |
| Safety net for all future changes | **A. Tests**                       |
| Quick visible win for users       | **B. Pagination** or **C. Search** |
| Backend integration soon          | **D. API Layer** (after A)         |
| All of the above eventually       | **A → B → C → D**                  |

---

## Next Action

Choose one and I'll start implementing:

```bash
# For tests:
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event

# For pagination:
# (no new deps needed)

# For search:
# (no new deps needed)

# For API layer:
npm install @tanstack/react-query axios
npm install -D msw
```
