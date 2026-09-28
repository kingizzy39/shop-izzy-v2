import React from "react";

interface FloatingElementsProps {
  className?: string;
  count?: number;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  className = "",
  count = 3,
}) => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = React.useRef(false);
  React.useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  if (prefersReducedMotion.current) {
    return null;
  }

  const elements = Array.from({ length: count }, (_, i) => {
    const delay = i * 1.5;
    const duration = 4 + i * 0.5;
    const size = 20 + i * 15;
    const left = 10 + i * 25;
    const top = 20 + i * 15;

    return (
      <div
        key={i}
        className="absolute rounded-full bg-gradient-amber/20 blur-xl pointer-events-none animate-float"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {elements}
    </div>
  );
};

export default FloatingElements;
