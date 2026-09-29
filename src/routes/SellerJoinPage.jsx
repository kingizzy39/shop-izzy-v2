import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore, useIsSellerAuthenticated } from "../store/index";
import Button from "../components/Button";

const SellerJoinPage = () => {
  const navigate = useNavigate();
  const { setSeller, setSellerToken } = useStore();
  const isAuthenticated = useIsSellerAuthenticated();

  // Redirect if already authenticated as seller (use useEffect to avoid blank page during render)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/seller/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    storeName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Nigerian phone validation regex: +234 or 0 followed by 7, 8, or 9 and 9 digits
  const nigerianPhoneRegex = /^(\+234|0)[789]\d{9}$/;

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "storeName":
        if (!value.trim()) return "Store/Business name is required";
        if (value.trim().length < 2)
          return "Store name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";
      case "phone": {
        if (!value.trim()) return "Phone number is required";
        const cleanPhone = value.replace(/[\s-]/g, "");
        if (!nigerianPhoneRegex.test(cleanPhone))
          return "Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)";
        return "";
      }
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field on change
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Create seller object with only the required fields
      const newSeller = {
        name: formData.name.trim(),
        storeName: formData.storeName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
      };

      // Create mock JWT-style token
      const now = Date.now();
      const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
      const token = {
        type: "seller",
        userId: `seller_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        email: newSeller.email,
        name: newSeller.name,
        issuedAt: now,
        expiresAt: now + TOKEN_EXPIRY_MS,
      };

      setSellerToken(token);
      setSeller(newSeller);
      navigate("/seller/dashboard");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center text-structural/60 hover:text-structural transition-colors mb-8"
        >
          <svg
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Shop Izzy
        </Link>

        {/* Seller Join Card */}
        <div className="card-premium p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-amber/10 mb-4">
              <svg
                className="h-8 w-8 text-gradient-amber"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-structural mb-2">
              Join as a Seller
            </h1>
            <p className="text-structural/60">
              Create your seller account to start selling on Shop Izzy
            </p>
          </div>

          {/* Submit Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3 animate-slide-down">
              <svg
                className="h-5 w-5 text-rose-500 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p className="text-rose-700 text-sm">{submitError}</p>
            </div>
          )}

          {/* Seller Join Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="label-premium">
                Full Name
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-structural/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-premium pl-10 ${errors.name ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  disabled={isLoading}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
              {errors.name && (
                <p
                  id="name-error"
                  className="mt-1.5 text-sm text-rose-500"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Store/Business Name */}
            <div>
              <label htmlFor="storeName" className="label-premium">
                Store/Business Name
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-structural/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-premium pl-10 ${errors.storeName ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="Izzy Electronics"
                  required
                  autoComplete="organization"
                  disabled={isLoading}
                  aria-invalid={errors.storeName ? "true" : "false"}
                  aria-describedby={
                    errors.storeName ? "storeName-error" : undefined
                  }
                />
              </div>
              {errors.storeName && (
                <p
                  id="storeName-error"
                  className="mt-1.5 text-sm text-rose-500"
                  role="alert"
                >
                  {errors.storeName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label-premium">
                Email Address
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-structural/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-premium pl-10 ${errors.email ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1.5 text-sm text-rose-500"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="label-premium">
                Phone Number
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-structural/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-premium pl-10 ${errors.phone ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="+234 801 234 5678"
                  required
                  autoComplete="tel"
                  disabled={isLoading}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
              {errors.phone && (
                <p
                  id="phone-error"
                  className="mt-1.5 text-sm text-rose-500"
                  role="alert"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label-premium">
                Password
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-structural/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-premium pl-10 pr-12 ${errors.password ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-structural/40 hover:text-structural transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-1.5 text-sm text-rose-500"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label-premium">
                Confirm Password
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-structural/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-premium pl-10 pr-12 ${errors.confirmPassword ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                />
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="mt-1.5 text-sm text-rose-500"
                  role="alert"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Seller Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background-elevated text-structural/50">
                Or
              </span>
            </div>
          </div>

          {/* Signup Instead Link */}
          <div className="text-center">
            <p className="text-structural/60 mb-3">Just shopping?</p>
            <Link to="/signup" className="btn-primary inline-flex">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Go to signup instead
            </Link>
          </div>

          {/* Seller Login Link */}
          <div className="mt-6 text-center">
            <p className="text-structural/60">
              Already have a seller account?{" "}
              <Link
                to="/seller/login"
                className="text-gradient-amber hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-structural/50">
              Your data is protected with bank-grade encryption. By signing up,
              you agree to our{" "}
              <Link to="/terms" className="text-gradient-amber hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-gradient-amber hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerJoinPage;
