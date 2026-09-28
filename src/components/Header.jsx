import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartItemCount, useWishlistItemCount } from "../store/index";

const Header = () => {
  const cartItemCount = useCartItemCount();
  const wishlistItemCount = useWishlistItemCount();
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <header className="bg-structural-deep/95 backdrop-blur-md border-b border-structural-muted/30 sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            to="/shop"
            className="flex items-center space-x-3"
            aria-label="Shop Izzy Home"
          >
            <span className="text-2xl font-bold font-display text-gradient-amber">
              Shop
            </span>
            <span className="text-2xl font-bold font-display text-background">
              Izzy
            </span>
          </Link>
        </div>
        {/* Search Form */}
        <div className="hidden lg:flex lg:flex-1 lg:w-1/2 mx-8">
          <form
            className="relative w-full"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("q");
              handleSearch(query);
            }}
          >
            <label htmlFor="header-search" className="sr-only">
              Search for products, brands and categories
            </label>
            <input
              id="header-search"
              name="q"
              data-testid="header-search"
              type="search"
              placeholder="Search for products, brands and categories"
              className="input-premium w-full pl-12 pr-4 py-3 text-base bg-background-elevated text-structural placeholder-structural-subtle"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute inset-y-0 left-0 flex items-center pl-4 text-structural-subtle hover:text-background transition-colors"
              aria-label="Search"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 21l-4.35-4.35M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0z" />
              </svg>
            </button>
          </form>
        </div>
        {/* Mobile Search Button */}
        <div className="lg:hidden flex items-center">
          <button
            className="btn-ghost p-2"
            aria-label={showMobileSearch ? "Close search" : "Open search"}
            aria-expanded={showMobileSearch}
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 21l-4.35-4.35M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0z" />
            </svg>
          </button>
        </div>
        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative btn-ghost p-2 lg:p-3 transition-colors text-background"
            aria-label={`Wishlist${wishlistItemCount > 0 ? `, ${wishlistItemCount} items` : ""}`}
          >
            <svg
              className="h-5 w-5 lg:h-6 lg:w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {wishlistItemCount > 0 ? (
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              ) : (
                <path d="M12 21l-7.8-7.6 1-1a5.5 5.5 0 1 0 7.8-7.8l1 1L12 5.6l1 1a5.5 5.5 0 0 0 7.8 7.8l1 1L12 21z" />
              )}
            </svg>
            {wishlistItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-amber text-[0.625rem] font-bold text-background">
                {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
              </span>
            )}
          </Link>
          {/* Cart */}
          <Link
            to="/cart"
            className="relative bg-background/10 hover:bg-background/20 p-2 lg:p-3 transition-all group rounded-lg"
            aria-label={`Cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ", empty"}`}
          >
            <svg
              className="h-5 w-5 lg:h-6 lg:w-6 text-background"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span className="hidden lg:inline-flex items-center justify-center ml-2 font-semibold text-background">
              Cart
            </span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-amber text-[0.625rem] font-bold text-background border-2 border-structural-deep">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden btn-ghost p-2 text-background"
            aria-label="Open menu"
            aria-expanded="false"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="lg:hidden border-t border-structural-muted/30 px-4 py-4 animate-slide-down bg-structural-deep/95">
          <form
            className="relative"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("q");
              handleSearch(query);
            }}
          >
            <label htmlFor="mobile-search" className="sr-only">
              Search for products, brands and categories
            </label>
            <input
              id="mobile-search"
              name="q"
              data-testid="mobile-search"
              type="search"
              placeholder="Search for products, brands and categories"
              className="input-premium w-full pl-10 pr-4 py-3 text-background placeholder-structural-subtle"
              autoComplete="off"
              autoFocus
            />
            <button
              type="submit"
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-structural-subtle"
              aria-label="Search"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 21l-4.35-4.35M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
