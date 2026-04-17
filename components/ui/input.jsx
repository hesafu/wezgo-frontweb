import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Input Component - Updated for Wezgo Brand
 * Implements high-contrast glass focus states with brand-coral accents
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full h-12 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body transition-all focus:outline-none focus:ring-2 focus:ring-brand-coral/40 focus:border-brand-coral/40 placeholder:text-slate-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
