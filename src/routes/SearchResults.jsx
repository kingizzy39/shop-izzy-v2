import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import ResetFilters from "../components/ResetFilters";
import Pagination from "../components/Pagination";
import { formatPrice } from "../utils/format";
import { PRODUCTS_PER_PAGE } from "../utils/constants";
import { getProductsPaginated, searchProducts } from "../data";

const SearchResults = () => {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get search query from URL
  const query = searchParams.get("q") || "";

  // Get initial filters from URL or set defaults
  const [filters, setFilters] = useState(() => {
    const urlCategories = searchParams.getAll("category");
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 500000;
    const urlRatings = searchParams.getAll("rating");
    const inStock = searchParams.get("inStock") === "true";

    const initialCategories = new Set(urlCategories);

    return {
      categories: initialCategories,
      minPrice,
      maxPrice,
      ratings: new Set(urlRatings),
      inStock,
    };
  });

  const [sort, setSort] = useState(() => {
    return searchParams.get("sort") || "relevance";
  });

  // Page state - synced with URL
  const [page, setPage] = useState(() => {
    return Math.max(1, parseInt(searchParams.get("page")) || 1);
  });

  // Sync filters with URL when they change
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    // Search query
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }

    // Categories
    if (filters.categories.size > 0) {
      filters.categories.forEach((cat) => newParams.append("category", cat));
    } else {
      newParams.delete("category");
    }

    // Price
    newParams.set("minPrice", filters.minPrice.toString());
    newParams.set("maxPrice", filters.maxPrice.toString());

    // Ratings
    if (filters.ratings.size > 0) {
      filters.ratings.forEach((rating) => newParams.append("rating", rating));
    } else {
      newParams.delete("rating");
    }

    // In stock
    newParams.set("inStock", filters.inStock.toString());

    // Sort
    newParams.set("sort", sort);

    // Page - reset to 1 when filters change
    newParams.set("page", "1");

    setSearchParams(newParams);
    setPage(1);
  }, [filters, sort, query, searchParams, setSearchParams]);

  // Prepare filters for pagination
  const paginationFilters = useMemo(
    () => ({
      category: filters.categories.size === 1 ? Array.from(filters.categories)[0] : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.ratings.size > 0 ? Math.min(...Array.from(filters.ratings).map(Number)) : undefined,
      sort,
    }),
    [filters, sort]
  );

  // Search products
  const searchedProducts = useMemo(
    () => searchProducts(products, query, paginationFilters),
    [products, query, paginationFilters]
  );

  // Get paginated products
  const { products: paginatedProducts, total, totalPages } = useMemo(
    () =>
      getProductsPaginated(searchedProducts, null, page, PRODUCTS_PER_PAGE, paginationFilters),
    [searchedProducts, page, paginationFilters]
  );

  // Sort products (already sorted by searchProducts, but keep for consistency)
  const sortedProducts = useMemo(() => {
    let sorted = [...paginatedProducts];

    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "relevance":
      default:
        sorted.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return a.price - b.price;
        });
        break;
    }

    return sorted;
  }, [paginatedProducts, sort]);

  // Get unique categories for filter checkboxes
  const uniqueCategories = useMemo(() => {
    return [...new Set(searchedProducts.map((p) => p.cat))];
  }, [searchedProducts]);

  // Get price range for slider
  const priceRange = useMemo(() => {
    if (searchedProducts.length === 0) return { min: 0, max: 500000 };

    const minPrice = Math.min(...searchedProducts.map((p) => p.price));
    const maxPrice = Math.max(...searchedProducts.map((p) => p.price));

    return {
      min: Math.floor(minPrice / 1000) * 1000,
      max: Math.ceil(maxPrice / 1000) * 1000,
    };
  }, [searchedProducts]);

  // Get unique ratings for filter checkboxes
  const uniqueRatings = useMemo(() => {
    return [...new Set(searchedProducts.map((p) => p.rating))].sort((a, b) => b - a);
  }, [searchedProducts]);

  // Reset filters to defaults
  const handleResetFilters = useCallback(() => {
    const defaultFilters = {
      categories: new Set(),
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      ratings: new Set(),
      inStock: true,
    };

    setFilters(defaultFilters);
    setSort("relevance");
  }, [priceRange, setFilters, setSort]);

  // Clear search query
  const handleClearSearch = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    setSearchParams(newParams);
    navigate("/shop");
  }, [searchParams, setSearchParams, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <header className="bg-background-elevated border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link to="/shop" className="btn-ghost text-sm mb-2 inline-flex">
                ← Back to Shop
              </Link>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-structural">
                Search Results
              </h1>
            </div>
            {query && (
              <div className="flex items-center gap-3">
                <p className="text-structural/60 self-end sm:self-auto">
                  {total} product{total !== 1 ? "s" : ""} found for &quot;{query}&quot;
                </p>
                <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Filters and Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Mobile Filter Toggle */}
              <button className="btn-primary w-full lg:hidden justify-center gap-2" onClick={() => {}}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Filters
              </button>

              <div className="space-y-6 border-t border-border pt-6 lg:pt-0">
                {/* Category Filters */}
                <div>
                  <h3 className="font-semibold text-structural mb-3">Category</h3>
                  <div className="space-y-2">
                    {uniqueCategories.map((categoryId) => {
                      const category = categories.find((c) => c.id === categoryId);
                      if (!category) return null;

                      const isChecked = filters.categories.has(categoryId);
                      return (
                        <label key={categoryId} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newCategories = new Set(filters.categories);
                              if (e.target.checked) {
                                newCategories.add(categoryId);
                              } else {
                                newCategories.delete(categoryId);
                              }
                              setFilters({ ...filters, categories: newCategories });
                            }}
                            className="h-4 w-4 rounded border-border text-gradient-amber focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-background-elevated"
                          />
                          <span className="ml-3 text-sm text-structural/70 hover:text-structural transition-colors cursor-pointer">
                            {category.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-structural mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-structural/60">
                      <span>&#x20A6;{priceRange.min.toLocaleString()}</span>
                      <span>&#x20A6;{priceRange.max.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={[filters.minPrice, filters.maxPrice]}
                      onChange={(e) => {
                        const values = e.target.value.split(",").map(Number);
                        setFilters({ ...filters, minPrice: values[0], maxPrice: values[1] });
                      }}
                      className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-sm text-structural/60 font-medium">
                      <span>&#x20A6;{formatPrice(filters.minPrice)}</span>
                      <span>&#x20A6;{formatPrice(filters.maxPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filters */}
                <div>
                  <h3 className="font-semibold text-structural mb-3">Rating</h3>
                  <div className="space-y-2">
                    {uniqueRatings.map((rating) => {
                      const isChecked = filters.ratings.has(rating.toString());
                      return (
                        <label key={rating} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newRatings = new Set(filters.ratings);
                              if (e.target.checked) {
                                newRatings.add(rating.toString());
                              } else {
                                newRatings.delete(rating.toString());
                              }
                              setFilters({ ...filters, ratings: newRatings });
                            }}
                            className="h-4 w-4 rounded border-border text-gradient-amber focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-background-elevated"
                          />
                          <span className="ml-3 text-sm text-structural/70 hover:text-structural transition-colors cursor-pointer flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= rating ? "text-amber-500" : "text-border"}>
                                ★
                              </span>
                            ))}
                            <span>{rating} star{rating === 1 ? "" : "s"}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold text-structural mb-3">Availability</h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-gradient-amber focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-background-elevated"
                    />
                    <span className="ml-3 text-sm text-structural/70 hover:text-structural transition-colors cursor-pointer">
                      In stock only
                    </span>
                  </label>
                </div>

                {/* Reset Filters */}
                <div className="border-t border-border pt-4">
                  <ResetFilters onReset={handleResetFilters} variant="outline" className="w-full" />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border">
              <h2 className="font-semibold text-structural">{total} products</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-structural/60">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input-premium w-auto px-8 py-2 text-sm appearance-none bg-background-elevated"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating: High to Low</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="p-2" aria-label="Grid view">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="sm" className="p-2" aria-label="List view">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showRating />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="card-premium p-12 max-w-md mx-auto">
                    <svg className="h-16 w-16 mx-auto text-border mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <h3 className="text-xl font-semibold text-structural mb-2">No products found</h3>
                    <p className="text-structural/60 mb-6">
                      {query ? `No products match "${query}"` : "No products match your current filters"}
                    </p>
                    <ResetFilters onReset={handleResetFilters} variant="outline">
                      Clear Filters
                    </ResetFilters>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl={window.location.pathname}
                  searchParams={searchParams}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;