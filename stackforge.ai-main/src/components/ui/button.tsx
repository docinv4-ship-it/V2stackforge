"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 focus:ring-offset-zinc-50 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98]";

    const variants = {
      primary: "gradient-bg text-white hover:opacity-90 shadow-lg",
      secondary: "bg-zinc-900 text-white hover:bg-zinc-800",
      outline: "border border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900",
      ghost: "hover:bg-zinc-100 bg-transparent text-zinc-900",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-12 px-8 text-lg",
    };

    if (asChild && children) {
      return (
        <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
          {children}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
