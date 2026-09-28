import * as Sentry from "@sentry/react";
import { browserTracingIntegration, replayIntegration } from "@sentry/react";

export function initSentry() {
  if (import.meta.env.PROD || import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || "1.0.0",

      // Performance monitoring
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      profileSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

      // Session replay for debugging
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

      // Integrations
      integrations: [
        browserTracingIntegration({
          // Enable automatic route change transactions
        }),
        replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Error filtering
      beforeSend(event, hint) {
        // Filter out known non-actionable errors
        const error = hint.originalException;
        if (error instanceof Error) {
          // Ignore network errors that are likely user connectivity issues
          if (error.message.includes("Network Error") || error.message.includes("Failed to fetch")) {
            return null;
          }
          // Ignore React hydration mismatches in development
          if (import.meta.env.DEV && error.message.includes("hydration")) {
            return null;
          }
        }
        return event;
      },

      // Attach user context
      initialScope: {
        tags: {
          app: "shop-izzy-v2",
        },
      },
    });
  }
}

export function setSentryUser(user: { id: string; email?: string; username?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    Sentry.setUser(null);
  }
}

export function addSentryBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  Sentry.captureMessage(message, level);
}

export function startTransaction(name: string, op: string) {
  // Use startSpan for custom transactions in newer Sentry SDK
  return Sentry.startSpan({ name, op }, () => {});
}

// React Error Boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;
export const withSentryErrorBoundary = Sentry.withErrorBoundary;