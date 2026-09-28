import React from "react";

interface ShimmerCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  size?: "lg" | "xl" | "xxl";
  disabled?: boolean;
}

const ShimmerCTA: React.FC<ShimmerCTAProps> = ({
  children,
  onClick,
  className = "",
  href,
  size = "xl",
  disabled = false,
}) => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = React.useRef(false);
  React.useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const sizeClasses = {
    lg: "px-10 py-5 text-lg",
    xl: "px-14 py-6 text-xl",
    xxl: "px-16 py-7 text-2xl",
  };

  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-3
        font-display font-bold
        text-structural
        bg-gradient-amber
        rounded-2xl
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
      role={href ? undefined : "button"}
      aria-disabled={disabled}
    >
      {/* Shimmer effect */}
      {!prefersReducedMotion.current && (
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      {/* Hover glow */}
      <span
        className="absolute inset-0 bg-gradient-amber opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />
    </Component>
  );
};

export default ShimmerCTA;
