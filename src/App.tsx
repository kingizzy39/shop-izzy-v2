import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRouteShopper from "./components/ProtectedRouteShopper";
import ProtectedRouteSeller from "./components/ProtectedRouteSeller";
import LandingPage from "./routes/LandingPage";
import Home from "./routes/Home";
import CategoryListing from "./routes/CategoryListing";
import ProductDetail from "./routes/ProductDetail";
import Cart from "./routes/Cart";
import Checkout from "./routes/Checkout";
import OrderSuccess from "./routes/OrderSuccess";
import AuthPage from "./routes/AuthPage";
import SellerJoinPage from "./routes/SellerJoinPage";
import SellerLogin from "./routes/SellerLogin";
import SellerDashboard from "./routes/SellerDashboard";
import SearchResults from "./routes/SearchResults";
import { useIsShopperAuthenticated } from "./store/index";

// Landing page redirect if authenticated
function LandingPageWrapper() {
  const isAuthenticated = useIsShopperAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/shop" replace />;
  }

  return <LandingPage />;
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
      <Sentry.ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but an unexpected error occurred. Our team has been notified.
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
        <Routes>
          {/* Public pages with full site layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPageWrapper />} />
            <Route path="/category" element={<CategoryListing />} />
            <Route path="/category/:cat" element={<CategoryListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>

          {/* Shopper-protected routes with full site layout */}
          <Route element={<ProtectedRouteShopper />}>
            <Route element={<Layout />}>
              <Route path="/shop" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            </Route>
          </Route>

          {/* Seller-protected routes with full site layout */}
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
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;