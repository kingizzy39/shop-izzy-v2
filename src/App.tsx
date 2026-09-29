import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import * as Sentry from "@sentry/react";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRouteShopper from "./components/ProtectedRouteShopper";
import ProtectedRouteSeller from "./components/ProtectedRouteSeller";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded route components
const LandingPage = lazy(() => import("./routes/LandingPage"));
const Home = lazy(() => import("./routes/Home"));
const CategoryListing = lazy(() => import("./routes/CategoryListing"));
const ProductDetail = lazy(() => import("./routes/ProductDetail"));
const Cart = lazy(() => import("./routes/Cart"));
const Checkout = lazy(() => import("./routes/Checkout"));
const OrderSuccess = lazy(() => import("./routes/OrderSuccess"));
const AuthPage = lazy(() => import("./routes/AuthPage"));
const SellerJoinPage = lazy(() => import("./routes/SellerJoinPage"));
const SellerLogin = lazy(() => import("./routes/SellerLogin"));
const SellerDashboard = lazy(() => import("./routes/SellerDashboardPage"));
const SearchResults = lazy(() => import("./routes/SearchResults"));
const Wishlist = lazy(() => import("./routes/Wishlist"));
const InfoPage = lazy(() => import("./routes/InfoPage"));

// Loading fallback component
function RouteLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-gradient-amber border-t-transparent" />
        <p className="text-structural/60">Loading...</p>
      </div>
    </div>
  );
}

// Navigation tracking component for PostHog page views
function NavigationTracker() {
  const location = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    // Track page view on navigation
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("$pageview", {
        $current_url: window.location.href,
        $pathname: location.pathname,
        $search: location.search,
      });
    }
  }, [location, navigationType]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Sentry.ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but an unexpected error occurred. Our team has been
                notified.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        }
        onError={(error, errorInfo) => {
          console.error("Sentry ErrorBoundary caught:", error, errorInfo);
        }}
      >
        <NavigationTracker />
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            {/* Public pages with full site layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<Home />} />
              <Route path="/category" element={<CategoryListing />} />
              <Route path="/category/:cat" element={<CategoryListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/about" element={<InfoPage />} />
              <Route path="/careers" element={<InfoPage />} />
              <Route path="/press" element={<InfoPage />} />
              <Route path="/sustainability" element={<InfoPage />} />
              <Route path="/help" element={<InfoPage />} />
              <Route path="/returns" element={<InfoPage />} />
              <Route path="/contact" element={<InfoPage />} />
              <Route path="/faqs" element={<InfoPage />} />
              <Route path="/privacy" element={<InfoPage />} />
              <Route path="/terms" element={<InfoPage />} />
              <Route path="/cookies" element={<InfoPage />} />
              <Route path="/accessibility" element={<InfoPage />} />
            </Route>

            {/* Shopper-protected routes (cart, checkout, wishlist, orders) */}
            <Route element={<ProtectedRouteShopper />}>
              <Route element={<Layout />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/order-success/:orderId"
                  element={<OrderSuccess />}
                />
              </Route>
            </Route>

            {/* Seller-protected routes */}
            <Route element={<ProtectedRouteSeller />}>
              <Route element={<Layout />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
              </Route>
            </Route>

            {/* Auth pages with clean layout (no header/footer/utility bar) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/seller/join" element={<SellerJoinPage />} />
              <Route path="/seller/login" element={<SellerLogin />} />
            </Route>
          </Routes>
        </Suspense>
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
