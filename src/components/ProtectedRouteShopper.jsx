import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsShopperAuthenticated } from "../store/index";

const ProtectedRouteShopper = ({ children }) => {
  const isAuthenticated = useIsShopperAuthenticated();
  const location = useLocation();

  // If not authenticated, redirect to login with the current path as return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRouteShopper;