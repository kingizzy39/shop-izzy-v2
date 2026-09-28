import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAllProducts, useCart, useCartActions, useWishlistActions } from "../store/index";
import Button from "../components/Button";
import ImageWithFallback from "../components/ImageWithFallback";
import { formatPrice } from "../utils/format";

const Cart = () => {
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const cart = useCart();
  const { removeFromCart, updateCartQuantity, clearCart } = useCartActions();
  const { addToWishlist } = useWishlistActions();

  // Get all products using optimized selector
  const allProducts = useAllProducts();

  // Get cart items with product details
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) return null;
        return { product, quantity };
      })
      .filter(Boolean);
  }, [cart, allProducts]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const shipping = subtotal >= 50000 ? 0 : 2500;
  const tax = Math.round(subtotal * 0.075); // 7.5% VAT
  const total = subtotal + shipping + tax;

  const itemCount = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart],
  );

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  // Handle remove item
  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  // Handle move to wishlist
  const handleMoveToWishlist = (productId) => {
    addToWishlist(productId);
    removeFromCart(productId);
  };

  // Empty cart state
  if (cartItems.length === 0) {
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
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <h1 className="font-display text-3xl font-bold text-structural mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-structural/60 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any products yet. Start shopping
              to fill your cart!
            </p>
            <Link
              to="/"
              className="btn-primary inline-flex px-8 py-3.5 text-base"
            >
              Continue Shopping
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
                  Shopping Cart
                </h1>
                <p className="text-structural/60 mt-1">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
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
                />
                Clear Cart
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 animate-slide-up">
              <div className="card-premium overflow-hidden">
                {/* Table Header (Desktop) */}
                <div className="hidden lg:flex items-center bg-background-muted px-6 py-4 border-b border-border text-sm font-medium text-structural/60">
                  <div className="w-1/2">Product</div>
                  <div className="w-1/6 text-center">Price</div>
                  <div className="w-1/6 text-center">Quantity</div>
                  <div className="w-1/6 text-right pr-6">Total</div>
                  <div className="w-12"></div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-6 transition-colors hover:bg-background-muted/50"
                    >
                      {/* Product Image & Info */}
                      <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 min-w-0">
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
                              onClick={() =>
                                handleMoveToWishlist(item.product.id)
                              }
                              className="text-structural/60 hover:text-gradient-amber"
                            >
                              <svg
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                              </svg>
                              Save for later
                            </Button>
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
                      <div className="hidden lg:block w-1/6 text-center text-structural font-medium">
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
                        <span className="font-bold text-structural">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-center lg:justify-center w-full lg:w-1/6 gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity - 1,
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 rounded-lg border border-border bg-background-elevated flex items-center justify-center text-structural hover:bg-background-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="w-12 text-center font-semibold text-structural">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity + 1,
                            )
                          }
                          className="w-10 h-10 rounded-lg border border-border bg-background-elevated flex items-center justify-center text-structural hover:bg-background-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="hidden lg:block w-1/6 text-right pr-6 font-bold text-structural text-lg">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>

                      {/* Mobile Quantity & Total */}
                      <div className="lg:hidden w-full flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-structural/60">
                            Qty:
                          </span>
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="w-10 h-10 flex items-center justify-center text-structural hover:bg-background-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M5 12h14" />
                              </svg>
                            </button>
                            <span className="w-10 text-center font-semibold text-structural border-x border-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center text-structural hover:bg-background-muted transition-colors"
                              aria-label="Increase quantity"
                            >
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <span className="font-bold text-structural text-lg">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div
                className="mt-6 card-premium p-6 animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="input-premium flex-1"
                    maxLength={20}
                  />
                  <Button variant="outline">Apply</Button>
                </div>
                <p className="text-sm text-structural/60 mt-3">
                  Have a gift card?{" "}
                  <a href="#" className="text-gradient-amber hover:underline">
                    Apply it here
                  </a>
                </p>
              </div>

              {/* Continue Shopping */}
              <div
                className="mt-6 animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                <Link
                  to="/"
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

            {/* Order Summary */}
            <div
              className="animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="card-premium p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-structural mb-6">
                  Order Summary
                </h2>

                <dl className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">
                      Subtotal ({itemCount} items)
                    </dt>
                    <dd className="font-medium text-structural">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">Shipping</dt>
                    <dd className="font-medium text-structural">
                      {shipping === 0 ? (
                        <span className="text-gradient-amber">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </dd>
                  </div>
                  {subtotal < 50000 && (
                    <p className="text-xs text-gradient-amber text-center">
                      Add {formatPrice(50000 - subtotal)} more for free
                      shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">
                      Estimated Tax (7.5% VAT)
                    </dt>
                    <dd className="font-medium text-structural">
                      {formatPrice(tax)}
                    </dd>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold text-structural">
                      <dt>Total</dt>
                      <dd className="text-gradient-amber">
                        {formatPrice(total)}
                      </dd>
                    </div>
                  </div>
                </dl>

                <ul className="space-y-2 text-sm text-structural/60 mb-6">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Secure checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                      <path d="M10 2v2M14 2v2M7 7h10" />
                    </svg>
                    Free shipping over ₦50,000
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 7V4h16v3" />
                      <path d="M9 20h6" />
                      <path d="M12 4v16" />
                    </svg>
                    30-day returns
                  </li>
                </ul>

                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3.5 text-base"
                  size="lg"
                >
                  Proceed to Checkout
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Button>

                <p className="text-xs text-structural/50 text-center mt-4">
                  By proceeding, you agree to our{" "}
                  <a href="#" className="text-gradient-amber hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-gradient-amber hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>

              {/* Recommended Products */}
              <div
                className="mt-6 card-premium p-6 animate-slide-up"
                style={{ animationDelay: "400ms" }}
              >
                <h3 className="font-semibold text-structural mb-4">
                  You Might Also Like
                </h3>
                <div className="space-y-3">
                  {allProducts
                    .filter(
                      (p) =>
                        !cartItems.some((item) => item.product.id === p.id),
                    )
                    .slice(0, 4)
                    .map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background-elevated border border-border hover:border-border-strong transition-colors group"
                      >
                        <ImageWithFallback
                          product={{
                            keyword: product.keyword,
                            lock: product.lock,
                            cat: product.cat,
                          }}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                          width={64}
                          height={64}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-structural text-sm line-clamp-1 group-hover:text-gradient-amber transition-colors">
                            {product.name}
                          </p>
                          <p className="text-sm text-gradient-amber font-semibold">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                          </svg>
                        </Button>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4"
          onClick={() => setShowClearConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-cart-title"
        >
          <div
            className="card-premium w-full max-w-md animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3
                id="clear-cart-title"
                className="font-display text-xl font-bold text-structural mb-2"
              >
                Clear Cart
              </h3>
              <p className="text-structural/60 mb-6">
                Are you sure you want to remove all items from your cart? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                >
                  Yes, Clear Cart
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

export default Cart;
