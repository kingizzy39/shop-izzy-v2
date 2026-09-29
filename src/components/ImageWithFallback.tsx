import React, { memo, useState, useCallback } from "react";
import { getProductImageUrl } from "../utils/unsplash-images";

interface ProductImageData {
  id: string;
  keyword: string;
  lock: number;
  cat: string;
  img?: string;
}

interface ImageWithFallbackProps {
  product: ProductImageData;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

/**
 * Build image URL chain with multiple fallbacks (ordered by reliability):
 * 1. Curated Unsplash photo (product-specific or category fallback) - most reliable
 * 2. Product's own img property (from data.ts - LoremFlickr) - less reliable
 * 3. Local SVG placeholder (always available) - guaranteed fallback
 */
const getImageSrcChain = (
  product: ProductImageData,
  width: number,
  height: number,
): string[] => {
  const chain: string[] = [];

  // 1. Curated Unsplash photo (product-specific or category fallback) - PRIMARY
  // Unsplash provides reliable CDN-hosted images with consistent quality
  const unsplashUrl = getProductImageUrl(product, width, height);
  if (unsplashUrl) {
    chain.push(unsplashUrl);
  }

  // 2. Product's own img property (LoremFlickr from data.ts) - SECONDARY
  // LoremFlickr can be unreliable, rate-limited, or return mismatched images
  if (product.img) {
    chain.push(product.img);
  }

  // 3. Local SVG placeholder (always available) - GUARANTEED FALLBACK
  // Local SVGs are bundled with the app and never fail to load
  chain.push(`/images/placeholders/${product.cat}.svg`);

  return chain;
};

const ImageWithFallback = memo(
  ({
    product,
    alt,
    className = "",
    width = 400,
    height = 400,
    loading = "lazy",
    priority = false,
  }: ImageWithFallbackProps) => {
    const srcChain = getImageSrcChain(product, width, height);
    const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
    const [hasErrored, setHasErrored] = useState(false);

    const currentSrc = srcChain[currentSrcIndex];

    const handleError = useCallback(() => {
      if (currentSrcIndex < srcChain.length - 1) {
        // Try next image in chain
        setCurrentSrcIndex((prev) => prev + 1);
      } else if (!hasErrored) {
        // All fallbacks exhausted
        setHasErrored(true);
      }
    }, [currentSrcIndex, srcChain.length, hasErrored]);

    // Reset error state when src changes (e.g., product prop changes)
    React.useEffect(() => {
      setCurrentSrcIndex(0);
      setHasErrored(false);
    }, [product.id, width, height]);

    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        {...(priority && { fetchPriority: "high" })}
      />
    );
  },
);

export default ImageWithFallback;
