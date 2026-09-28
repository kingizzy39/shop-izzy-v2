import React from "react";

interface MarqueeProps {
  text?: string;
  className?: string;
  speed?: number; // pixels per second
  direction?: "left" | "right";
  gap?: number; // gap between repeated text in px
}

const Marquee: React.FC<MarqueeProps> = ({
  text = "Shopping the Izzy way",
  className = "",
  speed = 50,
  direction = "left",
  gap = 100,
}) => {
  const [textWidth, setTextWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  // Respect prefers-reduced-motion
  const prefersReducedMotion = React.useRef(false);
  React.useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  React.useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, []);

  if (prefersReducedMotion.current) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="flex items-center gap-8 whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="text-gradient-amber font-medium">
              {text}
            </span>
          ))}
        </div>
      </div>
    );
  }

  React.useEffect(() => {
    if (!containerRef.current || !textWidth) return;

    const containerWidth = containerRef.current.offsetWidth;
    const totalWidth = textWidth + gap;
    const repeats = Math.ceil(containerWidth / totalWidth) + 2;

    // The animation duration is based on how long it takes for the text
    // to travel its own width plus gap at the given speed
    const duration = (totalWidth / speed) * 1000; // in ms

    const style = document.createElement("style");
    style.textContent = `
      @keyframes marquee-${direction} {
        from { transform: translateX(${direction === "left" ? "0" : `-${totalWidth}px`}); }
        to { transform: translateX(${direction === "left" ? `-${totalWidth}px` : "0"}); }
      }
    `;
    document.head.appendChild(style);

    const textElements = containerRef.current.querySelectorAll(".marquee-text");
    textElements.forEach((el, i) => {
      (el as HTMLElement).style.animation =
        `marquee-${direction} ${duration}ms linear infinite`;
      (el as HTMLElement).style.animationDelay =
        `${(-i * duration) / repeats}ms`;
    });

    return () => {
      document.head.removeChild(style);
    };
  }, [textWidth, speed, direction, gap]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="flex whitespace-nowrap will-change-transform">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            ref={i === 0 ? textRef : undefined}
            className="marquee-text flex-shrink-0 px-[50px] text-gradient-amber font-medium whitespace-nowrap"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
