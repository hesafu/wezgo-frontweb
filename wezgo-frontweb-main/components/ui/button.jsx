import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Button Component
 * Supports glassmorphism variants and premium gradients
 */
const Button = React.forwardRef(({ className, variant = "cta", size = "default", ...props }, ref) => {
  const variants = {
    cta: "btn-cta",
    outline: "btn-ghost", // Reusing ghost for consistent outline feel
    ghost: "hover:bg-white/5 text-text-muted hover:text-text-main",
    glass: "glass-badge hover:bg-white/10 transition-all cursor-pointer",
  };

  const sizes = {
    default: "h-11 px-6 rounded-xl",
    sm: "h-9 px-4 rounded-lg text-sm",
    lg: "h-14 px-10 rounded-2xl text-lg",
    icon: "h-11 w-11 rounded-xl flex items-center justify-center",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
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
