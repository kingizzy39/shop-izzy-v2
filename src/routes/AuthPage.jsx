import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useStore, useIsShopperAuthenticated } from "../store/index";
import Button from "../components/Button";

// localStorage key for user accounts
const USERS_STORAGE_KEY = "shop-izzy-users";

const getUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore quota errors
  }
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setShopperToken } = useStore();
  const isAuthenticated = useIsShopperAuthenticated();

  // Redirect if already authenticated as shopper (use useEffect to avoid blank page during render)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!isLogin) {
          if (!value.trim()) return "Full name is required";
          if (value.trim().length < 2) return "Name must be at least 2 characters";
        }
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (!isLogin) {
          if (!value) return "Please confirm your password";
          if (value !== formData.password) return "Passwords do not match";
        }
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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const email = formData.email.trim().toLowerCase();
      const users = getUsers();

      if (isLogin) {
        // Sign in: find user with matching email and password
        const user = users.find((u) => u.email === email && u.password === formData.password);

        if (!user) {
          setSubmitError("Invalid email or password. Please try again.");
          setIsLoading(false);
          return;
        }

        // Create mock JWT-style token for existing user
        const now = Date.now();
        const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
        const token = {
          type: "shopper",
          userId: user.userId || `shopper_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          email: user.email,
          name: user.name,
          issuedAt: now,
          expiresAt: now + TOKEN_EXPIRY_MS,
        };

        setShopperToken(token);
        setUser({ name: user.name, email: user.email });
      } else {
        // Sign up: check for duplicate email
        const existingUser = users.find((u) => u.email === email);

        if (existingUser) {
          setSubmitError("An account with this email already exists. Please sign in instead.");
          setIsLoading(false);
          return;
        }

        // Create new user
        const newUser = {
          userId: `shopper_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          name: formData.name.trim(),
          email: email,
          password: formData.password, // In real app, this would be hashed
        };

        // Save to localStorage
        users.push(newUser);
        saveUsers(users);

        // Create mock JWT-style token
        const now = Date.now();
        const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
        const token = {
          type: "shopper",
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          issuedAt: now,
          expiresAt: now + TOKEN_EXPIRY_MS,
        };

        setShopperToken(token);
        setUser({ name: newUser.name, email: newUser.email });
      }

      // Redirect to intended destination or /shop
      const from = location.state?.from?.pathname || "/shop";
      navigate(from, { replace: true });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch between login and signup
  const switchMode = () => {
    setIsLogin((prev) => !prev);
    setErrors({});
    setSubmitError("");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
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

        {/* Auth Card */}
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
                {isLogin ? (
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                ) : (
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                )}
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-structural mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-structural/60">
              {isLogin
                ? "Sign in to your Shop Izzy account"
                : "Join Shop Izzy to start shopping"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6">
            <div className="flex bg-background-elevated rounded-lg p-1" role="tablist">
              <button
                role="tab"
                aria-selected={!isLogin}
                onClick={switchMode}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-gradient-amber text-background shadow-sm"
                    : "text-structural/60 hover:text-structural"
                }`}
              >
                Sign Up
              </button>
              <button
                role="tab"
                aria-selected={isLogin}
                onClick={switchMode}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-gradient-amber text-background shadow-sm"
                    : "text-structural/60 hover:text-structural"
                }`}
              >
                Sign In
              </button>
            </div>
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

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name (only for signup) */}
            {!isLogin && (
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
                    required={!isLogin}
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
            )}

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
                  autoComplete={isLogin ? "email" : "email"}
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

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="label-premium mb-0">
                  Password
                </label>
                {isLogin && (
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gradient-amber hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
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
                  autoComplete={isLogin ? "current-password" : "new-password"}
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

            {/* Confirm Password (only for signup) */}
            {!isLogin && (
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
            )}

            {/* Remember Me (only for login) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))
                    }
                    className="w-4 h-4 rounded border-border text-gradient-amber focus:ring-amber-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-structural/70">Remember me</span>
                </label>
              </div>
            )}

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
                  {isLogin ? "Signing in..." : "Creating Account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
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

          {/* Seller Join Link */}
          <div className="text-center">
            <p className="text-structural/60 mb-3">Selling instead?</p>
            <Link to="/seller/join" className="btn-primary inline-flex">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Join as a Seller
            </Link>
          </div>

          {/* Social Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="btn-outline py-3"
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="btn-outline py-3"
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-structural/50">
              Your data is protected with bank-grade encryption. By {isLogin ? "signing in" : "signing up"},
              you agree to our{" "}
              <Link href="#" className="text-gradient-amber hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-gradient-amber hover:underline">
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

export default AuthPage;