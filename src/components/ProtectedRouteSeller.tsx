import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useIsSellerAuthenticated } from "../store/index";

const ProtectedRouteSeller = () => {
  const isAuthenticated = useIsSellerAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteSeller;