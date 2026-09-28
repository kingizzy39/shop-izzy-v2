import React from "react";
import { Link } from "react-router-dom";

const UtilityBar = () => {
  return (
    <div className="bg-gradient-amber-soft border-b border-border/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center space-x-3 text-sm font-medium text-structural">
          <svg
            className="h-4 w-4 text-gradient-amber"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>Free delivery on orders over &#x20A6;50,000</span>
        </div>
        <div className="hidden sm:flex items-center space-x-6 text-sm text-structural/70 hover:text-structural">
          <Link
            to="/seller/join"
            className="font-medium hover:text-gradient-amber transition-colors"
          >
            Sell on Shop Izzy
          </Link>
          <Link to="#" className="hover:text-gradient-amber transition-colors">
            Track order
          </Link>
          <Link to="#" className="hover:text-gradient-amber transition-colors">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UtilityBar;
