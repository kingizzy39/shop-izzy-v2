import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, useProducts, useSellerProducts, useClearCart } from "../store/index";
import Button from "../components/Button";
import ImageWithFallback from "../components/ImageWithFallback";
import { formatPrice, generateId } from "../utils/format";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useCart();
  const products = useProducts();
  const sellerProducts = useSellerProducts();
  const clearCart = useClearCart();

  // Combine all products
  const allProducts = useMemo(
    () => [...products, ...sellerProducts],
    [products, sellerProducts],
  );

  // Get cart items with product details
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) return null;
        return { product, quantity };
      })
      .filter(Boolean);
  }, [cart, allProducts]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const shipping = subtotal >= 50000 ? 0 : 2500;
  const tax = Math.round(subtotal * 0.075); // 7.5% VAT
  const total = subtotal + shipping + tax;

  const itemCount = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart],
  );

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    React.useEffect(() => {
      navigate("/cart");
    }, [navigate]);
    return null;
  }

  // Form state
  const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [errors, setErrors] = useState({});

  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "NG",
    saveInfo: false,
  });

  const [paymentForm, setPaymentForm] = useState({
    method: "card", // card, paystack, bankTransfer
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    saveCard: false,
  });

  // Nigerian states
  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  // Validation
  const validateShipping = () => {
    const newErrors = {};
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "postalCode",
    ];
    required.forEach((field) => {
      if (!shippingForm[field].trim()) {
        newErrors[field] =
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    if (
      shippingForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (
      shippingForm.phone &&
      !/^(\+234|0)[789]\d{9}$/.test(shippingForm.phone)
    ) {
      newErrors.phone = "Invalid Nigerian phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (paymentForm.method !== "card") return true;
    const newErrors = {};
    if (!paymentForm.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(paymentForm.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!paymentForm.cardExpiry) {
      newErrors.cardExpiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.cardExpiry)) {
      newErrors.cardExpiry = "Invalid format (MM/YY)";
    } else {
      const [month, year] = paymentForm.cardExpiry.split("/");
      const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expDate < now) {
        newErrors.cardExpiry = "Card has expired";
      }
    }
    if (!paymentForm.cardCvv) {
      newErrors.cardCvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentForm.cardCvv)) {
      newErrors.cardCvv = "Invalid CVV";
    }
    if (!paymentForm.cardName.trim()) {
      newErrors.cardName = "Name on card is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Format card number input
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  // Format expiry input
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setPaymentForm((prev) => ({ ...prev, cardExpiry: formatted }));
    if (errors.cardExpiry) {
      setErrors((prev) => ({ ...prev, cardExpiry: undefined }));
    }
  };

  const nextStep = () => {
    if (activeStep === 1) {
      if (validateShipping()) setActiveStep(2);
    } else if (activeStep === 2) {
      if (validatePayment()) setActiveStep(3);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (activeStep === 3) {
      // Validate all steps before placing order
      if (!validateShipping() || !validatePayment()) {
        setActiveStep(1);
        return;
      }

      // Simulate order processing
      const orderId = generateId().slice(0, 8).toUpperCase();

      // Clear cart after successful order
      clearCart();

      // Navigate to success page (could be a separate route)
      navigate(`/order-success/${orderId}`, {
        state: {
          orderId,
          shipping: shippingForm,
          payment: paymentForm,
          items: cartItems,
          totals: { subtotal, shipping, tax, total },
        },
      });
    }
  };

  const stepLabels = [
    { num: 1, label: "Shipping" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Review" },
  ];

  return (
    <>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              {stepLabels.map((step, index) => (
                <React.Fragment key={step.num}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        activeStep >= step.num
                          ? "bg-gradient-amber text-structural"
                          : "bg-background-muted text-structural/40"
                      }`}
                    >
                      {activeStep > step.num ? (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        step.num
                      )}
                    </div>
                    <span
                      className={`ml-2 hidden sm:block font-medium transition-colors ${
                        activeStep >= step.num
                          ? "text-structural"
                          : "text-structural/40"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < stepLabels.length - 1 && (
                    <div
                      className={`hidden lg:block h-1 w-32 mx-2 transition-colors ${
                        activeStep > index + 1
                          ? "bg-gradient-amber"
                          : "bg-border"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 animate-slide-up">
              {/* Step 1: Shipping Address */}
              {activeStep >= 1 && (
                <div className="card-premium p-6 mb-6" id="shipping-step">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-structural">
                        Shipping Address
                      </h2>
                      <p className="text-structural/60 text-sm mt-1">
                        Where should we deliver your order?
                      </p>
                    </div>
                    {activeStep > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveStep(1)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {activeStep === 1 && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="firstName" className="label-premium">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={shippingForm.firstName}
                            onChange={handleShippingChange}
                            className={`input-premium ${errors.firstName ? "border-rose-500 focus:border-rose-500" : ""}`}
                            placeholder="John"
                            required
                            autoComplete="given-name"
                          />
                          {errors.firstName && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="label-premium">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={shippingForm.lastName}
                            onChange={handleShippingChange}
                            className={`input-premium ${errors.lastName ? "border-rose-500 focus:border-rose-500" : ""}`}
                            placeholder="Doe"
                            required
                            autoComplete="family-name"
                          />
                          {errors.lastName && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className="label-premium">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={shippingForm.email}
                          onChange={handleShippingChange}
                          className={`input-premium ${errors.email ? "border-rose-500 focus:border-rose-500" : ""}`}
                          placeholder="john@example.com"
                          required
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="text-rose-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="phone" className="label-premium">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingForm.phone}
                          onChange={handleShippingChange}
                          className={`input-premium ${errors.phone ? "border-rose-500 focus:border-rose-500" : ""}`}
                          placeholder="+234 8XX XXX XXXX"
                          required
                          autoComplete="tel"
                        />
                        {errors.phone && (
                          <p className="text-rose-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="address" className="label-premium">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingForm.address}
                          onChange={handleShippingChange}
                          className={`input-premium ${errors.address ? "border-rose-500 focus:border-rose-500" : ""}`}
                          placeholder="123 Victoria Island"
                          required
                          autoComplete="street-address"
                        />
                        {errors.address && (
                          <p className="text-rose-500 text-sm mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="apartment" className="label-premium">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          id="apartment"
                          name="apartment"
                          value={shippingForm.apartment}
                          onChange={handleShippingChange}
                          className="input-premium"
                          placeholder="Apt 4B, Block C"
                          autoComplete="address-line2"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="city" className="label-premium">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingForm.city}
                            onChange={handleShippingChange}
                            className={`input-premium ${errors.city ? "border-rose-500 focus:border-rose-500" : ""}`}
                            placeholder="Lagos"
                            required
                            autoComplete="address-level2"
                          />
                          {errors.city && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.city}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="state" className="label-premium">
                            State
                          </label>
                          <select
                            id="state"
                            name="state"
                            value={shippingForm.state}
                            onChange={handleShippingChange}
                            className={`input-premium ${errors.state ? "border-rose-500 focus:border-rose-500" : ""}`}
                            required
                            autoComplete="address-level1"
                          >
                            <option value="">Select State</option>
                            {nigerianStates.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          {errors.state && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.state}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="postalCode" className="label-premium">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingForm.postalCode}
                            onChange={handleShippingChange}
                            className={`input-premium ${errors.postalCode ? "border-rose-500 focus:border-rose-500" : ""}`}
                            placeholder="100001"
                            required
                            autoComplete="postal-code"
                            maxLength={6}
                          />
                          {errors.postalCode && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.postalCode}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="country" className="label-premium">
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={shippingForm.country}
                            onChange={handleShippingChange}
                            className="input-premium"
                            disabled
                          >
                            <option value="NG">Nigeria</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                        <input
                          type="checkbox"
                          id="saveInfo"
                          name="saveInfo"
                          checked={shippingForm.saveInfo}
                          onChange={handleShippingChange}
                          className="w-4 h-4 rounded border-border text-gradient-amber focus:ring-amber-500"
                        />
                        <label
                          htmlFor="saveInfo"
                          className="text-sm text-structural/70 cursor-pointer"
                        >
                          Save this information for next time
                        </label>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button type="submit" size="lg">
                          Continue to Payment
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </div>
                    </form>
                  )}

                  {activeStep > 1 && (
                    <div className="bg-background-muted/50 p-4 rounded-lg">
                      <p className="font-medium text-structural">
                        {shippingForm.firstName} {shippingForm.lastName}
                      </p>
                      <p className="text-structural/60 text-sm">
                        {shippingForm.email}
                      </p>
                      <p className="text-structural/60 text-sm">
                        {shippingForm.phone}
                      </p>
                      <p className="text-structural/60 text-sm mt-1">
                        {shippingForm.address}
                        {shippingForm.apartment
                          ? `, ${shippingForm.apartment}`
                          : ""}
                      </p>
                      <p className="text-structural/60 text-sm">
                        {shippingForm.city}, {shippingForm.state}{" "}
                        {shippingForm.postalCode}
                      </p>
                      <p className="text-structural/60 text-sm">Nigeria</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Payment Method */}
              {activeStep >= 2 && (
                <div className="card-premium p-6 mb-6" id="payment-step">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-structural">
                        Payment Method
                      </h2>
                      <p className="text-structural/60 text-sm mt-1">
                        How would you like to pay?
                      </p>
                    </div>
                    {activeStep > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveStep(2)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {activeStep === 2 && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                    >
                      {/* Payment Method Options */}
                      <div className="space-y-3 mb-6">
                        {[
                          {
                            id: "card",
                            label: "Credit/Debit Card",
                            desc: "Pay with Visa, Mastercard, or Verve",
                          },
                          {
                            id: "paystack",
                            label: "Paystack",
                            desc: "Secure online payment via Paystack",
                          },
                          {
                            id: "bankTransfer",
                            label: "Bank Transfer",
                            desc: "Pay directly from your bank account",
                          },
                        ].map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              paymentForm.method === method.id
                                ? "border-gradient-amber bg-gradient-amber/5"
                                : "border-border hover:border-border-strong"
                            }`}
                          >
                            <input
                              type="radio"
                              name="method"
                              value={method.id}
                              checked={paymentForm.method === method.id}
                              onChange={handlePaymentChange}
                              className="w-5 h-5 text-gradient-amber border-border-strong focus:ring-amber-500"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-structural">
                                {method.label}
                              </p>
                              <p className="text-sm text-structural/60">
                                {method.desc}
                              </p>
                            </div>
                            {paymentForm.method === method.id && (
                              <svg
                                className="w-5 h-5 text-gradient-amber"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </label>
                        ))}
                      </div>

                      {/* Card Details Form */}
                      {paymentForm.method === "card" && (
                        <div className="space-y-4 animate-fade-in">
                          <div className="p-4 bg-background-muted/50 rounded-lg border border-border">
                            <h3 className="font-semibold text-structural mb-4">
                              Card Details
                            </h3>
                            <div className="mb-4">
                              <label
                                htmlFor="cardNumber"
                                className="label-premium"
                              >
                                Card Number
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentForm.cardNumber}
                                onChange={handleCardNumberChange}
                                className={`input-premium ${errors.cardNumber ? "border-rose-500 focus:border-rose-500" : ""}`}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                autoComplete="cc-number"
                                required
                              />
                              {errors.cardNumber && (
                                <p className="text-rose-500 text-sm mt-1">
                                  {errors.cardNumber}
                                </p>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="cardExpiry"
                                  className="label-premium"
                                >
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  value={paymentForm.cardExpiry}
                                  onChange={handleExpiryChange}
                                  className={`input-premium ${errors.cardExpiry ? "border-rose-500 focus:border-rose-500" : ""}`}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  autoComplete="cc-exp"
                                  required
                                />
                                {errors.cardExpiry && (
                                  <p className="text-rose-500 text-sm mt-1">
                                    {errors.cardExpiry}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label
                                  htmlFor="cardCvv"
                                  className="label-premium"
                                >
                                  CVV
                                </label>
                                <input
                                  type="password"
                                  id="cardCvv"
                                  name="cardCvv"
                                  value={paymentForm.cardCvv}
                                  onChange={handlePaymentChange}
                                  className={`input-premium ${errors.cardCvv ? "border-rose-500 focus:border-rose-500" : ""}`}
                                  placeholder="123"
                                  maxLength={4}
                                  autoComplete="cc-csc"
                                  required
                                />
                                {errors.cardCvv && (
                                  <p className="text-rose-500 text-sm mt-1">
                                    {errors.cardCvv}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mt-4">
                              <label
                                htmlFor="cardName"
                                className="label-premium"
                              >
                                Name on Card
                              </label>
                              <input
                                type="text"
                                id="cardName"
                                name="cardName"
                                value={paymentForm.cardName}
                                onChange={handlePaymentChange}
                                className={`input-premium ${errors.cardName ? "border-rose-500 focus:border-rose-500" : ""}`}
                                placeholder="John Doe"
                                required
                                autoComplete="cc-name"
                              />
                              {errors.cardName && (
                                <p className="text-rose-500 text-sm mt-1">
                                  {errors.cardName}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="saveCard"
                              name="saveCard"
                              checked={paymentForm.saveCard}
                              onChange={handlePaymentChange}
                              className="w-4 h-4 rounded border-border text-gradient-amber focus:ring-amber-500"
                            />
                            <label
                              htmlFor="saveCard"
                              className="text-sm text-structural/70 cursor-pointer"
                            >
                              Save this card for future purchases
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Paystack Info */}
                      {paymentForm.method === "paystack" && (
                        <div className="p-4 bg-background-muted/50 rounded-lg border border-border animate-fade-in">
                          <div className="flex items-center gap-3">
                            <svg
                              className="h-6 w-6 text-gradient-amber flex-shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <div>
                              <p className="font-medium text-structural">
                                Paystack Payment
                              </p>
                              <p className="text-sm text-structural/60">
                                You&apos;ll be redirected to Paystack to
                                complete your payment securely.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bank Transfer Info */}
                      {paymentForm.method === "bankTransfer" && (
                        <div className="p-4 bg-background-muted/50 rounded-lg border border-border animate-fade-in">
                          <div className="flex items-start gap-3">
                            <svg
                              className="h-6 w-6 text-gradient-amber flex-shrink-0 mt-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                              <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                              <path d="M10 2v2M14 2v2M7 7h10" />
                            </svg>
                            <div>
                              <p className="font-medium text-structural">
                                Bank Transfer
                              </p>
                              <p className="text-sm text-structural/60">
                                Transfer to our account and upload the receipt.
                                Your order will be processed once payment is
                                confirmed.
                              </p>
                              <div className="mt-3 text-sm text-structural/70 space-y-1">
                                <p>
                                  <strong>Bank:</strong> Access Bank
                                </p>
                                <p>
                                  <strong>Account Name:</strong> Shop Izzy Ltd
                                </p>
                                <p>
                                  <strong>Account Number:</strong> 1234567890
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          size="lg"
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                          </svg>
                          Back
                        </Button>
                        <Button type="submit" size="lg">
                          Continue to Review
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </div>
                    </form>
                  )}

                  {activeStep > 2 && (
                    <div className="bg-background-muted/50 p-4 rounded-lg">
                      <p className="font-medium text-structural capitalize">
                        {paymentForm.method === "card"
                          ? "Credit/Debit Card"
                          : paymentForm.method === "paystack"
                            ? "Paystack"
                            : "Bank Transfer"}
                      </p>
                      {paymentForm.method === "card" &&
                        paymentForm.cardNumber && (
                          <p className="text-structural/60 text-sm mt-1">
                            •••• •••• •••• {paymentForm.cardNumber.slice(-4)}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review Order */}
              {activeStep === 3 && (
                <div className="card-premium p-6 mb-6 animate-slide-up">
                  <h2 className="font-display text-xl font-bold text-structural mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <h3 className="font-semibold text-structural mb-3">
                      Shipping Address
                    </h3>
                    <p className="text-structural/70">
                      {shippingForm.firstName} {shippingForm.lastName}
                    </p>
                    <p className="text-structural/60 text-sm">
                      {shippingForm.email}
                    </p>
                    <p className="text-structural/60 text-sm">
                      {shippingForm.phone}
                    </p>
                    <p className="text-structural/60 text-sm mt-1">
                      {shippingForm.address}
                      {shippingForm.apartment
                        ? `, ${shippingForm.apartment}`
                        : ""}
                    </p>
                    <p className="text-structural/60 text-sm">
                      {shippingForm.city}, {shippingForm.state}{" "}
                      {shippingForm.postalCode}
                    </p>
                    <p className="text-structural/60 text-sm">Nigeria</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <h3 className="font-semibold text-structural mb-3">
                      Payment Method
                    </h3>
                    <p className="text-structural/70 capitalize">
                      {paymentForm.method === "card"
                        ? "Credit/Debit Card"
                        : paymentForm.method === "paystack"
                          ? "Paystack"
                          : "Bank Transfer"}
                    </p>
                    {paymentForm.method === "card" &&
                      paymentForm.cardNumber && (
                        <p className="text-structural/60 text-sm mt-1">
                          •••• •••• •••• {paymentForm.cardNumber.slice(-4)}
                        </p>
                      )}
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-structural mb-3">
                      Order Items ({itemCount})
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-3 p-3 bg-background-muted/50 rounded-lg"
                        >
                          <ImageWithFallback
                            product={{
                              keyword: item.product.keyword,
                              lock: item.product.lock,
                              cat: item.product.cat,
                            }}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                            loading="lazy"
                            width={56}
                            height={56}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-structural text-sm line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-structural/60 text-xs">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-structural text-sm whitespace-nowrap">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-structural/60">
                        Subtotal ({itemCount} items)
                      </span>
                      <span className="font-medium text-structural">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-structural/60">Shipping</span>
                      <span className="font-medium text-structural">
                        {shipping === 0 ? (
                          <span className="text-gradient-amber">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-structural/60">
                        Estimated Tax (7.5% VAT)
                      </span>
                      <span className="font-medium text-structural">
                        {formatPrice(tax)}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-structural">
                      <span>Total</span>
                      <span className="text-gradient-amber">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 mt-6">
                    <Button variant="outline" onClick={prevStep} size="lg">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      size="lg"
                      className="group"
                    >
                      Place Order
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>

                  <p className="text-xs text-structural/50 text-center mt-4">
                    By placing your order, you agree to our{" "}
                    <a href="#" className="text-gradient-amber hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-gradient-amber hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div
              className="animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="card-premium p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-structural mb-6">
                  Order Summary
                </h2>

                <dl className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">
                      Subtotal ({itemCount} items)
                    </dt>
                    <dd className="font-medium text-structural">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">Shipping</dt>
                    <dd className="font-medium text-structural">
                      {shipping === 0 ? (
                        <span className="text-gradient-amber">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </dd>
                  </div>
                  {subtotal < 50000 && (
                    <p className="text-xs text-gradient-amber text-center">
                      Add {formatPrice(50000 - subtotal)} more for free
                      shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <dt className="text-structural/60">
                      Estimated Tax (7.5% VAT)
                    </dt>
                    <dd className="font-medium text-structural">
                      {formatPrice(tax)}
                    </dd>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold text-structural">
                      <dt>Total</dt>
                      <dd className="text-gradient-amber">
                        {formatPrice(total)}
                      </dd>
                    </div>
                  </div>
                </dl>

                <ul className="space-y-2 text-sm text-structural/60 mb-6">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Secure checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                      <path d="M10 2v2M14 2v2M7 7h10" />
                    </svg>
                    Free shipping over ₦50,000
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-gradient-amber flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 7V4h16v3" />
                      <path d="M9 20h6" />
                      <path d="M12 4v16" />
                    </svg>
                    30-day returns
                  </li>
                </ul>

                {activeStep < 3 && (
                  <div className="text-center p-4 bg-background-muted/50 rounded-lg">
                    <p className="text-sm text-structural/60 mb-2">
                      Complete the steps to place your order
                    </p>
                    <p className="text-xs text-structural/50">
                      Step {activeStep} of 3
                    </p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-3">
                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full py-3.5 text-base"
                      size="lg"
                    >
                      Place Order
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                    <p className="text-xs text-structural/50 text-center">
                      By placing your order, you agree to our{" "}
                      <a
                        href="#"
                        className="text-gradient-amber hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-gradient-amber hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                )}
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M17 21h-10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
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

export default Checkout;
