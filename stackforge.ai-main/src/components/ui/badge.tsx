"use client";

import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-[#1a1b23] text-white",
    primary: "gradient-bg text-white",
    outline: "border border-[#9333ea] text-[#9333ea]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
