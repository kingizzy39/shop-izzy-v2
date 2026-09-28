import React, { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
}

interface CountUpStatsProps {
  stats: StatItem[];
  className?: string;
}

const CountUpStats: React.FC<CountUpStatsProps> = ({
  stats,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    stats.map(() => 0),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  // IntersectionObserver for scroll-triggered animation
  useEffect(() => {
    if (prefersReducedMotion.current) {
      setIsVisible(true);
      setAnimatedValues(stats.map((s) => s.value));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Count-up animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(stats.map((stat) => Math.floor(stat.value * eased)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedValues(stats.map((s) => s.value));
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, stats]);

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card-premium p-6 text-center animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {stat.icon && (
            <div className="flex justify-center mb-4 text-gradient-amber">
              {stat.icon}
            </div>
          )}
          <div className="font-display text-4xl lg:text-5xl font-bold text-structural mb-2">
            {stat.prefix || ""}
            {animatedValues[index].toLocaleString()}
            {stat.suffix || ""}
          </div>
          <div className="text-structural/60 text-sm font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountUpStats;
