import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../store/index";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import ImageWithFallback from "../components/ImageWithFallback";
import { formatPrice, generateId } from "../utils/format";

const ProductDetail = () => {
  const { id } = useParams();
  const {
    products,
    categories,
    sellerProducts,
    cart,
    wishlist,
    reviews,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    addReview,
  } = useStore();

  // Combine regular products with seller products to find the product
  const allProducts = [...products, ...sellerProducts];
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card-premium p-12 text-center max-w-md">
          <svg
            className="h-16 w-16 mx-auto text-border mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <h1 className="font-display text-2xl font-bold text-structural mb-3">
            Product Not Found
          </h1>
          <p className="text-structural/60 mb-6">
            We couldn&apos;t find the product you&apos;re looking for.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get category name
  const category = categories.find((c) => c.id === product.cat);
  const categoryName = category ? category.name : "";

  // Get related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter((p) => p.cat === product.cat && p.id !== product.id)
    .slice(0, 4);

  // Get reviews for this product
  const productReviews = reviews[product.id] || [];

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // State for active tab
  const [activeTab, setActiveTab] = useState("description");

  // State for review modal/form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // State for active thumbnail
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  // Check if product is in cart/wishlist
  const isInCart = !!cart[product.id];
  const isInWishlist = !!wishlist[product.id];

  // Handle adding to cart
  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  // Handle adding to wishlist
  const handleAddToWishlist = () => {
    addToWishlist(product.id);
  };

  // Handle removing from wishlist
  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
  };

  // Handle adding a review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating > 0 && reviewComment.trim() !== "") {
      const newReview = {
        id: generateId(),
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString(),
      };
      addReview(newReview);
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
    }
  };

  // Calculate average rating from reviews
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
        productReviews.length
      : product.rating; // Fallback to product's base rating

  // Generate dynamic thumbnail images using product keyword with different locks
  // Include product's own img as first thumbnail if available
  const thumbnailImages = useMemo(() => {
    const images: string[] = [];
    if (product.img) {
      images.push(product.img);
    }
    if (product.keyword) {
      const locks = [
        product.lock,
        product.lock + 10,
        product.lock + 20,
        product.lock + 30,
      ];
      locks.forEach((lock) => {
        images.push(
          `https://picsum.photos/seed/${product.keyword}-${lock}/200/200`,
        );
      });
    }
    return images.length > 0 ? images : [product.img || ""];
  }, [product]);

  // Generate dynamic color swatches based on product category
  const colorSwatches = useMemo(() => {
    if (product.cat !== "fashion") return [];
    // Fashion products get color options
    return [
      { name: "Black", color: "bg-black" },
      { name: "Navy", color: "bg-blue-900" },
      { name: "Olive", color: "bg-green-700" },
      { name: "Sand", color: "bg-yellow-300" },
    ];
  }, [product.cat]);

  // Generate connectivity options for electronics
  const connectivityOptions = useMemo(() => {
    if (product.cat !== "electronics") return [];
    return [
      {
        id: "wireless",
        label: "Wireless",
        icon: (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 18a6 6 0 0 0 0-12v12z" />
            <path d="M9.09 15.09a3 3 0 0 0 4.24 0" />
            <path d="M6.16 12.16a1 1 0 0 0 1.41 0" />
          </svg>
        ),
      },
      {
        id: "wired",
        label: "Wired",
        icon: (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 7V4h16v3" />
            <path d="M9 20h6" />
            <path d="M12 4v16" />
          </svg>
        ),
      },
      {
        id: "both",
        label: "Both",
        icon: (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 18a6 6 0 0 0 0-12v12z" />
            <path d="M9.09 15.09a3 3 0 0 0 4.24 0" />
            <path d="M4 7V4h16v3" />
            <path d="M9 20h6" />
            <path d="M12 4v16" />
          </svg>
        ),
      },
    ];
  }, [product.cat]);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <nav
        className="bg-background-elevated border-b border-border px-4 sm:px-6 lg:px-8 py-4"
        aria-label="Breadcrumb"
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/"
            className="text-structural/60 hover:text-gradient-amber transition-colors"
          >
            Home
          </Link>
          <span className="text-border">/</span>
          {categoryName && (
            <>
              <Link
                to={`/category/${product.cat}`}
                className="text-structural/60 hover:text-gradient-amber transition-colors"
              >
                {categoryName}
              </Link>
              <span className="text-border">/</span>
            </>
          )}
          <span className="text-structural truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </nav>

      {/* Product Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-background-elevated">
              <ImageWithFallback
                product={{
                  id: product.id,
                  keyword: product.keyword,
                  lock: product.lock + activeThumbnail * 10,
                  cat: product.cat,
                  img: product.img,
                }}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                priority
              />
              {/* Discount Badge */}
              {product.was !== null &&
                product.was &&
                product.was > product.price && (
                  <span className="absolute top-4 left-4 btn-secondary text-sm px-3 py-1.5">
                    -
                    {Math.round(
                      ((product.was - product.price) / product.was) * 100,
                    )}
                    %
                  </span>
                )}
              {/* Wishlist Button on Image */}
              <button
                onClick={
                  isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist
                }
                className="absolute top-4 right-4 btn-ghost p-2 rounded-full bg-background/80 backdrop-blur-sm"
                aria-label={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isInWishlist ? (
                  <svg
                    className="h-5 w-5 text-gradient-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-structural"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21l-7.8-7.6 1-1a5.5 5.5 0 1 0 7.8-7.8l1 1L12 5.6l1 1a5.5 5.5 0 0 0 7.8 7.8l1 1L12 21z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {thumbnailImages.map((thumb, index) => {
                // For thumbnails, create different lock values for variation
                const thumbLock = product.lock + index * 10;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveThumbnail(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === activeThumbnail
                        ? "border-gradient-amber shadow-md"
                        : "border-transparent hover:border-border"
                    }`}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === activeThumbnail ? "true" : "false"}
                  >
                    <ImageWithFallback
                      product={{
                        id: product.id,
                        keyword: product.keyword,
                        lock: thumbLock,
                        cat: product.cat,
                      }}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Header */}
            <div className="space-y-4">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-structural leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= Math.round(averageRating)
                          ? "text-amber-500"
                          : "text-border"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-structural/60">
                  ({productReviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-3xl font-bold text-gradient-amber">
                  {formatPrice(product.price)}
                </span>
                {product.was !== null && product.was > product.price && (
                  <span className="text-structural/50 line-through text-xl">
                    {formatPrice(product.was)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t border-border pt-6 space-y-4">
              <h2 className="font-semibold text-structural">Product Details</h2>
              <p className="text-structural/60 leading-relaxed">
                {product.desc}
              </p>

              {/* Color Swatches for Fashion */}
              {product.cat === "fashion" && colorSwatches.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <h3 className="font-semibold text-structural">
                    Available Colors
                  </h3>
                  <div className="flex gap-3">
                    {colorSwatches.map((swatch, index) => (
                      <button
                        key={index}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                          index === 0
                            ? "border-gradient-amber"
                            : "border-border"
                        } ${swatch.color}`}
                        title={swatch.name}
                        aria-label={swatch.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Connectivity Options for Electronics */}
              {product.cat === "electronics" &&
                connectivityOptions.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <h3 className="font-semibold text-structural">
                      Connectivity Options
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {connectivityOptions.map((option) => (
                        <button
                          key={option.id}
                          className="btn-outline text-sm gap-2 px-3 py-2"
                        >
                          {option.icon}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Quantity Selector and Actions */}
            <div className="border-t border-border pt-6 space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-structural">Qty:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center text-structural hover:bg-background-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span className="w-12 text-center font-semibold text-structural border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-structural hover:bg-background-muted transition-colors"
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
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant={isInCart ? "secondary" : "primary"}
                  className="flex-1"
                  size="lg"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                  </svg>
                  {isInCart ? "In Cart" : "Add to Cart"}
                </Button>

                <Button
                  onClick={() => {
                    handleAddToCart();
                  }}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-structural/60">
                <svg
                  className="h-5 w-5 text-gradient-amber flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-structural/60">
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
                <span>Free shipping over &#x20A6;50,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-structural/60">
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
                <span>30-day returns</span>
              </div>
            </div>

            {/* Seller Info (if applicable) */}
            {product.sellerId && (
              <div className="border-t border-border pt-6 card-premium p-6">
                <h3 className="font-semibold text-structural mb-4">
                  About the Seller
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-amber/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-7 w-7 text-gradient-amber"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2a2 2 0 0 0-2 2v1a4 4 0 0 0 .592 3.624l1 2a2 2 0 0 0 2.156 0l1-2a4 4 0 0 0 .592-3.624V4a2 2 0 0 0-2-2z" />
                      <path d="M12 14a2 2 0 0 1-2-2v1.5a6 6 0 0 0 3.898 5.476l-1.067.31a2 2 0 0 1-1.771 0l-1.067-.31A6 6 0 0 0 14 15.5V14a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-structural">
                      {product.bio?.split(" ")[0] || "Seller"}
                    </h4>
                    <p className="text-structural/60 text-sm">
                      {product.bio || "Independent seller on Shop Izzy"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="border-b border-border mb-8">
            <nav className="flex gap-8" aria-label="Product tabs">
              {[
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "reviews", label: `Reviews (${productReviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-1 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-gradient-amber"
                      : "text-structural/60 hover:text-structural"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-amber rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="prose prose-structural max-w-none">
                <h2 className="font-display text-2xl font-bold text-structural mb-4">
                  Product Description
                </h2>
                <p className="text-structural/60 leading-relaxed mb-8">
                  {product.desc}
                </p>

                {/* Key Features */}
                <div>
                  <h3 className="font-semibold text-structural mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-structural/60">
                      <svg
                        className="h-5 w-5 text-gradient-amber flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Premium quality materials</span>
                    </li>
                    <li className="flex items-start gap-3 text-structural/60">
                      <svg
                        className="h-5 w-5 text-gradient-amber flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Expert craftsmanship</span>
                    </li>
                    <li className="flex items-start gap-3 text-structural/60">
                      <svg
                        className="h-5 w-5 text-gradient-amber flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Durable and long-lasting</span>
                    </li>
                    <li className="flex items-start gap-3 text-structural/60">
                      <svg
                        className="h-5 w-5 text-gradient-amber flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Stylish and functional design</span>
                    </li>
                    {product.was !== null && (
                      <li className="flex items-start gap-3 text-gradient-amber font-medium">
                        <svg
                          className="h-5 w-5 flex-shrink-0 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2a10 10 0 1 0 10 10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                        <span>
                          Save {formatPrice(product.was - product.price)}{" "}
                          compared to original price
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Specs Tab */}
            {activeTab === "specs" && (
              <div className="card-premium p-6">
                <h2 className="font-display text-2xl font-bold text-structural mb-6">
                  Specifications
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-b border-border pb-4">
                    <dt className="text-sm text-structural/60 mb-1">
                      Category
                    </dt>
                    <dd className="font-medium text-structural">
                      {categoryName}
                    </dd>
                  </div>
                  <div className="border-b border-border pb-4">
                    <dt className="text-sm text-structural/60 mb-1">
                      Product ID
                    </dt>
                    <dd className="font-medium text-structural font-mono text-sm">
                      {product.id}
                    </dd>
                  </div>
                  <div className="border-b border-border pb-4">
                    <dt className="text-sm text-structural/60 mb-1">
                      Availability
                    </dt>
                    <dd className="font-medium text-gradient-amber">
                      In Stock
                    </dd>
                  </div>
                  <div className="border-b border-border pb-4">
                    <dt className="text-sm text-structural/60 mb-1">Brand</dt>
                    <dd className="font-medium text-structural">
                      Shop Izzy Collection
                    </dd>
                  </div>
                  <div className="border-b border-border pb-4">
                    <dt className="text-sm text-structural/60 mb-1">
                      Condition
                    </dt>
                    <dd className="font-medium text-structural">New</dd>
                  </div>
                  <div className="border-b border-border pb-4">
                    <dt className="text-sm text-structural/60 mb-1">
                      Warranty
                    </dt>
                    <dd className="font-medium text-structural">
                      1 Year Manufacturer Warranty
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold text-structural">
                    Customer Reviews
                  </h2>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    variant="outline"
                    size="sm"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Write a Review
                  </Button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="card-premium p-6 animate-slide-up">
                    <h3 className="font-semibold text-structural mb-6">
                      Write a Review
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-structural">
                          Your Rating
                        </label>
                        <div
                          className="flex gap-2"
                          role="radiogroup"
                          aria-label="Select rating"
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <label key={star} className="cursor-pointer">
                              <input
                                type="radio"
                                name="rating"
                                value={star}
                                checked={reviewRating === star}
                                onChange={(e) =>
                                  setReviewRating(parseInt(e.target.value))
                                }
                                className="sr-only"
                              />
                              <span
                                className={`h-8 w-8 text-2xl flex items-center justify-center rounded-lg transition-all ${
                                  reviewRating >= star
                                    ? "text-amber-500 bg-amber-50"
                                    : "text-border hover:text-amber-300 hover:bg-background-muted"
                                }`}
                              >
                                ★
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label
                          htmlFor="review-comment"
                          className="block text-sm font-medium text-structural"
                        >
                          Your Comment
                        </label>
                        <textarea
                          id="review-comment"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          className="input-premium min-h-[100px] resize-y"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button
                          onClick={() => setShowReviewForm(false)}
                          variant="ghost"
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={
                            reviewRating === 0 || reviewComment.trim() === ""
                          }
                        >
                          Submit Review
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-5">
                  {productReviews.length > 0 ? (
                    productReviews.map((review) => (
                      <article key={review.id} className="card-premium p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-amber text-background rounded-full flex items-center justify-center text-sm font-bold">
                                  {review.rating}
                                </div>
                                <div>
                                  <h4 className="font-medium text-structural">
                                    Verified Buyer
                                  </h4>
                                  <span className="text-sm text-structural/60">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={
                                      star <= review.rating
                                        ? "text-amber-500"
                                        : "text-border"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-structural/60 leading-relaxed">
                          {review.comment}
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="card-premium p-12 text-center">
                      <svg
                        className="h-16 w-16 mx-auto text-border mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-structural mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-structural/60 mb-6">
                        Be the first to share your experience with this product!
                      </p>
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        variant="primary"
                      >
                        Write the First Review
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-structural">
                You May Also Like
              </h2>
              <Link
                to={`/category/${product.cat}`}
                className="btn-ghost text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} showRating />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
