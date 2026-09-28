import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test/utils';

// Mock the store
vi.mock('@/store', () => {
  const mockCart = { 'prod-1': 2, 'prod-2': 1 };
  const mockProducts = [
    { id: 'prod-1', name: 'Product 1', price: 10000, desc: 'Description 1', keyword: 'test', cat: 'electronics' },
    { id: 'prod-2', name: 'Product 2', price: 20000, desc: 'Description 2', keyword: 'test', cat: 'fashion' },
    { id: 'prod-3', name: 'Product 3', price: 30000, desc: 'Desc', keyword: 'test', cat: 'electronics' },
    { id: 'prod-4', name: 'Product 4', price: 40000, desc: 'Desc', keyword: 'test', cat: 'fashion' },
  ];

  return {
    useCart: () => mockCart,
    useAllProducts: () => mockProducts,
    useCartActions: () => ({
      removeFromCart: vi.fn(),
      updateCartQuantity: vi.fn(),
      clearCart: vi.fn(),
    }),
    useWishlistActions: () => ({
      addToWishlist: vi.fn(),
    }),
  };
});

// Import Cart after mocking
import Cart from './Cart';

describe('Cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCart = () => {
    return render(<Cart />, { initialEntries: ['/cart'] });
  };

  describe('Cart with Items', () => {
    it('renders cart items', () => {
      renderCart();

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('shows correct item count in header', () => {
      renderCart();

      expect(screen.getByText('3 items in your cart')).toBeInTheDocument();
    });

    it('shows proceed to checkout button', () => {
      renderCart();

      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      expect(checkoutButton).toBeInTheDocument();
    });

    it('shows continue shopping link at bottom', () => {
      renderCart();

      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toBeInTheDocument();
    });

    it('shows promo code input', () => {
      renderCart();

      const promoInput = screen.getByPlaceholderText('Enter promo code');
      expect(promoInput).toBeInTheDocument();
    });

    it('shows recommended products section', () => {
      renderCart();

      expect(screen.getByText('You Might Also Like')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
      expect(screen.getByText('Product 4')).toBeInTheDocument();
    });
  });
});