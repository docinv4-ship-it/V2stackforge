"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Comparison, Tool } from "@/lib/types";

interface ComparisonFinalVerdictProps {
  comparison: Comparison;
  tools: Tool[];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getOrderedTools(comparison: Comparison, tools: Tool[]): Tool[] {
  return comparison.tools
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => Boolean(tool));
}

function getWinnerTool(comparison: Comparison, tools: Tool[]): Tool | undefined {
  const orderedTools = getOrderedTools(comparison, tools);

  if (comparison.verdict !== "depends") {
    const direct = orderedTools.find((tool) => tool.slug === comparison.verdict);
    if (direct) return direct;
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

  return (
    orderedTools.find((tool) => haystack.includes(normalize(tool.name))) ?? orderedTools[0]
  );
}

function summarize(value: string, maxLength = 320): string {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

export function ComparisonFinalVerdict({
  comparison,
  tools,
}: ComparisonFinalVerdictProps) {
  const orderedTools = getOrderedTools(comparison, tools);
  const winnerTool = getWinnerTool(comparison, tools);

  const winnerLabel =
    winnerTool?.name ??
    orderedTools[0]?.name ??
    comparison.tools[0] ??
    "Top Choice";

  return (
    <motion.section
      className="mb-16 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900/30 to-black p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="mb-4 text-4xl font-bold">Our Final Recommendation</h2>

      <p className="mb-8 text-2xl text-violet-300">
        Choose <span className="font-bold text-white">{winnerLabel}</span>{" "}
        {comparison.verdict === "depends" ? "for the strongest fit across different needs." : "if you want maximum productivity with this workflow."}
      </p>

      <p className="mx-auto max-w-2xl text-gray-400">
        {summarize(comparison.recommendation)}
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {orderedTools.map((tool) => {
          const isWinner = tool.slug === winnerTool?.slug;

          return (
            <a
              key={tool.id}
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "rounded-2xl px-10 py-4 font-semibold transition",
                isWinner
                  ? "bg-white text-black hover:bg-gray-100"
                  : "border border-white/40 hover:bg-white/5",
              ].join(" ")}
            >
              {isWinner ? `Start with ${tool.name} Free` : `Continue with ${tool.name}`}
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </a>
          );
        })}
      </div>
    </motion.section>
  );
}
