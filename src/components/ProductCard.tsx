import React, { memo } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { formatPrice } from "../utils/format";
import ImageWithFallback from "./ImageWithFallback";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    desc: string;
    price: number;
    was?: number | null;
    img?: string;
    keyword: string;
    lock: number;
    cat: string;
    rating?: number;
    reviews?: number;
    bio?: string;
  };
  showRating?: boolean;
  showSellerInfo?: boolean;
  className?: string;
}

const ProductCard = memo(
  ({
    product,
    showRating = false,
    showSellerInfo = false,
    className = "",
  }: ProductCardProps) => {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group block"
        aria-label={`View ${product.name}`}
      >
        <Card
          className={`h-full flex flex-col card-premium-hover ${className}`}
        >
          <div className="relative aspect-square overflow-hidden rounded-t-xl">
            <ImageWithFallback
              product={{
                id: product.id,
                keyword: product.keyword,
                lock: product.lock,
                cat: product.cat,
                img: product.img,
              }}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {product.was !== null &&
              product.was &&
              product.was > product.price && (
                <span className="absolute top-3 left-3 btn-secondary text-xs px-2 py-1">
                  -
                  {Math.round(
                    ((product.was - product.price) / product.was) * 100,
                  )}
                  %
                </span>
              )}
          </div>
          <div className="flex-1 p-4 space-y-3">
            {showSellerInfo && product.bio && (
              <div className="flex items-center gap-2 text-xs text-structural/60">
                <svg
                  className="h-3.5 w-3.5 text-gradient-amber"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a2 2 0 0 0-2 2v1a4 4 0 0 0 .592 3.624l1 2a2 2 0 0 0 2.156 0l1-2a4 4 0 0 0 .592-3.624V4a2 2 0 0 0-2-2z" />
                  <path d="M12 14a2 2 0 0 1-2-2v1.5a6 6 0 0 0 3.898 5.476l-1.067.31a2 2 0 0 1-1.771 0l-1.067-.31A6 6 0 0 0 14 15.5V14a2 2 0 0 1-2-2z" />
                </svg>
                <span className="font-medium text-structural">
                  By {product.bio.split(" ")[0]}
                </span>
              </div>
            )}
            <h2 className="font-semibold text-structural line-clamp-2 group-hover:text-gradient-amber transition-colors">
              {product.name}
            </h2>
            <p className="text-sm text-structural/60 line-clamp-2">
              {product.desc}
            </p>
            <div className="mt-auto pt-2 border-t border-border">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-bold text-lg text-structural">
                  {formatPrice(product.price)}
                </span>
                {product.was && product.was > product.price && (
                  <span className="text-structural/50 line-through text-sm">
                    {formatPrice(product.was)}
                  </span>
                )}
              </div>
              {showRating && (product.rating ?? 0) > 0 && (
                <div className="flex items-center gap-2 text-structural/60 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= (product.rating ?? 0)
                          ? "text-amber-500"
                          : "text-border"
                      }
                    >
                      ★
                    </span>
                  ))}
                  {product.reviews && (
                    <span className="ml-1 text-structural/50">
                      ({product.reviews})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  },
);

export default ProductCard;
