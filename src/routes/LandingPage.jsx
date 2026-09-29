import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data";

// Select 6 diverse products from different categories
const FEATURED_PRODUCTS = [
  PRODUCTS.find((p) => p.id === "p01"), // Aria Wireless Over-Ear Headphones (electronics)
  PRODUCTS.find((p) => p.id === "p03"), // Linen-Blend Tailored Blazer (fashion)
  PRODUCTS.find((p) => p.id === "p06"), // Verlo Smartphone (phones)
  PRODUCTS.find((p) => p.id === "p18"), // Mechanical Keyboard (electronics)
  PRODUCTS.find((p) => p.id === "p27"), // Raw Selvedge Denim Jeans (fashion)
  PRODUCTS.find((p) => p.id === "p32"), // Linen Duvet Cover Set (home)
].filter(Boolean);

// Floating elements data for "prices that make sense" section
const FLOATING_ELEMENTS = [
  { icon: "💰", label: "No hidden fees", delay: "0s", x: "10%", y: "15%" },
  {
    icon: "📦",
    label: "Free shipping over ₦50K",
    delay: "1s",
    x: "85%",
    y: "20%",
  },
  { icon: "🔄", label: "30-day easy returns", delay: "2s", x: "15%", y: "75%" },
  { icon: "🔒", label: "Secure checkout", delay: "3s", x: "80%", y: "80%" },
  {
    icon: "⭐",
    label: "Price match guarantee",
    delay: "0.5s",
    x: "50%",
    y: "50%",
  },
  { icon: "🎁", label: "Loyalty rewards", delay: "1.5s", x: "30%", y: "40%" },
];

// Stats for "arrives exactly as promised" section
const STATS = [
  { value: 98.5, suffix: "%", label: "On-time delivery rate", endValue: 98.5 },
  { value: 250000, suffix: "+", label: "Happy customers", endValue: 250000 },
  { value: 4.8, suffix: "/5", label: "Average rating", endValue: 4.8 },
  { value: 12000, suffix: "+", label: "Products delivered", endValue: 12000 },
];

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price / 100);
};

// 3D Tilt Card Component
const TiltCard = ({ product }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degrees
    const rotateY = ((x - centerX) / centerX) * 8; // Max 8 degrees
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Use product.img (from data.ts) which provides reliable product images
  const productImg = product.img;

  return (
    <div
      ref={cardRef}
      className="group relative card-premium overflow-hidden"
      style={{
        transform,
        transition: isHovered
          ? "transform 0.1s ease-out"
          : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={productImg}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-structural/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Discount badge */}
        {product.was && product.was > product.price && (
          <span className="absolute top-4 left-4 btn-secondary text-xs px-3 py-1.5 z-10">
            -{Math.round(((product.was - product.price) / product.was) * 100)}%
          </span>
        )}
        {/* Quick view button on hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
          <Link
            to={`/product/${product.id}`}
            className="btn-primary px-6 py-2.5 text-sm shadow-lg"
            aria-label={`View ${product.name}`}
          >
            Quick View
          </Link>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="font-display text-xl font-bold text-structural group-hover:text-gradient-amber transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-structural/60 line-clamp-2">
          {product.desc}
        </p>
        <div className="flex items-baseline gap-3 pt-2 border-t border-border">
          <span className="font-bold text-lg text-structural">
            {formatPrice(product.price)}
          </span>
          {product.was && product.was > product.price && (
            <span className="text-structural/50 line-through text-sm">
              {formatPrice(product.was)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-structural/60 text-sm">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= (product.rating ?? 0) ? "text-amber-500" : "text-border"
              }
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-structural/50">({product.reviews})</span>
        </div>
      </div>
      {/* Shimmer effect on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};

// CountUp Animation Component
const CountUp = ({ endValue, suffix, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      let startTime = null;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Easing function: easeOutExpo
        const easedProgress =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = Math.floor(easedProgress * endValue);
        setCount(currentValue);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, endValue, duration, delay]);

  // Format the number for display
  const displayValue =
    endValue >= 1000
      ? count.toLocaleString()
      : endValue % 1 !== 0
        ? count.toFixed(1)
        : count.toString();

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-structural mb-2">
        <span className="text-gradient-amber">{displayValue}</span>
        {suffix}
      </div>
      <p className="text-structural/60 text-lg font-medium">
        {suffix === "+"
          ? "Happy customers"
          : suffix === "%"
            ? "On-time delivery rate"
            : suffix === "/5"
              ? "Average rating"
              : "Products delivered"}
      </p>
    </div>
  );
};

// Scroll Reveal Wrapper Component
const ScrollReveal = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const baseStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translateY(0)"
      : direction === "up"
        ? "translateY(30px)"
        : direction === "down"
          ? "translateY(-30px)"
          : direction === "left"
            ? "translateX(30px)"
            : "translateX(-30px)",
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  };

  return (
    <div ref={ref} style={baseStyles} className={className}>
      {children}
    </div>
  );
};

// Floating Element Component
const FloatingElement = ({ icon, label, delay, x, y }) => (
  <div
    className="absolute flex flex-col items-center gap-1.5 pointer-events-none"
    style={{
      left: x,
      top: y,
      animation: `float-bob 6s ease-in-out ${delay} infinite`,
    }}
  >
    <div
      className="w-14 h-14 rounded-2xl bg-background-elevated/90 backdrop-blur-sm border border-border flex items-center justify-center text-2xl shadow-lg"
      style={{ animation: `float-bob 4s ease-in-out ${delay} infinite` }}
    >
      {icon}
    </div>
    <span className="text-xs font-medium text-structural/70 bg-background-elevated/90 backdrop-blur-sm px-2 py-1 rounded-full border border-border shadow-md white-space-nowrap">
      {label}
    </span>
  </div>
);

// Marquee Component
const Marquee = () => {
  const text =
    "Shopping the Izzy way  •  Quality you can see  •  Prices that make sense  •  Delivered as promised  •  ";
  const repeatedText = text.repeat(4);

  return (
    <div className="overflow-hidden bg-gradient-amber py-6" aria-hidden="true">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        <span className="font-display text-3xl sm:text-4xl font-bold text-background px-4">
          {repeatedText}
        </span>
      </div>
    </div>
  );
};

// Large Shimmer CTA Button
const ShimmerCTA = ({ children, to, className = "" }) => (
  <Link
    to={to}
    className={`relative overflow-hidden btn-primary px-10 py-5 text-lg font-bold ${className}`}
    style={{
      backgroundSize: "200% 100%",
      backgroundPosition: "200% 0",
      transition:
        "background-position 0.6s ease, transform 0.2s ease, box-shadow 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundPosition = "0% 0";
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow =
        "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundPosition = "200% 0";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <span className="relative z-10">{children}</span>
    <span
      className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent translate-x-[-100%] transition-transform duration-700"
      aria-hidden="true"
    />
  </Link>
);

// Parallax background element
const ParallaxBlob = ({ className, style, delay = 0 }) => (
  <div
    className={className}
    style={{
      ...style,
      animationDelay: `${delay}s`,
    }}
  />
);

// Feature icon component
const FeatureIcon = ({ icon, className = "" }) => (
  <div
    className={`w-12 h-12 rounded-xl bg-gradient-amber/10 flex items-center justify-center text-2xl ${className}`}
    aria-hidden="true"
  >
    {icon}
  </div>
);

// Trust indicator icon component
const TrustIcon = ({ children, className = "" }) => (
  <div
    className={`w-12 h-12 rounded-xl bg-gradient-amber/10 flex items-center justify-center text-gradient-amber ${className}`}
    aria-hidden="true"
  >
    {children}
  </div>
);

const LandingPage = () => {
  return (
    <div className="animate-fade-in min-h-screen bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center bg-background">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <ParallaxBlob
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-amber/10 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "8s" }}
            delay={0}
          />
          <ParallaxBlob
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "10s" }}
            delay={1}
          />
          <ParallaxBlob
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "12s" }}
            delay={0.5}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal delay={0} direction="up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-amber/20 border border-border text-sm font-medium text-structural mb-6">
              Welcome to Shop Izzy
            </span>
          </ScrollReveal>

          <ScrollReveal delay={100} direction="up">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-structural leading-tight mb-8 text-balance">
              This is shopping, <br />
              <span className="text-gradient-amber">the Izzy way.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <p className="text-lg sm:text-xl lg:text-2xl text-structural/60 max-w-3xl mx-auto mb-10 leading-relaxed text-balance">
              Curated quality. Transparent prices. Delivered exactly as
              promised. No games, no guesswork — just shopping the way it should
              be.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300} direction="up">
            <ShimmerCTA to="/signup">Shop Now</ShimmerCTA>
          </ScrollReveal>

          <ScrollReveal delay={500} direction="up">
            <p className="mt-6 text-sm text-structural/50">
              Free shipping on orders over ₦50,000 • 30-day returns • Secure
              checkout
            </p>
          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <ScrollReveal delay={800} direction="up">
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            <svg
              className="w-6 h-6 text-structural/30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== MARQUEE SECTION ===== */}
      <Marquee />

      {/* ===== SECTION: Quality You Can Actually See ===== */}
      <section className="section-premium bg-background-elevated">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-amber/20 border border-border text-sm font-medium text-structural mb-4">
                Quality You Can Actually See
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-structural mb-4">
                The Izzy way means <br />
                <span className="text-gradient-amber">
                  quality you can actually see
                </span>
              </h2>
              <p className="text-lg text-structural/60 max-w-2xl mx-auto">
                Every product is vetted, photographed, and described with
                honesty. What you see is exactly what arrives at your door.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURED_PRODUCTS.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100} direction="up">
                <TiltCard product={product} index={index} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={600} direction="up">
            <div className="mt-12 text-center">
              <Link
                to="/category"
                className="btn-outline px-8 py-3.5 text-base"
              >
                Explore All Products
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION: Prices That Make Sense ===== */}
      <section className="section-premium relative overflow-hidden bg-background">
        {/* Floating background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <ParallaxBlob
            className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "15s" }}
            delay={0}
          />
          <ParallaxBlob
            className="absolute bottom-1/4 right-10 w-72 h-72 bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "18s" }}
            delay={2}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-amber/20 border border-border text-sm font-medium text-structural mb-4">
                Transparent Pricing
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-structural mb-4">
                The Izzy way means <br />
                <span className="text-gradient-amber">
                  prices that make sense
                </span>
              </h2>
              <p className="text-lg text-structural/60 max-w-2xl mx-auto">
                No hidden markups. No fake discounts. Just honest pricing that
                respects your wallet and your intelligence.
              </p>
            </div>
          </ScrollReveal>

          {/* Floating Elements */}
          <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[2/1] max-w-5xl mx-auto">
            {/* Central illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Price tag central element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-full h-full bg-background-elevated/80 backdrop-blur-md rounded-3xl border border-border shadow-2xl flex items-center justify-center relative"
                    style={{ animation: "float-bob 8s ease-in-out infinite" }}
                  >
                    <div className="text-center p-8">
                      <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient-amber mb-2">
                        ₦
                        {formatPrice(FEATURED_PRODUCTS[0].price)
                          .replace("₦", "")
                          .replace(",", "")}
                      </div>
                      <p className="text-structural/60 text-sm uppercase tracking-wider">
                        Was ₦
                        {formatPrice(FEATURED_PRODUCTS[0].was)
                          .replace("₦", "")
                          .replace(",", "")}
                      </p>
                      <p className="text-structural/50 text-xs mt-1">
                        You save{" "}
                        {Math.round(
                          ((FEATURED_PRODUCTS[0].was -
                            FEATURED_PRODUCTS[0].price) /
                            FEATURED_PRODUCTS[0].was) *
                            100,
                        )}
                        %
                      </p>
                    </div>
                    {/* Price tag hole */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-background rounded-full border border-border" />
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements around the center */}
            {FLOATING_ELEMENTS.map((el, index) => (
              <FloatingElement
                key={index}
                icon={el.icon}
                label={el.label}
                delay={el.delay}
                x={el.x}
                y={el.y}
              />
            ))}
          </div>

          {/* Feature callouts grid */}
          <ScrollReveal delay={300} direction="up">
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🏷️",
                  title: "No Fake Discounts",
                  desc: 'Every "was" price is a real previous price. We never inflate original prices to fake savings.',
                },
                {
                  icon: "🚚",
                  title: "Free Shipping Threshold",
                  desc: "Orders over ₦50,000 ship free. No membership fees, no minimum cart tricks.",
                },
                {
                  icon: "🔄",
                  title: "30-Day Easy Returns",
                  desc: "Not right? Send it back. Free return shipping, no questions asked, full refund.",
                },
                {
                  icon: "🔒",
                  title: "Secure Checkout",
                  desc: "Bank-grade encryption. Multiple payment options. Your data never leaves our secure servers.",
                },
                {
                  icon: "⭐",
                  title: "Price Match Guarantee",
                  desc: "Found it cheaper elsewhere? We'll match it. Quality shopping shouldn't cost more.",
                },
                {
                  icon: "🎁",
                  title: "Loyalty Rewards",
                  desc: "Earn points on every purchase. Redeem for discounts, exclusive access, and perks.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="card-premium p-6 group-hover:border-border-strong transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FeatureIcon
                    icon={feature.icon}
                    className="mb-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="font-display text-xl font-bold text-structural mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-structural/60 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION: Arrives Exactly As Promised ===== */}
      <section className="section-premium bg-background-elevated relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ParallaxBlob
            className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "20s" }}
            delay={0}
          />
          <ParallaxBlob
            className="absolute bottom-1/4 right-10 w-72 h-72 bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "22s" }}
            delay={1}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-amber/20 border border-border text-sm font-medium text-structural mb-4">
                Reliable Delivery
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-structural mb-4">
                The Izzy way means <br />
                <span className="text-gradient-amber">
                  it arrives exactly as promised
                </span>
              </h2>
              <p className="text-lg text-structural/60 max-w-2xl mx-auto">
                From warehouse to your doorstep — tracked, protected, and on
                time. Every single order.
              </p>
            </div>
          </ScrollReveal>

          {/* Stats Row */}
          <ScrollReveal delay={200} direction="up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {STATS.map((stat, index) => (
                <CountUp
                  key={stat.label}
                  endValue={stat.endValue}
                  suffix={stat.suffix}
                  delay={index * 200}
                />
              ))}
            </div>
          </ScrollReveal>

          {/* Trust indicators */}
          <ScrollReveal delay={600} direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
                      <path d="M10 2v2M14 2v2M7 7h10" />
                    </svg>
                  ),
                  title: "Fast & Tracked Shipping",
                  desc: "Real-time tracking on every order. SMS & email updates from dispatch to delivery.",
                },
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  ),
                  title: "Protected Packaging",
                  desc: "Custom-fit boxes, bubble wrap, and tamper-evident seals. Your items arrive pristine.",
                },
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: "Delivery Guarantee",
                  desc: "Late delivery? We refund the shipping. Damaged? Instant replacement, no hassle.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="card-premium p-6 group-hover:border-border-strong transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <TrustIcon className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </TrustIcon>
                  <h3 className="font-display text-xl font-bold text-structural mb-2">
                    {item.title}
                  </h3>
                  <p className="text-structural/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION: Social Proof / Reviews ===== */}
      <section className="section-premium bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ParallaxBlob
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-amber/10 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "25s" }}
            delay={0}
          />
          <ParallaxBlob
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "28s" }}
            delay={1}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-amber/20 border border-border text-sm font-medium text-structural mb-4">
                Loved by Shoppers
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-structural mb-4">
                Don&apos;t just take our word
                <br />
                <span className="text-gradient-amber">for it.</span>
              </h2>
              <p className="text-lg text-structural/60 max-w-2xl mx-auto">
                Real stories from real customers who shop the Izzy way.
              </p>
            </div>
          </ScrollReveal>

          {/* Testimonials carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "The quality is genuinely impressive. I ordered a blazer and the fabric, stitching, and fit were exactly as described. Finally, a store that doesn't use misleading photos.",
                  author: "Adebayo K.",
                  location: "Lagos",
                  rating: 5,
                  product: "Linen-Blend Tailored Blazer",
                },
                {
                  quote:
                    "Free shipping over ₦50K is a game changer. I furnished my entire apartment and saved thousands on delivery. The price match guarantee gave me total confidence.",
                  author: "Chioma N.",
                  location: "Abuja",
                  rating: 5,
                  product: "Home Essentials Bundle",
                },
                {
                  quote:
                    "My mechanical keyboard arrived in perfect condition with custom packaging. The tracking was accurate down to the hour. This is how e-commerce should work everywhere.",
                  author: "Tunde M.",
                  location: "Port Harcourt",
                  rating: 5,
                  product: "Mechanical Keyboard",
                },
              ].map((testimonial, index) => (
                <ScrollReveal key={index} delay={index * 150} direction="up">
                  <div className="card-premium p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                    <div
                      className="flex items-center gap-1 mb-4"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= testimonial.rating
                              ? "text-amber-500"
                              : "text-border"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <blockquote className="text-structural/70 text-base leading-relaxed mb-6 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="border-t border-border pt-4">
                      <p className="font-medium text-structural">
                        {testimonial.author}
                      </p>
                      <p className="text-structural/50 text-sm">
                        {testimonial.location}
                      </p>
                      <p className="text-gradient-amber text-xs mt-1 font-medium">
                        {testimonial.product}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLOSING CTA SECTION ===== */}
      <section className="section-premium relative overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <ParallaxBlob
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-amber/10 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "30s" }}
            delay={0}
          />
          <ParallaxBlob
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-amber/5 rounded-full blur-3xl animate-float"
            style={{ animationDuration: "32s" }}
            delay={1}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center">
              <div className="card-premium bg-gradient-amber p-10 sm:p-16 lg:p-20 mx-auto max-w-4xl relative overflow-hidden">
                {/* Decorative elements */}
                <ParallaxBlob
                  className="absolute top-0 right-0 w-72 h-72 bg-background/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 animate-float"
                  style={{ animationDuration: "15s" }}
                  delay={0}
                />
                <ParallaxBlob
                  className="absolute bottom-0 left-0 w-96 h-96 bg-background/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-float"
                  style={{ animationDuration: "18s" }}
                  delay={1}
                />

                <div className="relative z-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-background/20 backdrop-blur-sm border border-background/30 text-sm font-medium text-background mb-6">
                    Ready to experience it?
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight text-balance">
                    Stop scrolling. <br />
                    Start shopping —{" "}
                    <span className="text-gradient-amber">the Izzy way.</span>
                  </h2>
                  <p className="text-background/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    Join thousands of shoppers who&apos;ve discovered a better
                    way to buy. Quality, value, and reliability — all in one
                    place.
                  </p>
                  <ShimmerCTA to="/signup" className="text-xl px-12 py-6">
                    Start Shopping Now
                  </ShimmerCTA>
                  <p className="mt-6 text-background/60 text-sm">
                    No account needed to browse • Free shipping over ₦50K •
                    30-day returns
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="bg-structural py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-background/60 text-sm mb-4">
            Ready to shop smarter?
          </p>
          <ShimmerCTA to="/signup" className="inline-block">
            Shop the Izzy Way
          </ShimmerCTA>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
