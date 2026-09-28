import { useCallback } from "react";
import {
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackCartView,
  trackCheckoutStarted,
  trackCheckoutStep,
  trackPurchase,
  trackSearch,
  trackCategoryView,
  trackSellerAction,
  identifyUser,
  resetUser,
} from "../monitoring/posthog";
import { captureException, addSentryBreadcrumb, setSentryUser } from "../monitoring/sentry";

interface AnalyticsUser {
  id: string;
  email?: string;
  name?: string;
  role?: "customer" | "seller";
}

/**
 * Hook for tracking analytics events throughout the application
 */
export function useAnalytics() {
  // User identification
  const identify = useCallback((user: AnalyticsUser) => {
    identifyUser(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
    setSentryUser({ id: user.id, email: user.email, username: user.name });
  }, []);

  const logout = useCallback(() => {
    resetUser();
    setSentryUser(null);
  }, []);

  // E-commerce events
  const trackProductViewed = useCallback(
    (productId: string, productName: string, category: string, price: number) => {
      trackProductView(productId, productName, category, price);
      addSentryBreadcrumb({
        category: "ecommerce",
        message: `Viewed product: ${productName}`,
        level: "info",
        data: { productId, category, price },
      });
    },
    []
  );

  const trackAddedToCart = useCallback(
    (productId: string, productName: string, quantity: number, price: number) => {
      trackAddToCart(productId, productName, quantity, price);
      addSentryBreadcrumb({
        category: "ecommerce",
        message: `Added to cart: ${productName} x${quantity}`,
        level: "info",
        data: { productId, quantity, price },
      });
    },
    []
  );

  const trackRemovedFromCart = useCallback(
    (productId: string, productName: string, quantity: number) => {
      trackRemoveFromCart(productId, productName, quantity);
      addSentryBreadcrumb({
        category: "ecommerce",
        message: `Removed from cart: ${productName} x${quantity}`,
        level: "info",
        data: { productId, quantity },
      });
    },
    []
  );

  const trackCartViewed = useCallback(
    (cartItems: Array<{ productId: string; name: string; quantity: number; price: number }>) => {
      trackCartView(cartItems);
    },
    []
  );

  const trackCheckoutStartedEvent = useCallback(
    (cartValue: number, itemCount: number) => {
      trackCheckoutStarted(cartValue, itemCount);
      addSentryBreadcrumb({
        category: "ecommerce",
        message: `Checkout started: $${cartValue} (${itemCount} items)`,
        level: "info",
        data: { cartValue, itemCount },
      });
    },
    []
  );

  const trackCheckoutStepEvent = useCallback(
    (step: number, stepName: string, properties?: Record<string, unknown>) => {
      trackCheckoutStep(step, stepName, properties);
    },
    []
  );

  const trackPurchaseCompleted = useCallback(
    (
      orderId: string,
      total: number,
      items: Array<{ productId: string; name: string; quantity: number; price: number }>
    ) => {
      trackPurchase(orderId, total, items);
      addSentryBreadcrumb({
        category: "ecommerce",
        message: `Purchase completed: ${orderId} - $${total}`,
        level: "info",
        data: { orderId, total, itemCount: items.length },
      });
    },
    []
  );

  // Search & Discovery
  const trackSearchEvent = useCallback(
    (query: string, resultsCount: number, filters?: Record<string, unknown>) => {
      trackSearch(query, resultsCount, filters);
    },
    []
  );

  const trackCategoryViewed = useCallback(
    (category: string, productCount: number) => {
      trackCategoryView(category, productCount);
    },
    []
  );

  // Seller actions
  const trackSellerActionEvent = useCallback(
    (action: string, properties?: Record<string, unknown>) => {
      trackSellerAction(action, properties);
    },
    []
  );

  // Generic event tracking
  const track = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      trackEvent(eventName, properties);
      addSentryBreadcrumb({
        category: "custom",
        message: eventName,
        level: "info",
        data: properties,
      });
    },
    []
  );

  // Error tracking
  const trackError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      captureException(error, context);
    },
    []
  );

  return {
    // User
    identify,
    logout,
    // E-commerce
    trackProductViewed,
    trackAddedToCart,
    trackRemovedFromCart,
    trackCartViewed,
    trackCheckoutStarted: trackCheckoutStartedEvent,
    trackCheckoutStep: trackCheckoutStepEvent,
    trackPurchaseCompleted,
    // Search & Discovery
    trackSearch: trackSearchEvent,
    trackCategoryViewed,
    // Seller
    trackSellerAction: trackSellerActionEvent,
    // Generic
    track,
    trackError,
  };
}

// Type augmentation for window.posthog
declare global {
  interface Window {
    posthog: typeof import("posthog-js").default;
  }
}