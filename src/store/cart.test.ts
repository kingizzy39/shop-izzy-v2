import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './index';

// Mock localStorage before tests
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useStore.setState({
      cart: {},
      wishlist: {},
      shopperToken: null,
      sellerToken: null,
      user: null,
      seller: null,
      sellerProfile: null,
    });
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should add a new product to cart with quantity 1', () => {
      const { addToCart } = useStore.getState();
      addToCart('product-1', 1);

      const cart = useStore.getState().cart;
      expect(cart).toEqual({ 'product-1': 1 });
    });

    it('should add a product with custom quantity', () => {
      const { addToCart } = useStore.getState();
      addToCart('product-1', 3);

      const cart = useStore.getState().cart;
      expect(cart).toEqual({ 'product-1': 3 });
    });

    it('should increment quantity when adding same product again', () => {
      const { addToCart } = useStore.getState();
      addToCart('product-1', 1);
      addToCart('product-1', 2);

      const cart = useStore.getState().cart;
      expect(cart).toEqual({ 'product-1': 3 });
    });

    it('should handle multiple different products', () => {
      const { addToCart } = useStore.getState();
      addToCart('product-1', 2);
      addToCart('product-2', 1);
      addToCart('product-3', 5);

      const cart = useStore.getState().cart;
      expect(cart).toEqual({
        'product-1': 2,
        'product-2': 1,
        'product-3': 5,
      });
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from cart', () => {
      const { addToCart, removeFromCart } = useStore.getState();
      addToCart('product-1', 2);
      addToCart('product-2', 1);

      removeFromCart('product-1');

      const cart = useStore.getState().cart;
      expect(cart).toEqual({ 'product-2': 1 });
    });

    it('should handle removing non-existent product gracefully', () => {
      const { removeFromCart } = useStore.getState();
      removeFromCart('non-existent');

      const cart = useStore.getState().cart;
      expect(cart).toEqual({});
    });

    it('should empty cart when removing last item', () => {
      const { addToCart, removeFromCart } = useStore.getState();
      addToCart('product-1', 1);

      removeFromCart('product-1');

      const cart = useStore.getState().cart;
      expect(cart).toEqual({});
    });
  });

  describe('updateCartQuantity', () => {
    it('should update quantity to a specific value', () => {
      const { addToCart, updateCartQuantity } = useStore.getState();
      addToCart('product-1', 1);

      updateCartQuantity('product-1', 5);

      const cart = useStore.getState().cart;
      expect(cart).toEqual({ 'product-1': 5 });
    });

    it('should remove product when quantity set to 0', () => {
      const { addToCart, updateCartQuantity } = useStore.getState();
      addToCart('product-1', 3);

      updateCartQuantity('product-1', 0);

      const cart = useStore.getState().cart;
      expect(cart).toEqual({});
    });

    it('should remove product when quantity set to negative', () => {
      const { addToCart, updateCartQuantity } = useStore.getState();
      addToCart('product-1', 2);

      updateCartQuantity('product-1', -1);

      const cart = useStore.getState().cart;
      expect(cart).toEqual({});
    });

    it('should add product when updating non-existent product with positive quantity', () => {
      const { updateCartQuantity, cart } = useStore.getState();
      // First check initial state is empty
      expect(cart).toEqual({});

      updateCartQuantity('non-existent', 5);

      const newCart = useStore.getState().cart;
      expect(newCart).toEqual({ 'non-existent': 5 });
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { addToCart, clearCart } = useStore.getState();
      addToCart('product-1', 2);
      addToCart('product-2', 3);
      addToCart('product-3', 1);

      clearCart();

      const cart = useStore.getState().cart;
      expect(cart).toEqual({});
    });

    it('should work on already empty cart', () => {
      const { clearCart } = useStore.getState();
      clearCart();

      const cart = useStore.getState().cart;
      expect(cart).toEqual({});
    });
  });

  describe('cart persistence', () => {
    it('should persist cart to localStorage', () => {
      const { addToCart } = useStore.getState();
      addToCart('product-1', 2);

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedData = mockLocalStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);
      expect(parsed.state.cart).toEqual({ 'product-1': 2 });
    });

    it('should have correct localStorage key', () => {
      const { addToCart } = useStore.getState();
      addToCart('product-1', 2);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'shop-izzy-storage',
        expect.any(String)
      );
    });
  });

  describe('cart totals', () => {
    it('should calculate total item count correctly', () => {
      const { addToCart } = useStore.getState();
      addToCart('product-1', 2);
      addToCart('product-2', 3);
      addToCart('product-3', 1);

      const cart = useStore.getState().cart;
      const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      expect(totalItems).toBe(6);
    });

    it('should return 0 for empty cart', () => {
      const cart = useStore.getState().cart;
      const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      expect(totalItems).toBe(0);
    });
  });
});