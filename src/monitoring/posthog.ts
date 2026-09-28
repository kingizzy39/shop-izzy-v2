import posthog from "posthog-js";

export function initPostHog() {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";

  if (apiKey && (import.meta.env.PROD || import.meta.env.DEV)) {
    posthog.init(apiKey, {
      api_host: host,
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          posthog.debug();
        }
      },
      // Capture page views and page leaves automatically
      capture_pageview: true,
      capture_pageleave: true,
      // Don't capture clicks automatically - we'll do it manually for key events
      autocapture: false,
      // Session recording (requires PostHog Cloud or self-hosted with plugin)
      // session_recording: {
      //   maskAllText: true,
      //   blockAllMedia: true,
      // },
      // Persist user across sessions
      persistence: "localStorage",
      // Respect Do Not Track
      respect_dnt: true,
      // Disable in development if no key
      disable_session_recording: import.meta.env.DEV,
    });
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  posthog.identify(userId, traits);
}

export function resetUser() {
  posthog.reset();
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  posthog.capture(eventName, properties);
}

// E-commerce specific tracking functions
export function trackProductView(productId: string, productName: string, category: string, price: number) {
  trackEvent("product_viewed", {
    product_id: productId,
    product_name: productName,
    category,
    price,
  });
}

export function trackAddToCart(productId: string, productName: string, quantity: number, price: number) {
  trackEvent("added_to_cart", {
    product_id: productId,
    product_name: productName,
    quantity,
    price,
    total: price * quantity,
  });
}

export function trackRemoveFromCart(productId: string, productName: string, quantity: number) {
  trackEvent("removed_from_cart", {
    product_id: productId,
    product_name: productName,
    quantity,
  });
}

export function trackCartView(cartItems: Array<{ productId: string; name: string; quantity: number; price: number }>) {
  trackEvent("cart_viewed", {
    items_count: cartItems.length,
    total_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    total_value: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    items: cartItems.map((item) => ({
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  });
}

export function trackCheckoutStarted(cartValue: number, itemCount: number) {
  trackEvent("checkout_started", {
    cart_value: cartValue,
    item_count: itemCount,
  });
}

export function trackCheckoutStep(step: number, stepName: string, properties?: Record<string, unknown>) {
  trackEvent("checkout_step", {
    step,
    step_name: stepName,
    ...properties,
  });
}

export function trackPurchase(orderId: string, total: number, items: Array<{ productId: string; name: string; quantity: number; price: number }>) {
  trackEvent("purchase_completed", {
    order_id: orderId,
    total,
    item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    items: items.map((item) => ({
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  });
}

export function trackSearch(query: string, resultsCount: number, filters?: Record<string, unknown>) {
  trackEvent("search_performed", {
    query,
    results_count: resultsCount,
    filters,
  });
}

export function trackCategoryView(category: string, productCount: number) {
  trackEvent("category_viewed", {
    category,
    product_count: productCount,
  });
}

export function trackSellerAction(action: string, properties?: Record<string, unknown>) {
  trackEvent(`seller_${action}`, properties);
}

export const posthogClient = posthog;