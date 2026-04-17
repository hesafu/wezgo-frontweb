import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Button Component - Updated for Wezgo Brand
 * Supports brand-coral main action and glass variants
 */
const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const variants = {
    primary: "bg-brand-coral hover:bg-brand-coral/90 text-white shadow-lg shadow-brand-coral/20 border-0",
    outline: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    ghost: "hover:bg-white/5 text-slate-400 hover:text-white",
    glass: "glass hover:bg-white/10 text-white transition-all",
  };

  const sizes = {
    default: "h-12 px-8 rounded-2xl",
    sm: "h-9 px-4 rounded-xl text-sm",
    lg: "h-16 px-10 rounded-2xl text-xl font-black",
    icon: "h-11 w-11 rounded-xl flex items-center justify-center",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
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
