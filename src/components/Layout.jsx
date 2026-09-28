import React from "react";
import { Outlet } from "react-router-dom";
import UtilityBar from "./UtilityBar";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-structural">
      <ScrollToTop />
      <UtilityBar />
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
};

export default Layout;
