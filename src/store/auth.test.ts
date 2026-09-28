import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './index';

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

describe('Auth Store', () => {
  beforeEach(() => {
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

  describe('Shopper Authentication', () => {
    const createValidToken = (overrides = {}) => ({
      type: 'shopper' as const,
      userId: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      ...overrides,
    });

    it('should set shopper token', () => {
      const { setShopperToken } = useStore.getState();
      const token = createValidToken();

      setShopperToken(token);

      expect(useStore.getState().shopperToken).toEqual(token);
    });

    it('should clear shopper token and user on clearShopperToken', () => {
      const { setShopperToken, clearShopperToken } = useStore.getState();
      const token = createValidToken();
      setShopperToken(token);
      useStore.setState({ user: { name: 'Test', email: 'test@example.com' } });

      clearShopperToken();

      expect(useStore.getState().shopperToken).toBeNull();
      expect(useStore.getState().user).toBeNull();
    });

    it('should return true for valid shopper token', () => {
      const { setShopperToken, isShopperAuthenticated } = useStore.getState();
      const token = createValidToken();
      setShopperToken(token);

      expect(isShopperAuthenticated()).toBe(true);
    });

    it('should return false for null shopper token', () => {
      const { isShopperAuthenticated } = useStore.getState();

      expect(isShopperAuthenticated()).toBe(false);
    });

    it('should return false for expired shopper token', () => {
      const { setShopperToken, isShopperAuthenticated } = useStore.getState();
      const expiredToken = createValidToken({ expiresAt: Date.now() - 1000 });
      setShopperToken(expiredToken);

      expect(isShopperAuthenticated()).toBe(false);
    });

    it('should get current shopper from valid token', () => {
      const { setShopperToken, getCurrentShopper } = useStore.getState();
      const token = createValidToken({ name: 'John Doe', email: 'john@example.com' });
      setShopperToken(token);

      const shopper = getCurrentShopper();

      expect(shopper).toEqual({ name: 'John Doe', email: 'john@example.com' });
    });

    it('should return null for current shopper with expired token', () => {
      const { setShopperToken, getCurrentShopper } = useStore.getState();
      const expiredToken = createValidToken({ expiresAt: Date.now() - 1000 });
      setShopperToken(expiredToken);

      const shopper = getCurrentShopper();

      expect(shopper).toBeNull();
    });

    it('should logout shopper', () => {
      const { setShopperToken, logoutShopper } = useStore.getState();
      const token = createValidToken();
      setShopperToken(token);
      useStore.setState({ user: { name: 'Test', email: 'test@example.com' } });

      logoutShopper();

      expect(useStore.getState().shopperToken).toBeNull();
      expect(useStore.getState().user).toBeNull();
    });
  });

  describe('Seller Authentication', () => {
    const createValidSellerToken = (overrides = {}) => ({
      type: 'seller' as const,
      userId: 'seller-123',
      email: 'seller@example.com',
      name: 'Store Owner',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      ...overrides,
    });

    it('should set seller token', () => {
      const { setSellerToken } = useStore.getState();
      const token = createValidSellerToken();

      setSellerToken(token);

      expect(useStore.getState().sellerToken).toEqual(token);
    });

    it('should clear seller token, seller, and profile on clearSellerToken', () => {
      const { setSellerToken, clearSellerToken } = useStore.getState();
      const token = createValidSellerToken();
      setSellerToken(token);
      useStore.setState({
        seller: { name: 'Test', storeName: 'Test Store', email: 'test@example.com', phone: '123' },
        sellerProfile: { id: '1', name: 'Test', email: 'test@example.com', bio: 'Bio' },
      });

      clearSellerToken();

      expect(useStore.getState().sellerToken).toBeNull();
      expect(useStore.getState().seller).toBeNull();
      expect(useStore.getState().sellerProfile).toBeNull();
    });

    it('should return true for valid seller token', () => {
      const { setSellerToken, isSellerAuthenticated } = useStore.getState();
      const token = createValidSellerToken();
      setSellerToken(token);

      expect(isSellerAuthenticated()).toBe(true);
    });

    it('should return false for expired seller token', () => {
      const { setSellerToken, isSellerAuthenticated } = useStore.getState();
      const expiredToken = createValidSellerToken({ expiresAt: Date.now() - 1000 });
      setSellerToken(expiredToken);

      expect(isSellerAuthenticated()).toBe(false);
    });

    it('should get current seller from valid token', () => {
      const { setSellerToken, getCurrentSeller } = useStore.getState();
      const token = createValidSellerToken({ name: 'Jane Doe', email: 'jane@example.com' });
      setSellerToken(token);

      const seller = getCurrentSeller();

      expect(seller).toEqual({ name: 'Jane Doe', email: 'jane@example.com', storeName: '' });
    });

    it('should logout seller', () => {
      const { setSellerToken, logoutSeller } = useStore.getState();
      const token = createValidSellerToken();
      setSellerToken(token);
      useStore.setState({
        seller: { name: 'Test', storeName: 'Test Store', email: 'test@example.com', phone: '123' },
        sellerProfile: { id: '1', name: 'Test', email: 'test@example.com', bio: 'Bio' },
      });

      logoutSeller();

      expect(useStore.getState().sellerToken).toBeNull();
      expect(useStore.getState().seller).toBeNull();
      expect(useStore.getState().sellerProfile).toBeNull();
    });
  });

  describe('Token persistence', () => {
    it('should persist shopper token to localStorage', () => {
      const { setShopperToken } = useStore.getState();
      const token = {
        type: 'shopper' as const,
        userId: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      setShopperToken(token);

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedData = mockLocalStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);
      expect(parsed.state.shopperToken).toEqual(token);
    });

    it('should persist seller token to localStorage', () => {
      const { setSellerToken } = useStore.getState();
      const token = {
        type: 'seller' as const,
        userId: 'seller-123',
        email: 'seller@example.com',
        name: 'Store Owner',
        issuedAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      setSellerToken(token);

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedData = mockLocalStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);
      expect(parsed.state.sellerToken).toEqual(token);
    });
  });
});