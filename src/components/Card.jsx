import React from "react";

const Card = ({
  className = "",
  children,
  hover = false,
  elevated = false,
  ...props
}) => {
  const baseClasses = "card-premium";
  const hoverClasses = hover ? "card-premium-hover" : "";
  const elevatedClasses = elevated ? "shadow-lg" : "shadow-sm";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${elevatedClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
