"use client";

import { motion } from "framer-motion";
import { Star, Trophy, ArrowRight } from "lucide-react";
import type { Comparison, Tool } from "@/lib/types";

interface ComparisonVerdictCardsProps {
  comparison: Comparison;
  tools: Tool[];
}

// Helpers
function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getOrderedTools(comparison: Comparison, tools: Tool[]): Tool[] {
  return comparison.tools
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => Boolean(tool));
}

function getWinnerSlug(comparison: Comparison, tools: Tool[]): string {
  if (comparison.verdict !== "depends" && comparison.tools.includes(comparison.verdict)) {
    return comparison.verdict;
  }

  const haystack = normalize(
    [
      comparison.title,
      comparison.description,
      comparison.verdictSummary,
      comparison.recommendation,
      ...(comparison.aliases ?? []),
      ...(comparison.keywords ?? []),
    ].join(" ")
  );

  const matched = tools.find((tool) => haystack.includes(normalize(tool.name)));
  return matched?.slug ?? comparison.tools[0] ?? tools[0]?.slug ?? "";
}

export function ComparisonVerdictCards({
  comparison,
  tools,
}: ComparisonVerdictCardsProps) {
  const orderedTools = getOrderedTools(comparison, tools);
  const winnerSlug = getWinnerSlug(comparison, orderedTools);

  // Fallback if tools are not properly loaded
  if (orderedTools.length < 2) return null;

  const toolA = orderedTools[0];
  const toolB = orderedTools[1];
  
  const isToolAWinner = toolA.slug === winnerSlug;
  const winner = isToolAWinner ? toolA : toolB;
  
  const toolARating = typeof toolA.rating === "number" ? toolA.rating.toFixed(1) : "4.8";
  const toolBRating = typeof toolB.rating === "number" ? toolB.rating.toFixed(1) : "4.6";

  // Creating a 1-100 score based on rating for the G2 look (e.g., 4.8 * 20 = 96)
  const toolAScore = toolA.rating ? Math.round(toolA.rating * 20) : 96;
  const toolBScore = toolB.rating ? Math.round(toolB.rating * 20) : 92;

  const categoryTag = comparison.category || "SOFTWARE COMPARISON";
  const updateDate = comparison.updatedAt 
    ? new Date(comparison.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : "June 2026";

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] mx-auto bg-[#0d0d12] border border-zinc-800/80 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(139,92,246,0.1)] hover:border-violet-500/30 transition-all duration-300 mb-12"
    >
        
        {/* Meta Header */}
        <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500 mb-5 pb-4 border-b border-zinc-900/80">
            <span className="text-violet-400 font-bold tracking-wider uppercase">{categoryTag}</span>
            <span className="font-mono text-zinc-600 tracking-tight">Updated {updateDate}</span>
        </div>

        {/* Main Comparison Area */}
        <div className="flex items-center gap-3 mb-6">
            
            {/* Tool A */}
            <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-3 overflow-hidden shadow-inner relative">
                    {toolA.logo ? (
                      <img src={toolA.logo} alt={toolA.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{toolA.name.charAt(0)}</span>
                    )}
                    {isToolAWinner && (
                        <div className="absolute inset-0 ring-2 ring-emerald-500/50 rounded-2xl" />
                    )}
                </div>
                <div className="text-sm font-black text-white tracking-tight mb-1 truncate">{toolA.name}</div>
                <div className="text-4xl font-black text-violet-400 font-mono tracking-tighter leading-none mb-1.5">
                    {toolAScore}
                </div>
                <div className="flex items-center justify-center gap-0.5 text-[11px] font-bold text-zinc-400">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>({toolARating})</span>
                </div>
            </div>

            {/* VS Badge */}
            <div className="text-[11px] font-mono font-black text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full whitespace-nowrap shadow-md">
                VS
            </div>

            {/* Tool B */}
            <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-3 overflow-hidden shadow-inner relative">
                    {toolB.logo ? (
                      <img src={toolB.logo} alt={toolB.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{toolB.name.charAt(0)}</span>
                    )}
                    {!isToolAWinner && comparison.verdict !== "depends" && (
                        <div className="absolute inset-0 ring-2 ring-emerald-500/50 rounded-2xl hidden" /> 
                    )}
                </div>
                <div className="text-sm font-black text-white tracking-tight mb-1 truncate">{toolB.name}</div>
                <div className="text-4xl font-black text-zinc-300 font-mono tracking-tighter leading-none mb-1.5">
                    {toolBScore}
                </div>
                <div className="flex items-center justify-center gap-0.5 text-[11px] font-bold text-zinc-500">
                    <Star className="w-3 h-3 fill-amber-500/50 text-amber-500/50" />
                    <span>({toolBRating})</span>
                </div>
            </div>

        </div>

        {/* Winner Dynamic Banner */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 my-5 text-[13px] leading-tight font-medium text-emerald-400/90 flex items-start gap-2.5 shadow-sm">
            <Trophy className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
            <span>
              <strong className="text-emerald-300 font-bold tracking-wide">🏆 WINNER: {winner.name}</strong> 
              <br />
              <span className="text-emerald-500/80 text-xs mt-1 inline-block">
                {comparison.verdictSummary || "Based on superior features and value."}
              </span>
            </span>
        </div>

        {/* CTA Button */}
        <a 
          href={winner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center py-3.5 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-200"
        >
          Try {winner.name} Free <ArrowRight className="w-4 h-4" />
        </a>

    </motion.div>
  );
}
