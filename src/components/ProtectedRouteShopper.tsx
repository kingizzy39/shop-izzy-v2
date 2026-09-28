import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useIsShopperAuthenticated } from "../store/index";

const ProtectedRouteShopper = () => {
  const isAuthenticated = useIsShopperAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteShopper;