import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Button Component — wezgo
 * Manual §3: 8px radius (rounded-lg).
 * Manual §2: Plus Jakarta Sans 600 (type-label) for labels.
 * Manual §1: brand-coral for primary action, glass styles for secondary.
 */
const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const variants = {
    primary: "bg-brand-coral hover:bg-brand-coral/90 text-white border-0 shadow-none",
    outline: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    ghost: "hover:bg-white/5 text-brand-mgray hover:text-white",
    glass: "glass-card hover:bg-white/10 text-white transition-all",
  };

  const sizes = {
    /* Manual §3: All buttons rounded-lg (8px) */
    default: "h-11 px-6 rounded-lg type-label uppercase",
    sm: "h-9 px-4 rounded-lg type-label uppercase text-[10px]",
    lg: "h-14 px-10 rounded-lg type-label uppercase text-sm",
    icon: "h-11 w-11 rounded-lg flex items-center justify-center",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
