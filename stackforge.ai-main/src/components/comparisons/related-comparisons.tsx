"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Trophy } from "lucide-react";
import type { Comparison, Tool } from "@/lib/types";
import { tools as globalTools } from "@/lib/data/tools";
import {
  getPopularComparisons,
  getRelatedComparisons,
  searchByTool,
} from "@/lib/comparisons/search";

interface RelatedComparisonsProps {
  comparison: Comparison;
  tools?: Tool[];
  limit?: number;
  title?: string;
  description?: string;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function uniqueBySlug(items: Comparison[]): Comparison[] {
  const seen = new Set<string>();
  const result: Comparison[] = [];

  for (const item of items) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    result.push(item);
  }

  return result;
}

export function RelatedComparisons({
  comparison,
  tools = globalTools,
  limit = 6,
  title = "Related comparisons",
  description = "See the most relevant alternatives, same-tool matchups, and category peers.",
}: RelatedComparisonsProps) {
  const currentSlug = comparison.slug;
  const currentTools = comparison.tools.map(normalize);
  const currentCategory = normalize(comparison.category ?? "");

  const related = getRelatedComparisons(currentSlug, {
    limit: limit * 2,
    includeSameToolComparisons: true,
    includeSameCategoryComparisons: true,
  });

  const toolMatches = uniqueBySlug(
    comparison.tools.flatMap((toolSlug) => searchByTool(toolSlug, { limit: 4 }))
  ).filter((item) => item.slug !== currentSlug);

  const popularMatches = getPopularComparisons(limit * 2).filter(
    (item) => item.slug !== currentSlug
  );

  const categoryMatches = uniqueBySlug(
    [...related, ...toolMatches, ...popularMatches].filter((item) => {
      const itemCategory = normalize(item.category ?? "");
      return currentCategory ? itemCategory === currentCategory : true;
    })
  ).filter((item) => item.slug !== currentSlug);

  const combined = uniqueBySlug([
    ...related,
    ...toolMatches,
    ...categoryMatches,
    ...popularMatches,
  ]).filter((item) => {
    if (item.slug === currentSlug) return false;

    const itemTools = item.tools.map(normalize);
    const sameAsCurrent =
      itemTools.length === currentTools.length &&
      itemTools.every((tool) => currentTools.includes(tool)) &&
      currentTools.every((tool) => itemTools.includes(tool));

    return !sameAsCurrent;
  });

  const items = combined.slice(0, limit);

  return (
    <section className="border-t border-zinc-900 bg-black py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300">
            <Sparkles className="h-4 w-4" />
            Head-to-head analysis
          </div>
          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl tracking-tight">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-zinc-400 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Dynamic Cards Grid */}
        {items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => {
              
              // Mapping tools safely to fetch logos and ratings
              const matchedTools = item.tools.map(slug => 
                tools.find(t => normalize(t.slug || t.id || t.name) === normalize(slug))
              ).filter(Boolean) as Tool[];

              const toolA = matchedTools[0] || { name: titleCase(item.tools[0] || "Tool A"), rating: 4.6 };
              const toolB = matchedTools[1] || { name: titleCase(item.tools[1] || "Tool B"), rating: 4.4 };

              // Ratings formatting
              const ratingA = typeof toolA.rating === "number" ? toolA.rating.toFixed(1) : "4.6";
              const ratingB = typeof toolB.rating === "number" ? toolB.rating.toFixed(1) : "4.4";

              // Score calculation logic from HTML template (Rating * 20)
              const scoreA = toolA.rating ? Math.round(toolA.rating * 20) : 92;
              const scoreB = toolB.rating ? Math.round(toolB.rating * 20) : 88;

              // Winner tag parsing
              const isToolAWinner = item.verdict !== "depends" && item.verdict === item.tools[0];
              const winnerName = isToolAWinner ? toolA.name : toolB.name;

              return (
                <motion.article
                  key={item.slug}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="w-full bg-[#0d0d12] border border-zinc-800/80 rounded-2xl p-5 shadow-xl hover:shadow-[0_10px_30px_rgba(139,92,246,0.06)] hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <Link href={`/compare/${item.slug}`} className="block h-full">
                    
                    {/* Card Meta Row */}
                    <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500 mb-4 pb-3 border-b border-zinc-900">
                      <span className="text-violet-400 font-bold tracking-wider uppercase">
                        {item.category || "COMPARISON"}
                      </span>
                      <span className="font-mono text-zinc-600 font-bold">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Side-by-Side Comparison Layout (Exact Cloned Look) */}
                    <div className="flex items-center gap-2 mb-4">
                      
                      {/* Tool A */}
                      <div className="flex-1 text-center min-w-0">
                        <div className="w-14 h-14 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-2 overflow-hidden shadow-inner">
                          {toolA.logo ? (
                            <img src={toolA.logo} alt={toolA.name} className="h-full w-full object-cover" />
                          ) : (
                            <span>{toolA.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="text-xs font-black text-white truncate px-1">{toolA.name}</div>
                        <div className="text-3xl font-black text-violet-400 font-mono tracking-tighter my-0.5">
                          {scoreA}
                        </div>
                        <div className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-zinc-500">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>({ratingA})</span>
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="text-[10px] font-mono font-black text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-full whitespace-nowrap">
                        VS
                      </div>

                      {/* Tool B */}
                      <div className="flex-1 text-center min-w-0">
                        <div className="w-14 h-14 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-2 overflow-hidden shadow-inner">
                          {toolB.logo ? (
                            <img src={toolB.logo} alt={toolB.name} className="h-full w-full object-cover" />
                          ) : (
                            <span>{toolB.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="text-xs font-black text-white truncate px-1">{toolB.name}</div>
                        <div className="text-3xl font-black text-zinc-400 font-mono tracking-tighter my-0.5">
                          {scoreB}
                        </div>
                        <div className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-zinc-600">
                          <Star className="w-2.5 h-2.5 fill-zinc-700 text-zinc-700" />
                          <span>({ratingB})</span>
                        </div>
                      </div>

                    </div>

                    {/* Clean Winner Strip */}
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-2.5 my-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-2 shadow-sm">
                      <Trophy className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">
                        <strong className="text-white font-bold">Winner:</strong> {item.verdict === "depends" ? "Custom Choice" : winnerName}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="w-full text-center py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-200 mt-4 shadow-md">
                      View Comparison <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                  </Link>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-800 bg-[#0d0d12] p-8 text-center text-zinc-500 text-sm font-medium">
            No related comparisons found yet.
          </div>
        )}
      </div>
    </section>
  );
}
