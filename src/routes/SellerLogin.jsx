import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useStore, useIsSellerAuthenticated } from "../store/index";
import Button from "../components/Button";

const SellerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSellerProfile, setSellerToken } = useStore();
  const isAuthenticated = useIsSellerAuthenticated();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to dashboard (use useEffect to avoid blank page during render)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/seller/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock validation - in real app, this would be an API call
    // For demo purposes, accept any email/password combination
    if (email && password) {
      // Create a mock seller profile if one doesn't exist
      const profile = {
        id: `seller_${Date.now()}`,
        name: email.split("@")[0].replace(/[._]/g, " "),
        email: email,
        bio: "Welcome to your seller dashboard!",
        businessName: "My Store",
        businessType: "individual",
        businessCategory: "General",
        businessAddress: "",
        businessCity: "",
        businessState: "",
        businessPhone: "",
        businessEmail: email,
        bankDetails: {
          bankName: "",
          accountName: "",
          accountNumber: "",
          sortCode: "",
        },
        verificationStatus: "pending",
        createdAt: new Date().toISOString(),
      };

      // Create mock JWT-style token
      const now = Date.now();
      const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
      const token = {
        type: "seller",
        userId: `seller_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        email: email,
        name: profile.name,
        issuedAt: now,
        expiresAt: now + TOKEN_EXPIRY_MS,
      };

      setSellerToken(token);
      setSellerProfile(profile);

      // Redirect to intended destination or /seller/dashboard
      const from = location.state?.from?.pathname || "/seller/dashboard";
      navigate(from, { replace: true });
    } else {
      setError("Please enter both email and password");
    }

    setIsLoading(false);
  };

  // Demo credentials hint
  const demoCredentials = "Demo: any email + any password";

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

        {/* Login Card */}
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
              Seller Login
            </h1>
            <p className="text-structural/60">
              Access your seller dashboard to manage products and orders
            </p>
          </div>

          {/* Error Message */}
          {error && (
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
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-10"
                  placeholder="seller@example.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="label-premium mb-0">
                  Password
                </label>
                <Link
                  to="/seller/forgot-password"
                  className="text-sm text-gradient-amber hover:underline"
                >
                  Forgot password?
                </Link>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-10 pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-structural/40 hover:text-structural transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-gradient-amber focus:ring-amber-500"
                />
                <span className="text-sm text-structural/70">Remember me</span>
              </label>
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-4 bg-gradient-amber/5 border border-gradient-amber/20 rounded-lg text-center">
            <p className="text-sm text-structural/70">
              <span className="font-mono text-gradient-amber">
                {demoCredentials}
              </span>
            </p>
          </div>

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

          {/* Join as Seller */}
          <div className="text-center">
            <p className="text-structural/60 mb-3">
              Don&apos;t have a seller account?
            </p>
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
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-structural/50">
            Your data is protected with bank-grade encryption. By signing in,
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
  );
};

export default SellerLogin;
