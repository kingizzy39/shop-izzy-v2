import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../components/Button";
import ImageWithFallback from "../components/ImageWithFallback";
import { formatPrice } from "../utils/format";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order data from navigation state
    const state = location.state;
    if (state) {
      setOrderData(state);
    } else {
      // If no state (direct navigation), redirect to home
      navigate("/");
    }
  }, [location, navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card-premium p-8 max-w-md w-full mx-4 text-center animate-fade-in">
          <svg
            className="h-12 w-12 mx-auto text-gradient-amber mb-4 animate-scale-in"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <h1 className="font-display text-2xl font-bold text-structural mb-2">
            Loading order details...
          </h1>
          <p className="text-structural/60">
            Please wait while we retrieve your order information.
          </p>
        </div>
      </div>
    );
  }

  const { orderId, shipping, payment, items, totals } = orderData;

  return (
    <>
      <div className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-amber/10 mb-6 animate-scale-in">
              <svg
                className="h-12 w-12 text-gradient-amber"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-structural mb-4">
              Order Confirmed!
            </h1>
            <p className="text-structural/60 text-lg max-w-2xl mx-auto">
              Thank you for your order. We&apos;ve sent a confirmation email to{" "}
              <strong className="text-structural">{shipping.email}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6 animate-slide-up">
              {/* Order Number */}
              <div className="card-premium p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-structural/60">Order Number</p>
                    <p className="font-display text-2xl font-bold text-structural font-mono tracking-wider">
                      #{orderId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gradient-amber bg-gradient-amber/10 px-4 py-2 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-amber opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-amber" />
                    </span>
                    <span className="font-medium">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card-premium p-6">
                <h2 className="font-display text-lg font-bold text-structural mb-4 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-gradient-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Shipping Address
                </h2>
                <address className="text-structural/70 not-italic space-y-1">
                  <p className="font-medium">
                    {shipping.firstName} {shipping.lastName}
                  </p>
                  <p>
                    {shipping.address}
                    {shipping.apartment ? `, ${shipping.apartment}` : ""}
                  </p>
                  <p>
                    {shipping.city}, {shipping.state} {shipping.postalCode}
                  </p>
                  <p>Nigeria</p>
                  <p className="mt-2">{shipping.email}</p>
                  <p>{shipping.phone}</p>
                </address>
              </div>

              {/* Payment Method */}
              <div className="card-premium p-6">
                <h2 className="font-display text-lg font-bold text-structural mb-4 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-gradient-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Payment Method
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 rounded-lg bg-background-muted border border-border flex items-center justify-center">
                    {payment.method === "card" && (
                      <svg
                        className="h-6 w-10 text-structural/60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect
                          x="1"
                          y="4"
                          width="22"
                          height="16"
                          rx="2"
                          ry="2"
                        />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    )}
                    {payment.method === "paystack" && (
                      <svg
                        className="h-6 w-6 text-gradient-amber"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                    {payment.method === "bankTransfer" && (
                      <svg
                        className="h-6 w-6 text-gradient-amber"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                        <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                        <path d="M10 2v2M14 2v2M7 7h10" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-structural capitalize">
                      {payment.method === "card"
                        ? "Credit/Debit Card"
                        : payment.method === "paystack"
                          ? "Paystack"
                          : "Bank Transfer"}
                    </p>
                    {payment.method === "card" && payment.cardNumber && (
                      <p className="text-sm text-structural/60">
                        •••• •••• •••• {payment.cardNumber.slice(-4)}
                      </p>
                    )}
                    {payment.method === "bankTransfer" && (
                      <p className="text-sm text-structural/60">
                        Transfer to Access Bank - Shop Izzy Ltd
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card-premium p-6">
                <h2 className="font-display text-lg font-bold text-structural mb-4 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-gradient-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6L6 2z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Order Items ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 p-4 bg-background-muted/50 rounded-lg"
                    >
                      <ImageWithFallback
                        product={{
                          keyword: item.product.keyword,
                          lock: item.product.lock,
                          cat: item.product.cat,
                        }}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                        width={64}
                        height={64}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-structural line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-structural/60">
                          Qty: {item.quantity} ×{" "}
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-structural whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="card-premium p-6">
                <h2 className="font-display text-lg font-bold text-structural mb-4 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-gradient-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Order Summary
                </h2>
                <dl className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">
                      Subtotal (
                      {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </dt>
                    <dd className="font-medium text-structural">
                      {formatPrice(totals.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">Shipping</dt>
                    <dd className="font-medium text-structural">
                      {totals.shipping === 0 ? (
                        <span className="text-gradient-amber">Free</span>
                      ) : (
                        formatPrice(totals.shipping)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">Tax (7.5% VAT)</dt>
                    <dd className="font-medium text-structural">
                      {formatPrice(totals.tax)}
                    </dd>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-structural">
                    <dt>Total</dt>
                    <dd className="text-gradient-amber">
                      {formatPrice(totals.total)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Next Steps */}
              <div className="card-premium p-6 bg-gradient-amber/5 border-border">
                <h2 className="font-display text-lg font-bold text-structural mb-4 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-gradient-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  </svg>
                  What Happens Next
                </h2>
                <ul className="space-y-3 text-structural/70">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-amber text-structural flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-structural">
                        Order Processing
                      </p>
                      <p className="text-sm text-structural/60">
                        We&apos;re preparing your items for shipment.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-amber text-structural flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-structural">
                        Shipment Dispatched
                      </p>
                      <p className="text-sm text-structural/60">
                        You&apos;ll receive tracking info via email/SMS.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-amber text-structural flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-structural">Delivery</p>
                      <p className="text-sm text-structural/60">
                        Expected within 3-5 business days.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div
              className="animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="card-premium p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold text-structural mb-4">
                  Need Help?
                </h2>
                <p className="text-structural/60 text-sm mb-6">
                  Our support team is here to assist you with any questions
                  about your order.
                </p>
                <div className="space-y-3">
                  <Link
                    href="mailto:support@shopizzy.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-background-muted border border-border hover:border-gradient-amber transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>
                      <p className="font-medium text-structural text-sm">
                        Email Support
                      </p>
                      <p className="text-xs text-structural/60">
                        support@shopizzy.com
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="tel:+2348001234567"
                    className="flex items-center gap-3 p-3 rounded-lg bg-background-muted border border-border hover:border-gradient-amber transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <p className="font-medium text-structural text-sm">
                        Call Us
                      </p>
                      <p className="text-xs text-structural/60">
                        +234 800 123 4567
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/faq"
                    className="flex items-center gap-3 p-3 rounded-lg bg-background-muted border border-border hover:border-gradient-amber transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                      <p className="font-medium text-structural text-sm">
                        FAQs
                      </p>
                      <p className="text-xs text-structural/60">
                        Common questions answered
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="mt-6 space-y-3 animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                <Button
                  onClick={() => navigate("/")}
                  className="w-full py-3.5 text-base"
                  size="lg"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Continue Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/account/orders")}
                  className="w-full py-3.5 text-base"
                  size="lg"
                >
                  View Order History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge Banner */}
      <div
        className="bg-structural py-6 mt-12 animate-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center sm:text-left">
            <div className="flex items-center gap-2 text-background">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-background">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                <path d="M10 2v2M14 2v2M7 7h10" />
              </svg>
              <span className="font-medium">Encrypted Payments</span>
            </div>
            <div className="flex items-center gap-2 text-background">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7V4h16v3" />
                <path d="M9 20h6" />
                <path d="M12 4v16" />
              </svg>
              <span className="font-medium">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 text-background">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
                <path d="M7 12h10M7 16h10M3 8h18" />
              </svg>
              <span className="font-medium">Order Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
