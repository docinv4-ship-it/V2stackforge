"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  alignment?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  alignment = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn("mb-12", alignment === "center" && "text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {label && (
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-[#9333ea] bg-[#9333ea]/10 rounded-full">
          {label}
        </span>
      )}
      {/* FIX: text-white ko text-zinc-900 kiya taake background par dikhe */}
      <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
