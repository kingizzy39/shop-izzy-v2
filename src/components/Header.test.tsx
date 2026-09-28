import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import Header from './Header';
import { useStore } from '@/store';

describe('Header', () => {
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
    vi.clearAllMocks();
  });

  it('renders logo with correct text', () => {
    render(<Header />);

    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Izzy')).toBeInTheDocument();
  });

  it('renders search input on desktop', () => {
    render(<Header />);

    // Desktop search input has id="header-search"
    const searchInput = screen.getByTestId('header-search');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(<Header />);

    // There are 3 search buttons (desktop, mobile search button, mobile search form)
    // Get the desktop search form submit button
    const searchButtons = screen.getAllByRole('button', { name: /search/i });
    expect(searchButtons.length).toBeGreaterThanOrEqual(1);
    expect(searchButtons[0]).toBeInTheDocument();
  });

  it('renders wishlist link', () => {
    render(<Header />);

    const wishlistLink = screen.getByRole('link', { name: /wishlist/i });
    expect(wishlistLink).toBeInTheDocument();
  });

  it('renders cart link', () => {
    render(<Header />);

    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
  });

  it('shows cart count when items in cart', () => {
    useStore.setState({ cart: { 'product-1': 2, 'product-2': 1 } });
    render(<Header />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows wishlist count when items in wishlist', () => {
    useStore.setState({ wishlist: { 'product-1': true, 'product-2': true } });
    render(<Header />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not show count badge when cart is empty', () => {
    useStore.setState({ cart: {} });
    render(<Header />);

    // The cart count badge should not be rendered
    const badges = screen.queryAllByText(/^\d+$/);
    expect(badges.filter(b => b.closest('a[href="/cart"]'))).toHaveLength(0);
  });

  it('renders mobile menu button', () => {
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('has mobile search bar that opens when button is clicked', async () => {
    render(<Header />);

    // Click the mobile search button to open the search bar
    const mobileSearchButton = screen.getByRole('button', { name: /open search/i });
    expect(mobileSearchButton).toBeInTheDocument();

    // Click to open
    fireEvent.click(mobileSearchButton);

    // Wait for the state to update and mobile search bar to appear
    await waitFor(() => {
      const mobileSearch = screen.getByTestId('mobile-search');
      expect(mobileSearch).toBeInTheDocument();
    });
  });
});