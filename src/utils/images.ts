/**
 * Image service configuration and utilities
 * Supports multiple image sources with fallback chain:
 * 1. Local cached images (downloaded via npm run download-images)
 * 2. External loremflickr (free, no API key needed)
 * 3. Local SVG placeholders (always available)
 */

// Image source configuration
export interface ImageConfig {
  // Local cached images (from download-images script)
  local: {
    baseUrl: string; // e.g., "/images/products/"
    enabled: boolean;
  };
  // External loremflickr service
  loremFlickr: {
    baseUrl: string;
    enabled: boolean;
  };
  // Local SVG placeholders
  placeholders: {
    baseUrl: string;
    enabled: boolean;
  };
  // Unsplash (requires API key)
  unsplash: {
    baseUrl: string;
    accessKey?: string;
    enabled: boolean;
  };
}

// Default configuration
export const defaultImageConfig: ImageConfig = {
  local: {
    baseUrl: "/images/products/",
    enabled: true,
  },
  loremFlickr: {
    baseUrl: "https://loremflickr.com",
    enabled: false, // Disabled: loremflickr now requires authentication
  },
  placeholders: {
    baseUrl: "/images/placeholders/",
    enabled: true,
  },
  unsplash: {
    baseUrl: "https://api.unsplash.com",
    accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
    enabled: !!import.meta.env.VITE_UNSPLASH_ACCESS_KEY, // Auto-enable when key is present
  },
};

/**
 * Get available image sizes for responsive images
 */
export const imageSizes = {
  thumbnail: 200,
  small: 400,
  medium: 800,
  large: 1200,
};

/**
 * Build local cached image URL
 */
export const getLocalImageUrl = (
  productId: string,
  size: number = 200,
  variant: string = "main",
): string => {
  const base = defaultImageConfig.local.baseUrl;
  if (variant === "main") {
    return `${base}${productId}/${productId}-${size}w.jpg`;
  }
  return `${base}${productId}/${productId}-${variant}-${size}w.jpg`;
};

/**
 * Build loremflickr image URL
 */
export const getLoremFlickrUrl = (
  keyword: string,
  lock: number,
  size: number = 200,
): string => {
  return `${defaultImageConfig.loremFlickr.baseUrl}/${size}/${size}/${keyword}/all?lock=${lock}`;
};

/**
 * Build placeholder image URL
 */
export const getPlaceholderUrl = (category: string): string => {
  const placeholders: Record<string, string> = {
    phones: "phones.svg",
    electronics: "electronics.svg",
    fashion: "fashion.svg",
    home: "home.svg",
    beauty: "beauty.svg",
    grocery: "grocery.svg",
  };
  return `${defaultImageConfig.placeholders.baseUrl}${placeholders[category] || placeholders.electronics}`;
};

/**
 * Build Unsplash image URL (requires API key)
 */
export const getUnsplashUrl = (query: string, size: number = 200): string => {
  if (
    !defaultImageConfig.unsplash.enabled ||
    !defaultImageConfig.unsplash.accessKey
  ) {
    return "";
  }
  return `${defaultImageConfig.unsplash.baseUrl}/photos/random?query=${encodeURIComponent(query)}&w=${size}&h=${size}&client_id=${defaultImageConfig.unsplash.accessKey}`;
};

/**
 * Get image source set for responsive images
 */
export const getImageSrcSet = (
  product: { id: string; keyword: string; lock: number; cat: string },
  sizes: number[] = [200, 400, 800],
): string => {
  return sizes
    .map(
      (size) =>
        `${getLoremFlickrUrl(product.keyword, product.lock, size)} ${size}w`,
    )
    .join(", ");
};

/**
 * Image source with fallback chain
 */
export interface ImageSource {
  src: string;
  srcSet?: string;
  fallback: string;
  type: "local" | "loremflickr" | "placeholder" | "unsplash";
}

/**
 * Get best available image source for a product
 */
export const getProductImageSources = (product: {
  id: string;
  keyword: string;
  lock: number;
  cat: string;
}): ImageSource[] => {
  const sources: ImageSource[] = [];

  // 1. Local cached images (highest priority if available)
  if (defaultImageConfig.local.enabled) {
    sources.push({
      src: getLocalImageUrl(product.id, imageSizes.medium),
      srcSet: getImageSrcSet(product, [
        imageSizes.thumbnail,
        imageSizes.small,
        imageSizes.medium,
      ]),
      fallback: getLocalImageUrl(product.id, imageSizes.thumbnail),
      type: "local",
    });
  }

  // 2. Loremflickr (free external service)
  if (defaultImageConfig.loremFlickr.enabled) {
    sources.push({
      src: getLoremFlickrUrl(product.keyword, product.lock, imageSizes.medium),
      srcSet: getImageSrcSet(product, [
        imageSizes.thumbnail,
        imageSizes.small,
        imageSizes.medium,
      ]),
      fallback: getLoremFlickrUrl(
        product.keyword,
        product.lock,
        imageSizes.thumbnail,
      ),
      type: "loremflickr",
    });
  }

  // 3. Unsplash (if configured)
  if (defaultImageConfig.unsplash.enabled) {
    sources.push({
      src: getUnsplashUrl(product.keyword, imageSizes.medium),
      fallback: getUnsplashUrl(product.keyword, imageSizes.thumbnail),
      type: "unsplash",
    });
  }

  // 4. Local SVG placeholder (always available as last resort)
  if (defaultImageConfig.placeholders.enabled) {
    sources.push({
      src: getPlaceholderUrl(product.cat),
      fallback: getPlaceholderUrl(product.cat),
      type: "placeholder",
    });
  }

  return sources;
};

/**
 * Create picture element sources for responsive images with fallback
 */
export const createPictureSources = (product: {
  id: string;
  keyword: string;
  lock: number;
  cat: string;
}) => {
  const sources = getProductImageSources(product);

  return sources.map((source, index) => ({
    srcSet: source.srcSet,
    media:
      index === 0
        ? "(min-width: 1024px)"
        : index === 1
          ? "(min-width: 640px)"
          : undefined,
    type: source.type,
    fallback: source.fallback,
  }));
};

export default defaultImageConfig;
