/**
 * Format price as Nigerian Naira
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Re-export image utilities from unsplash-images
export {
  getProductImageUrl,
  createUnsplashImageWithFallback,
  buildUnsplashUrl,
  productUnsplashMap,
  categoryUnsplashMap,
} from "./unsplash-images";

import {
  createUnsplashImageWithFallback,
  getProductImageUrl,
} from "./unsplash-images";

/**
 * Create image src with onError fallback handler using curated Unsplash photos
 * Returns props for img element: { src, fallbackSrc, onError }
 */
export const createImageWithFallback = (
  product: { id: string; keyword: string; lock: number; cat: string },
  width: number = 400,
  height: number = 400,
) => {
  const { src, fallbackSrc, onError } = createUnsplashImageWithFallback(
    product,
    width,
    height,
  );
  return { src, fallbackSrc, onError };
};

/**
 * Get product image URL (primary: curated Unsplash, fallback: placeholder)
 */
export const getProductImage = (
  product: { id: string; keyword: string; lock: number; cat: string },
  width: number = 400,
  height: number = 400,
): string => {
  return getProductImageUrl(product, width, height);
};
