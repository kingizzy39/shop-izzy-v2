import React from "react";
import Button from "./Button";

interface ResetFiltersProps {
  onReset: () => void;
  variant?: "outline" | "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
}

const ResetFilters = ({
  onReset,
  variant = "outline",
  className = "",
  children = "Reset Filters",
}: ResetFiltersProps) => {
  return (
    <Button onClick={onReset} variant={variant} className={className}>
      {children}
    </Button>
  );
};

export default ResetFilters;
