import React, { memo, useState, useCallback } from "react";
import { createImageWithFallback } from "../utils/format";

interface ImageWithFallbackProps {
  product: { id: string; keyword: string; lock: number; cat: string };
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

const ImageWithFallback = memo(({ product, alt, className = "", width = 400, height = 400, loading = "lazy", priority = false }: ImageWithFallbackProps) => {
  const { src, fallbackSrc } = createImageWithFallback(product, width, height);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = useCallback(() => {
    if (!hasErrored) {
      setHasErrored(true);
      setCurrentSrc(fallbackSrc);
    }
  }, [fallbackSrc, hasErrored]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={handleError}
      {...(priority && { fetchPriority: "high" })}
    />
  );
});

export default ImageWithFallback;
