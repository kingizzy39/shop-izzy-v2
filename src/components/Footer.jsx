import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Sell on Shop Izzy", href: "/seller/join" },
      { label: "Press", href: "#" },
      { label: "Sustainability", href: "#" },
    ],
    customerService: [
      { label: "Help centre", href: "#" },
      { label: "Track my order", href: "/cart" },
      { label: "Returns & refunds", href: "#" },
      { label: "Contact us", href: "#" },
      { label: "FAQs", href: "#" },
    ],
    categories: [
      { label: "Phones & Tablets", href: "/category?cat=phones" },
      { label: "Electronics", href: "/category?cat=electronics" },
      { label: "Fashion", href: "/category?cat=fashion" },
      { label: "Home & Living", href: "/category?cat=home" },
      { label: "Beauty & Grooming", href: "/category?cat=beauty" },
      { label: "Supermarket", href: "/category?cat=grocery" },
    ],
    legal: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Cookie policy", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
          <path d="M10 15l5-3-5-3z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-background-elevated border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/shop"
              className="flex items-center space-x-3 mb-6"
              aria-label="Shop Izzy Home"
            >
              <span className="text-2xl font-bold font-display text-gradient-amber">
                Shop
              </span>
              <span className="text-2xl font-bold font-display text-structural">
                Izzy
              </span>
            </Link>
            <p className="text-sm text-structural/60 mb-6">
              Premium marketplace for curated products from trusted sellers.
              Discover quality, style, and value.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="btn-ghost p-2 text-structural/60 hover:text-structural transition-colors"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-structural mb-4">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-structural/60 hover:text-gradient-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-structural mb-4">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-structural/60 hover:text-gradient-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-structural mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-structural/60 hover:text-gradient-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border pt-10 mb-10">
          <div className="max-w-xl">
            <h4 className="font-semibold text-structural mb-2">
              Stay in the loop
            </h4>
            <p className="text-sm text-structural/60 mb-4">
              Sign up for early access to new drops, price changes, and
              exclusive offers.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="input-premium flex-1"
                required
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-structural/50 mt-3">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-structural/60">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="hover:text-gradient-amber transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-structural/60">
            <span>© {currentYear} Shop Izzy</span>
            <span className="hidden sm:inline">•</span>
            <span>A demo storefront — no orders are processed</span>
            <span className="hidden sm:inline">•</span>
            <span>Made for advertising &amp; design purposes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
