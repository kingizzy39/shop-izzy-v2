import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useAllProducts,
  useWishlist,
  useWishlistActions,
  useCartActions,
} from "../store/index";
import Button from "../components/Button";
import ImageWithFallback from "../components/ImageWithFallback";
import { formatPrice } from "../utils/format";

const Wishlist = () => {
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const wishlist = useWishlist();
  const { removeFromWishlist, clearWishlist } = useWishlistActions();
  const { addToCart } = useCartActions();

  // Get all products using optimized selector
  const allProducts = useAllProducts();

  // Get wishlist items with product details
  const wishlistItems = useMemo(() => {
    return Object.keys(wishlist)
      .map((productId) => {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) return null;
        return { product };
      })
      .filter(Boolean);
  }, [wishlist, allProducts]);

  const itemCount = useMemo(() => Object.keys(wishlist).length, [wishlist]);

  // Handle add to cart
  const handleAddToCart = (productId) => {
    addToCart(productId, 1);
  };

  // Handle remove from wishlist
  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  // Empty wishlist state
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card-premium p-12 sm:p-16 text-center animate-fade-in">
            <svg
              className="h-16 w-16 mx-auto text-border mb-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
            <h1 className="font-display text-3xl font-bold text-structural mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-structural/60 text-lg mb-8 max-w-md mx-auto">
              Save items you love for later. Start exploring to find your
              favorites!
            </p>
            <Link
              to="/shop"
              className="btn-primary inline-flex px-8 py-3.5 text-base"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-structural">
                  Wishlist
                </h1>
                <p className="text-structural/60 mt-1">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} saved for later
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowClearConfirm(true)}
                className="text-structural/60 hover:text-gradient-amber"
              >
                <svg
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear Wishlist
              </Button>
            </div>
          </header>

          <div className="animate-slide-up">
            <div className="card-premium overflow-hidden">
              {/* Wishlist Items Grid */}
              <div className="divide-y divide-border">
                {wishlistItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-6 transition-colors hover:bg-background-muted/50"
                  >
                    {/* Product Image & Info */}
                    <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/3 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-background-elevated border border-border"
                        aria-label={`View ${item.product.name}`}
                      >
                        <ImageWithFallback
                          product={{
                            keyword: item.product.keyword,
                            lock: item.product.lock,
                            cat: item.product.cat,
                          }}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-semibold text-structural line-clamp-2 hover:text-gradient-amber transition-colors group"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-structural/60 mt-1 line-clamp-1">
                          {item.product.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.product.id)}
                            className="text-structural/60 hover:text-rose-500"
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="hidden lg:block w-1/3 text-center lg:text-left text-structural font-medium">
                      {formatPrice(item.product.price)}
                      {item.product.was &&
                        item.product.was > item.product.price && (
                          <span className="block text-sm text-structural/50 line-through mt-1">
                            {formatPrice(item.product.was)}
                          </span>
                        )}
                    </div>

                    {/* Mobile Price */}
                    <div className="lg:hidden w-full flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-structural font-medium">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>

                    {/* Actions - Add to Cart */}
                    <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(item.product.id)}
                        className="w-full lg:w-auto"
                      >
                        <svg
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                        </svg>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div
              className="mt-6 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                to="/shop"
                className="btn-ghost inline-flex items-center gap-2"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Wishlist Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4"
          onClick={() => setShowClearConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-wishlist-title"
        >
          <div
            className="card-premium w-full max-w-md animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3
                id="clear-wishlist-title"
                className="font-display text-xl font-bold text-structural mb-2"
              >
                Clear Wishlist
              </h3>
              <p className="text-structural/60 mb-6">
                Are you sure you want to remove all items from your wishlist?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    clearWishlist();
                    setShowClearConfirm(false);
                  }}
                >
                  Yes, Clear Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
