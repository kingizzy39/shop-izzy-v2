import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsSellerAuthenticated } from "../store/index";

const ProtectedRouteSeller = ({ children }) => {
  const isAuthenticated = useIsSellerAuthenticated();
  const location = useLocation();

  // If not authenticated, redirect to seller login with the current path as return URL
  if (!isAuthenticated) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRouteSeller;