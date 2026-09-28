import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category, PRODUCTS, CATEGORIES } from "../data";

// Custom storage that handles corrupted localStorage data gracefully
const safeStorage = {
  getItem: (name: string) => {
    try {
      const item = localStorage.getItem(name);
      if (!item) return null;
      return JSON.parse(item);
    } catch {
      // If parsing fails, remove corrupted data and return null
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
      // Ignore setItem errors (e.g., quota exceeded)
    }
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type WishlistItem = {
  productId: string;
};

export type SellerProfile = {
  id: string;
  name: string;
  email: string;
  bio: string;
};

export type User = {
  name: string;
  email: string;
};

export type Seller = {
  name: string;
  storeName: string;
  email: string;
  phone: string;
};

// Mock JWT-style session token types
export type AuthToken = {
  type: "shopper" | "seller";
  userId: string;
  email: string;
  name: string;
  issuedAt: number;
  expiresAt: number;
};

export type Review = {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  date: string;
};

interface StoreState {
  // Cart
  cart: Record<string, number>; // productId -> quantity
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: Record<string, boolean>; // productId -> true
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;

  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;

  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;

  // User authentication (legacy - kept for compatibility)
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;

  // Seller authentication (legacy - kept for compatibility)
  seller: Seller | null;
  setSeller: (seller: Seller | null) => void;
  clearSeller: () => void;

  // Seller profile
  sellerProfile: SellerProfile | null;
  setSellerProfile: (profile: SellerProfile) => void;
  clearSellerProfile: () => void;

  // Seller products
  sellerProducts: Product[];
  addSellerProduct: (product: Product) => void;
  removeSellerProduct: (productId: string) => void;
  updateSellerProduct: (product: Product) => void;

  // Reviews
  reviews: Record<string, Review[]>; // productId -> Review[]
  addReview: (review: Review) => void;
  removeReview: (productId: string, reviewId: string) => void;

  // Auth tokens (mock JWT-style session)
  shopperToken: AuthToken | null;
  sellerToken: AuthToken | null;
  setShopperToken: (token: AuthToken | null) => void;
  setSellerToken: (token: AuthToken | null) => void;
  clearShopperToken: () => void;
  clearSellerToken: () => void;
  // Check if tokens are valid (not expired)
  isShopperAuthenticated: () => boolean;
  isSellerAuthenticated: () => boolean;
  // Get current user/seller from tokens
  getCurrentShopper: () => { name: string; email: string } | null;
  getCurrentSeller: () => { name: string; email: string; storeName: string } | null;
  // Logout actions
  logoutShopper: () => void;
  logoutSeller: () => void;
}

function isTokenValid(token: AuthToken | null): boolean {
  if (!token) return false;
  return Date.now() < token.expiresAt;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: {},
      addToCart: (productId, quantity) =>
        set((state) => {
          const newCart = { ...state.cart };
          newCart[productId] = (newCart[productId] || 0) + quantity;
          return { cart: newCart };
        }),
      removeFromCart: (productId) =>
        set((state) => {
          const newCart = { ...state.cart };
          delete newCart[productId];
          return { cart: newCart };
        }),
      updateCartQuantity: (productId, quantity) =>
        set((state) => {
          const newCart = { ...state.cart };
          if (quantity <= 0) {
            delete newCart[productId];
          } else {
            newCart[productId] = quantity;
          }
          return { cart: newCart };
        }),
      clearCart: () => set({ cart: {} }),

      // Wishlist
      wishlist: {},
      addToWishlist: (productId) =>
        set((state) => ({
          wishlist: { ...state.wishlist, [productId]: true },
        })),
      removeFromWishlist: (productId) =>
        set((state) => {
          const newWishlist = { ...state.wishlist };
          delete newWishlist[productId];
          return { wishlist: newWishlist };
        }),
      clearWishlist: () => set({ wishlist: {} }),

      // Products
      products: PRODUCTS,
      setProducts: (products) => set({ products }),

      // Categories
      categories: CATEGORIES,
      setCategories: (categories) => set({ categories }),

      // User authentication (legacy)
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // Seller authentication (legacy)
      seller: null,
      setSeller: (seller) => set({ seller }),
      clearSeller: () => set({ seller: null }),

      // Seller products
      sellerProducts: [],
      addSellerProduct: (product) =>
        set((state) => {
          const existingIndex = state.sellerProducts.findIndex(
            (p) => p.id === product.id,
          );
          if (existingIndex >= 0) {
            const newSellerProducts = [...state.sellerProducts];
            newSellerProducts[existingIndex] = product;
            return { sellerProducts: newSellerProducts };
          } else {
            return { sellerProducts: [...state.sellerProducts, product] };
          }
        }),
      removeSellerProduct: (productId) =>
        set((state) => ({
          sellerProducts: state.sellerProducts.filter(
            (product) => product.id !== productId,
          ),
        })),
      updateSellerProduct: (product) =>
        set((state) => {
          const existingIndex = state.sellerProducts.findIndex(
            (p) => p.id === product.id,
          );
          if (existingIndex >= 0) {
            const newSellerProducts = [...state.sellerProducts];
            newSellerProducts[existingIndex] = product;
            return { sellerProducts: newSellerProducts };
          }
          return state;
        }),

      // Seller profile
      sellerProfile: null,
      setSellerProfile: (profile) => set({ sellerProfile: profile }),
      clearSellerProfile: () => set({ sellerProfile: null }),

      // Reviews
      reviews: {},
      addReview: (review) =>
        set((state) => {
          const newReviews = { ...state.reviews };
          if (!newReviews[review.productId]) {
            newReviews[review.productId] = [];
          }
          newReviews[review.productId].push(review);
          return { reviews: newReviews };
        }),
      removeReview: (productId, reviewId) =>
        set((state) => {
          const productReviews = state.reviews[productId] || [];
          const filtered = productReviews.filter((r) => r.id !== reviewId);
          return {
            reviews: {
              ...state.reviews,
              [productId]: filtered,
            },
          };
        }),

      // Auth tokens (mock JWT-style session)
      shopperToken: null,
      sellerToken: null,
      setShopperToken: (token) => set({ shopperToken: token }),
      setSellerToken: (token) => set({ sellerToken: token }),
      clearShopperToken: () => set({ shopperToken: null, user: null }),
      clearSellerToken: () => set({ sellerToken: null, seller: null, sellerProfile: null }),
      isShopperAuthenticated: () => isTokenValid(get().shopperToken),
      isSellerAuthenticated: () => isTokenValid(get().sellerToken),
      getCurrentShopper: () => {
        const token = get().shopperToken;
        if (!token || !isTokenValid(token)) return null;
        return { name: token.name, email: token.email };
      },
      getCurrentSeller: () => {
        const token = get().sellerToken;
        if (!token || !isTokenValid(token)) return null;
        return { name: token.name, email: token.email, storeName: "" };
      },
      logoutShopper: () => {
        set({ shopperToken: null, user: null });
      },
      logoutSeller: () => {
        set({ sellerToken: null, seller: null, sellerProfile: null });
      },
    }),
    {
      name: "shop-izzy-storage",
      storage: safeStorage,
    },
  ),
);

// Selector hooks for optimized subscriptions
// These only re-render when the specific derived value changes

/**
 * Get cart item count - only re-renders when cart changes
 */
export const useCartItemCount = () =>
  useStore((state) => Object.values(state.cart).reduce((sum, qty) => sum + qty, 0));

/**
 * Get wishlist item count - only re-renders when wishlist changes
 */
export const useWishlistItemCount = () =>
  useStore((state) => Object.keys(state.wishlist).length);

/**
 * Get all products (regular + seller) - only re-renders when products change
 */
export const useAllProducts = () =>
  useStore((state) => [...state.products, ...state.sellerProducts]);

/**
 * Check if shopper is authenticated - only re-renders when shopperToken changes
 */
export const useIsShopperAuthenticated = () =>
  useStore((state) => state.isShopperAuthenticated());

/**
 * Check if seller is authenticated - only re-renders when sellerToken changes
 */
export const useIsSellerAuthenticated = () =>
  useStore((state) => state.isSellerAuthenticated());

/**
 * Get current shopper - only re-renders when shopperToken changes
 */
export const useCurrentShopper = () =>
  useStore((state) => state.getCurrentShopper());

/**
 * Get current seller - only re-renders when sellerToken changes
 */
export const useCurrentSeller = () =>
  useStore((state) => state.getCurrentSeller());

/**
 * Get cart - only re-renders when cart changes
 */
export const useCart = () =>
  useStore((state) => state.cart);

/**
 * Get cart actions - only re-renders when cart actions change (never, they're stable)
 */
export const useCartActions = () =>
  useStore((state) => ({
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    updateCartQuantity: state.updateCartQuantity,
    clearCart: state.clearCart,
  }));

/**
 * Get wishlist actions - only re-renders when wishlist actions change (never, they're stable)
 */
export const useWishlistActions = () =>
  useStore((state) => ({
    addToWishlist: state.addToWishlist,
    removeFromWishlist: state.removeFromWishlist,
  }));

/**
 * Get products - only re-renders when products change
 */
export const useProducts = () =>
  useStore((state) => state.products);

/**
 * Get seller products - only re-renders when sellerProducts change
 */
export const useSellerProducts = () =>
  useStore((state) => state.sellerProducts);

/**
 * Get clearCart action - stable reference
 */
export const useClearCart = () =>
  useStore((state) => state.clearCart);

/**
 * Get seller profile - only re-renders when sellerProfile changes
 */
export const useSellerProfile = () =>
  useStore((state) => state.sellerProfile);

/**
 * Get seller product actions - stable references
 */
export const useSellerProductActions = () =>
  useStore((state) => ({
    addSellerProduct: state.addSellerProduct,
    removeSellerProduct: state.removeSellerProduct,
    updateSellerProduct: state.updateSellerProduct,
  }));

/**
 * Get clearSellerProfile action - stable reference
 */
export const useClearSellerProfile = () =>
  useStore((state) => state.clearSellerProfile);

/**
 * Get logoutSeller action - stable reference
 */
export const useLogoutSeller = () =>
  useStore((state) => state.logoutSeller);