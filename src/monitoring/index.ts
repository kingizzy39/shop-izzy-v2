export * from "./sentry";
export * from "./posthog";

import { initSentry, captureException } from "./sentry";
import { initPostHog } from "./posthog";

// Initialize all monitoring systems
export function initMonitoring() {
  // Initialize Sentry first (for error tracking)
  initSentry();

  // Initialize PostHog (for analytics)
  initPostHog();

  // Set up global error handlers
  if (typeof window !== "undefined") {
    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      captureException(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
        type: "unhandled_rejection",
      });
    });

    // Global error handler
    window.addEventListener("error", (event) => {
      captureException(event.error || new Error(event.message), {
        type: "global_error",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });
  }
}