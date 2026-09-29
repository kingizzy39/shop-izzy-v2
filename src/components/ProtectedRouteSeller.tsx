import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useIsSellerAuthenticated, useStore } from "../store/index";

const ProtectedRouteSeller = () => {
  const isAuthenticated = useIsSellerAuthenticated();
  const location = useLocation();
  const hasHydrated = useStore((state) => state.hasHydrated);
  const [isLoading, setIsLoading] = useState(true);

  // Wait for store hydration to complete before checking auth
  useEffect(() => {
    if (hasHydrated) {
      setIsLoading(false);
    }
  }, [hasHydrated]);

  // Show loading while store is hydrating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-gradient-amber border-t-transparent" />
          <p className="text-structural/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteSeller;
