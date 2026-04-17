import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Input Component — wezgo
 * Manual §3: 8px radius (rounded-lg).
 * Manual §2: Plus Jakarta Sans 400 (type-body-m) for text.
 * Manual §1: brand-mgray for placeholder, brand-coral for focus.
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full h-11 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white transition-all focus:outline-none focus:ring-1 focus:ring-brand-coral/40 focus:border-brand-coral/40 placeholder:text-brand-mgray type-body-m",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
