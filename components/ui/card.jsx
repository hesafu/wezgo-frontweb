import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Card Component — wezgo
 * Manual §3: 12-16px radius (rounded-xl).
 * Manual §2: Type scale applied via type-* classes.
 */
export const Card = ({ children, className, hover = true }) => {
  return (
    <div className={cn(
      "glass-card p-6 rounded-xl transition-all duration-300",
      hover && "hover:border-white/20 hover:bg-white/10",
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, gradientTitle = false }) => {
  return (
    <div className="space-y-2">
      <h3 className={cn(
        "type-h2",
        gradientTitle ? "gradient-text-coral" : "text-white text-center"
      )}>
        {title}
      </h3>
      {subtitle && (
        <p className="type-body-m text-brand-mgray text-center leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
