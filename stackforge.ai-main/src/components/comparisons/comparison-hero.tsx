"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Scale } from "lucide-react";

interface ComparisonHeroProps {
  categoryLabel: string;
  title: string;
  subtitle: string;
  scrollTargetId?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export function ComparisonHero({
  categoryLabel,
  title,
  subtitle,
  scrollTargetId = "comparison-table",
  primaryCtaLabel = "View Full Comparison",
  secondaryCtaLabel = "View Rankings",
  secondaryCtaHref = "/rankings",
}: ComparisonHeroProps) {
  return (
    <section className="hero-bg border-b border-white/10 py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm text-violet-300">
            <Scale className="h-4 w-4" />
            {categoryLabel}
          </div>
        </motion.div>

        <motion.h1
          className="mx-auto max-w-4xl text-5xl font-bold tracking-tighter leading-tight md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
          <br />
          <span className="text-violet-400">Which One Should You Use?</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-xl text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            type="button"
            onClick={() =>
              document.getElementById(scrollTargetId)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-8 py-4 text-lg font-semibold transition hover:bg-violet-500"
          >
            {primaryCtaLabel}
            <ChevronDown className="h-5 w-5" />
          </button>

          <a
            href={secondaryCtaHref}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-8 py-4 text-lg font-semibold transition hover:bg-white/5"
          >
            {secondaryCtaLabel}
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
