import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared Input Component
 * Implements high-contrast glass focus states
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "glass-input w-full h-12 px-4 rounded-xl text-sm transition-all focus:outline-none placeholder:text-text-muted/50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
