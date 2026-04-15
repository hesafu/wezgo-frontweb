import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Card Component
 * Supports interactive glass states and gradient titles
 */
export const Card = ({ children, className, hover = true }) => {
  return (
    <div className={cn(
      "glass p-6 rounded-3xl",
      hover && "glass-card",
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, gradientTitle = false }) => {
  return (
    <div className="mb-6">
      <h3 className={cn(
        "text-2xl font-bold tracking-tight",
        gradientTitle ? "gradient-text" : "text-text-main"
      )}>
        {title}
      </h3>
      {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
    </div>
  );
};
