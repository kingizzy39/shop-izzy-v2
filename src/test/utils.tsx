import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes } from 'react-router-dom';
import { useStore } from '../store';

// Test providers wrapper - memoized to prevent infinite re-renders
const TestProviders = React.memo(({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
));

// Extended render with providers
const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] } = {}
) => {
  const { initialEntries = ['/'], ...renderOptions } = options;
  // Create a stable wrapper that doesn't recreate on each render
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestProviders initialEntries={initialEntries}>{children}</TestProviders>
  );
  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

// Helper to create a full app render with routes
export const renderWithRoutes = (
  routes: React.ReactNode,
  options: { initialEntries?: string[] } = {}
) => {
  return customRender(
    <BrowserRouter>
      <Routes>{routes}</Routes>
    </BrowserRouter>,
    options
  );
};

// Helper to get store state in tests
export const getStoreState = () => useStore.getState();

// Helper to reset all stores
export const resetStores = () => {
  useStore.setState({
    cart: {},
    wishlist: {},
    shopperToken: null,
    sellerToken: null,
    user: null,
    seller: null,
    sellerProfile: null,
  });
};

// Test IDs for common elements
export const TEST_IDS = {
  // Layout
  HEADER: 'header',
  FOOTER: 'footer',
  CART_BUTTON: 'cart-button',
  CART_COUNT: 'cart-count',
  MOBILE_MENU_BUTTON: 'mobile-menu-button',
  MOBILE_DRAWER: 'mobile-drawer',

  // Auth
  AUTH_TABS: 'auth-tabs',
  SIGNUP_TAB: 'signup-tab',
  LOGIN_TAB: 'login-tab',
  AUTH_EMAIL: 'auth-email',
  AUTH_PASSWORD: 'auth-password',
  AUTH_CONFIRM_PASSWORD: 'auth-confirm-password',
  AUTH_SUBMIT: 'auth-submit',
  SELLER_JOIN_LINK: 'seller-join-link',

  // Cart
  CART_EMPTY: 'cart-empty',
  CART_ITEMS: 'cart-items',
  CART_ITEM: 'cart-item',
  CART_QUANTITY: 'cart-quantity',
  CART_REMOVE: 'cart-remove',
  CART_SUBTOTAL: 'cart-subtotal',
  CART_CHECKOUT: 'cart-checkout',

  // Category Listing
  CATEGORY_FILTER: 'category-filter',
  PRICE_RANGE_MIN: 'price-range-min',
  PRICE_RANGE_MAX: 'price-range-max',
  RATING_FILTER: 'rating-filter',
  IN_STOCK_FILTER: 'in-stock-filter',
  SORT_SELECT: 'sort-select',
  PRODUCT_GRID: 'product-grid',
  PRODUCT_CARD: 'product-card',
  PAGINATION: 'pagination',
  PAGE_LINK: 'page-link',

  // Product Detail
  PRODUCT_IMAGE: 'product-image',
  PRODUCT_NAME: 'product-name',
  PRODUCT_PRICE: 'product-price',
  PRODUCT_DESCRIPTION: 'product-description',
  PRODUCT_ADD_TO_CART: 'product-add-to-cart',
  COLOR_SWATCH: 'color-swatch',
  SPECS_TAB: 'specs-tab',
  REVIEWS_TAB: 'reviews-tab',

  // Checkout
  CHECKOUT_FORM: 'checkout-form',
  CHECKOUT_SHIPPING: 'checkout-shipping',
  CHECKOUT_PAYMENT: 'checkout-payment',
  CHECKOUT_SUBMIT: 'checkout-submit',

  // Seller Dashboard
  SELLER_TABS: 'seller-tabs',
  SELLER_OVERVIEW: 'seller-overview',
  SELLER_PRODUCTS: 'seller-products',
  SELLER_ORDERS: 'seller-orders',
  SELLER_SETTINGS: 'seller-settings',
  ADD_PRODUCT_BUTTON: 'add-product-button',
  PRODUCT_MODAL: 'product-modal',
} as const;

// Wait for async operations
export const waitFor = async (callback: () => void | Promise<void>, options?: { timeout?: number; interval?: number }) => {
  const { timeout = 1000, interval = 50 } = options || {};
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      await callback();
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  // Final attempt
  await callback();
};

// Fire event helpers
export const fireEvent = {
  click: (element: HTMLElement) => element.dispatchEvent(new MouseEvent('click', { bubbles: true })),
  change: (element: HTMLInputElement | HTMLSelectElement, value: string) => {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  },
  input: (element: HTMLInputElement, value: string) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  },
  submit: (element: HTMLFormElement) => element.dispatchEvent(new Event('submit', { bubbles: true })),
  keyDown: (element: HTMLElement, key: string) => element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })),
};