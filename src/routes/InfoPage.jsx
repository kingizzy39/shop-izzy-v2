import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const pageContent = {
  about: {
    title: "About Us",
    description:
      "Shop Izzy is a premium marketplace for curated products from trusted sellers. We believe in quality, style, and value — bringing you the best selection across electronics, fashion, home, beauty, and grocery.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  careers: {
    title: "Careers",
    description:
      "We're always looking for talented people to join our team. Check back soon for open positions at Shop Izzy!",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  press: {
    title: "Press",
    description:
      "Press inquiries and media resources for Shop Izzy. Contact our press team at press@shopizzy.com for more information.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 8V4h16v4" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  sustainability: {
    title: "Sustainability",
    description:
      "Shop Izzy is committed to sustainable practices. We work with sellers who prioritize eco-friendly materials, ethical sourcing, and reduced carbon footprint.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  help: {
    title: "Help Centre",
    description:
      "Find answers to common questions about ordering, shipping, returns, and your account. Browse our help articles or contact support.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  returns: {
    title: "Returns & Refunds",
    description:
      "We offer a 30-day return policy on most items. Items must be in original condition with tags attached. Refunds are processed within 5-10 business days.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  contact: {
    title: "Contact Us",
    description:
      "Have questions? We'd love to hear from you. Email us at support@shopizzy.com or call +234 800 123 4567. Our team is available Monday-Friday, 9am-6pm WAT.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  faqs: {
    title: "FAQs",
    description:
      "Frequently asked questions about shopping on Shop Izzy. Find quick answers about orders, payments, shipping, and more.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use Shop Izzy.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  terms: {
    title: "Terms of Service",
    description:
      "By using Shop Izzy, you agree to these terms. Please read them carefully. They govern your use of our marketplace and services.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "We use cookies to improve your experience on Shop Izzy. This policy explains what cookies we use and how you can manage them.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  accessibility: {
    title: "Accessibility",
    description:
      "Shop Izzy is committed to making our marketplace accessible to everyone. We follow WCAG 2.1 guidelines and continuously improve our accessibility features.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-gradient-amber mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
};

const InfoPage = () => {
  const location = useLocation();
  const path = location.pathname.replace("/", "");
  const content = pageContent[path] || {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    icon: (
      <svg
        className="h-12 w-12 mx-auto text-border mb-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card-premium p-8 sm:p-12 text-center animate-fade-in">
          {content.icon}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-structural mb-4">
            {content.title}
          </h1>
          <p className="text-structural/60 text-lg mb-8 max-w-2xl mx-auto">
            {content.description}
          </p>
          <Link
            to="/shop"
            className="btn-primary inline-flex px-8 py-3.5 text-base"
          >
            Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
