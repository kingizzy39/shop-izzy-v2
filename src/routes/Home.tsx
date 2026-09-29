import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore, useAllProducts } from "../store/index";
import type { Product } from "../data";
import ProductCard from "../components/ProductCard";
import ErrorBoundary from "../components/ErrorBoundary";

// Safe array helper to ensure we always have an array
const safeArray = <T,>(arr: T[] | null | undefined): T[] =>
  Array.isArray(arr) ? arr : [];

const HomeContent = () => {
  const { categories, sellerProducts, hasHydrated } = useStore();
  const allProducts = useAllProducts();
  const [isReady, setIsReady] = useState(false);

  // Ensure allProducts is always an array
  const products = safeArray(allProducts);
  const sellerProdsArray = safeArray(sellerProducts);

  // Wait for store hydration and auth check to complete
  useEffect(() => {
    if (hasHydrated) {
      setIsReady(true);
    }
  }, [hasHydrated]);

  // Show loading while store is hydrating
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-gradient-amber border-t-transparent" />
          <p className="text-structural/60">Loading shop...</p>
        </div>
      </div>
    );
  }

  // Auth is handled by ProtectedRouteShopper wrapper in App.tsx
  // No additional guard needed here - component renders after auth check

  // Featured product sets (for demo, we'll use some products from each category)
  const featuredThisWeeksEdit = useMemo(() => products.slice(0, 4), [products]);
  const featuredFashionFavourites = useMemo(
    () => products.filter((p) => p.cat === "fashion").slice(0, 4),
    [products],
  );
  const featuredElectronicsWorthUpgrade = useMemo(
    () => products.filter((p) => p.cat === "electronics").slice(0, 4),
    [products],
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background-elevated py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-structural mb-6 animate-slide-up">
              Shop the <span className="text-gradient-amber">Izzy Way</span>
            </h1>
            <p
              className="text-lg sm:text-xl text-structural/60 mb-8 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              Discover curated collections of premium products from trusted
              sellers. Quality, style, and value — all in one place.
            </p>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                to="/category"
                className="btn-primary px-8 py-3.5 text-base"
              >
                Explore All Categories
              </Link>
              <Link
                to="/seller/join"
                className="btn-outline px-8 py-3.5 text-base"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-amber/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-1/4 right-10 w-72 h-72 bg-gradient-terracotta/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "500ms" }}
          />
          <div
            className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-amber/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/4 left-10 w-96 h-96 bg-gradient-terracotta/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-amber py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-2">
              <svg
                className="h-8 w-8 text-background/90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <h3 className="font-semibold text-background">Free Shipping</h3>
              <p className="text-sm text-background/80">
                On orders over &#x20A6;50,000
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2 border-y border-background/20 md:border-y-0 md:border-x border-background/20 px-8 py-4 md:py-0">
              <svg
                className="h-8 w-8 text-background/90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                <path d="M10 2v2M14 2v2M7 7h10" />
              </svg>
              <h3 className="font-semibold text-background">Easy Returns</h3>
              <p className="text-sm text-background/80">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <svg
                className="h-8 w-8 text-background/90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <h3 className="font-semibold text-background">Secure Payment</h3>
              <p className="text-sm text-background/80">100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="section-premium">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-structural mb-3">
              Shop by Category
            </h2>
            <p className="text-slate text-lg max-w-2xl mx-auto">
              Explore our curated collections across every category
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-background-elevated border border-border hover:border-border-strong transition-all duration-300"
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = `/images/placeholders/${category.id}.svg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-structural-deep/90 via-structural/30 to-transparent flex flex-col items-center justify-end p-6">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-background mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Browse collection
                  </p>
                </div>
                {/* Accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="section-premium bg-background-elevated">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-structural mb-3">
              Featured Collections
            </h2>
            <p className="text-slate text-lg max-w-2xl mx-auto">
              Hand-picked selections from our curators
            </p>
          </div>

          {/* This Week's Edit */}
          <div className="mb-16 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h3 className="font-display text-2xl font-bold text-structural mb-2">
                  This Week&apos;s Edit
                </h3>
                <p className="text-slate max-w-xl">
                  Our curators&apos; top picks for the moment
                </p>
              </div>
              <Link
                to="/category"
                className="btn-ghost text-sm font-medium self-end text-terracotta hover:text-terracotta-soft"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredThisWeeksEdit.map((product: Product) => (
                <ProductCard key={product.id} product={product} showRating />
              ))}
            </div>
          </div>

          {/* Fashion Favourites */}
          <div
            className="mb-16 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h3 className="font-display text-2xl font-bold text-structural mb-2">
                  Fashion Favourites
                </h3>
                <p className="text-slate max-w-xl">
                  Timeless style for every occasion
                </p>
              </div>
              <Link
                to="/category/fashion"
                className="btn-ghost text-sm font-medium self-end text-terracotta hover:text-terracotta-soft"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredFashionFavourites.map((product) => (
                <ProductCard key={product.id} product={product} showRating />
              ))}
            </div>
          </div>

          {/* Electronics Worth the Upgrade */}
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h3 className="font-display text-2xl font-bold text-structural mb-2">
                  Electronics Worth the Upgrade
                </h3>
                <p className="text-slate max-w-xl">
                  Latest tech that&apos;s worth every penny
                </p>
              </div>
              <Link
                to="/category/electronics"
                className="btn-ghost text-sm font-medium self-end text-terracotta hover:text-terracotta-soft"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredElectronicsWorthUpgrade.map((product) => (
                <ProductCard key={product.id} product={product} showRating />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seller Spotlight */}
      {sellerProdsArray.length > 0 && (
        <section className="section-premium">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-structural mb-3">
                From Our Sellers
              </h2>
              <p className="text-slate text-lg max-w-2xl mx-auto">
                Unique finds from independent sellers on Shop Izzy
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerProdsArray.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showRating
                  showSellerInfo
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-premium bg-background-elevated">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card-premium bg-gradient-structural-deep p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-terracotta" />
            <div className="mx-auto max-w-2xl relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-background mb-4">
                Start Selling on Shop Izzy
              </h2>
              <p className="text-background/70 text-lg mb-8">
                Join thousands of sellers reaching millions of customers. No
                setup fees, just a small commission on sales.
              </p>
              <Link
                to="/seller/join"
                className="btn-terracotta px-8 py-3.5 text-base"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Home = () => (
  <ErrorBoundary>
    <HomeContent />
  </ErrorBoundary>
);

export default Home;
