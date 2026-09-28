/**
 * Curated Unsplash photo IDs mapped to products
 * These are specific photo IDs from Unsplash that match each product category/item
 * Using direct images.unsplash.com URLs which are reliable (unlike source.unsplash.com)
 */

// Base Unsplash image URL
const UNSPLASH_BASE = "https://images.unsplash.com";

/**
 * Map of product ID to specific Unsplash photo ID
 * These photos are curated to match the actual products
 */
export const productUnsplashMap: Record<string, string> = {
  // Phones & Tablets
  p01: "photo-1505740420928-5e560c06d30e", // Wireless headphones
  p03: "photo-1594938298603-c8148c4dae35", // Blazer
  p06: "photo-1511707171634-5f897ff02aa9", // Smartphone
  p07: "photo-1544244015-0df4b3ffc6b0", // Tablet
  p08: "photo-1590658268037-6bf12165a8df", // Wireless earbuds
  p09: "photo-1609081218552-33d0c8c8c5d9", // Wireless charger
  p10: "photo-1601593346740-925612772716", // Phone stand wallet
  p11: "photo-1620189695664-448d3e013940", // Screen protector
  p12: "photo-1601784885416-7c8b5b0e8e0e", // Rugged phone case
  p13: "photo-1609091839311-d5365f9ff1c5", // Power bank

  // Electronics
  p14: "photo-1484704849700-f032a568e944", // On-ear headphones
  p15: "photo-1546435770-a3e426bf472b", // Studio headphones
  p16: "photo-1545454675-3531b543be5d", // Soundbar
  p17: "photo-1608043152269-423dbba4e7e1", // Portable speaker
  p18: "photo-1511467687858-23d96c32e49f", // Mechanical keyboard
  p19: "photo-1527814050087-3793815479db", // Vertical mouse
  p20: "photo-1527443224154-c4a3942d3acf", // 4K monitor
  p21: "photo-1527864550417-7fd91fc51a46", // Laptop stand
  p22: "photo-1625842258075-7f9b7b6522a0", // USB-C hub
  p23: "photo-1587829741301-97d2b7e1c5b5", // Webcam

  // Fashion
  p24: "photo-1521572163474-6864f9cf17ab", // Organic cotton tee
  p25: "photo-1576566588028-41d7f47c8e05", // Merino wool sweater
  p26: "photo-1473966968600-fa801b869a1a", // Chino trousers
  p27: "photo-1542272604-787c3835535d", // Selvedge jeans
  p28: "photo-1605497788044-5a3e9b3e1b89", // Chelsea boots
  p29: "photo-1549298916-b41d501d3772", // Leather sneakers
  p30: "photo-1548036328-c9fa89d128fa", // Leather tote bag
  p31: "photo-1601924994987-69e26d50dc26", // Silk scarf

  // Home & Living
  p32: "photo-1630375576000-8f47d9850f8e", // Linen duvet cover
  p33: "photo-1584100936595-c0654b5b0e5d", // Weighted blanket
  p34: "photo-1507473885765-e6ed057f782c", // Ceramic table lamp
  p35: "photo-1583847268964-b28dc8f51f92", // Jute rug
  p36: "photo-1556909114-4c0f9c03c88f", // Acacia cutting board
  p37: "photo-1600585154340-be6161a56a0c", // Stainless cookware (living room)
  p38: "photo-1602143407151-7111542de6e8", // Aroma diffuser
  p39: "photo-1584100936595-c0654b5b0e5d", // Velvet pillow

  // Beauty & Grooming
  p40: "photo-1596462502278-27bfdc403348", // Hyaluronic moisturizer
  p41: "photo-1620916566398-39f1143ab7be", // Retinol serum
  p42: "photo-1556228453-efd6c1ff04f6", // Mineral sunscreen
  p43: "photo-1552332386-f8dd00dc2f85", // Foaming cleanser
  p44: "photo-1586495777744-4413f21062fa", // Liquid lipstick
  p45: "photo-1586495777744-4413f21062fa", // Volumizing mascara
  p46: "photo-1621605815971-18343c30e9f8", // Beard oil
  p47: "photo-1621605815971-18343c30e9f8", // Safety razor

  // Grocery
  p48: "photo-1447933601403-0c6688de566e", // Coffee beans
  p49: "photo-1511381939415-e44015466834", // Dark chocolate
  p50: "photo-1474979266404-7eaacbcd87c5", // Olive oil
  p51: "photo-1586201375194-2b9b2f2e8f5c", // Organic quinoa
  p52: "photo-1587049352851-8d4e89133924", // Raw honey
  p53: "photo-1416879595882-337320d80d6e", // Herb garden kit
  p54: "photo-1556909114-4c0f9c03c88f", // Bamboo cutlery
  p55: "photo-1601050690597-df0568f70950", // Produce bags
};

/**
 * Category fallback Unsplash photo IDs (used when product not in map)
 */
export const categoryUnsplashMap: Record<string, string> = {
  phones: "photo-1511707171634-5f897ff02aa9",
  electronics: "photo-1505740420928-5e560c06d30e",
  fashion: "photo-1473966968600-fa801b869a1a",
  home: "photo-1600585154340-be6161a56a0c",
  beauty: "photo-1596462502278-27bfdc403348",
  grocery: "photo-1447933601403-0c6688de566e",
};

/**
 * Build reliable Unsplash image URL
 */
export const buildUnsplashUrl = (
  photoId: string,
  width: number = 400,
  height: number = 400,
): string => {
  return `${UNSPLASH_BASE}/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
};

/**
 * Get product image URL with fallback chain:
 * 1. Product-specific Unsplash photo
 * 2. Category fallback Unsplash photo
 * 3. Local SVG placeholder
 */
export const getProductImageUrl = (
  product: { id: string; keyword: string; lock: number; cat: string },
  width: number = 400,
  height: number = 400,
): string => {
  // 1. Try product-specific photo
  if (productUnsplashMap[product.id]) {
    return buildUnsplashUrl(productUnsplashMap[product.id], width, height);
  }

  // 2. Try category fallback
  if (categoryUnsplashMap[product.cat]) {
    return buildUnsplashUrl(categoryUnsplashMap[product.cat], width, height);
  }

  // 3. Fallback to placeholder (handled by ImageWithFallback component)
  return "";
};

/**
 * Create image props with Unsplash primary + SVG fallback
 */
export const createUnsplashImageWithFallback = (
  product: { id: string; keyword: string; lock: number; cat: string },
  width: number = 400,
  height: number = 400,
) => {
  const unsplashUrl = getProductImageUrl(product, width, height);
  const fallbackUrl = `/images/placeholders/${product.cat}.svg`;

  return {
    src: unsplashUrl || fallbackUrl,
    fallbackSrc: fallbackUrl,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;
      if (img.src !== fallbackUrl) {
        img.src = fallbackUrl;
      }
    },
  };
};

export default productUnsplashMap;
