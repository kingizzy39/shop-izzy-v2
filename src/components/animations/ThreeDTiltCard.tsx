import React, { useState, useRef, useEffect, MouseEvent } from "react";
import ImageWithFallback from "../ImageWithFallback";
import { Product } from "../../data";

interface ThreeDTiltCardProps {
  product: Product;
  className?: string;
  onClick?: () => void;
}

const ThreeDTiltCard: React.FC<ThreeDTiltCardProps> = ({
  product,
  className = "",
  onClick,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation (max 15 degrees)
    const maxRotate = 15;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotate;
    const rotateXValue = -(mouseY / (rect.height / 2)) * maxRotate;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Respect prefers-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  if (prefersReducedMotion.current) {
    return (
      <div
        ref={cardRef}
        className={`card-premium group overflow-hidden transition-all duration-300 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      >
        <div className="relative aspect-square overflow-hidden">
          <ImageWithFallback
            product={{
              id: product.id,
              keyword: product.keyword,
              lock: product.lock,
              cat: product.cat,
            }}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-gradient-amber uppercase tracking-wide mb-1">
            {product.cat}
          </p>
          <h3 className="font-display text-lg font-bold text-structural mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="font-semibold text-structural">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`card-premium group overflow-hidden transition-all duration-300 perspective-1000 ${className}`}
      style={{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.1s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ transform: "translateZ(20px)" }}
      >
        <ImageWithFallback
          product={{
            id: product.id,
            keyword: product.keyword,
            lock: product.lock,
            cat: product.cat,
          }}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: "translateZ(10px)" }}
        />
      </div>
      <div className="p-4" style={{ transform: "translateZ(30px)" }}>
        <p className="text-xs font-medium text-gradient-amber uppercase tracking-wide mb-1">
          {product.cat}
        </p>
        <h3 className="font-display text-lg font-bold text-structural mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="font-semibold text-structural">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(product.price)}
        </p>
      </div>
      <div
        className="absolute inset-0 bg-gradient-amber opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          transform: "translateZ(-10px)",
          opacity: isHovering ? 0.05 : 0,
        }}
      />
    </div>
  );
};

export default ThreeDTiltCard;
