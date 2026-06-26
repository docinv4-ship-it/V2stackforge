"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { Comparison, Tool } from "@/lib/types";

interface ComparisonProsConsProps {
  comparison: Comparison;
  tools: Tool[];
}

function getOrderedTools(comparison: Comparison, tools: Tool[]): Tool[] {
  return comparison.tools
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => Boolean(tool));
}

export function ComparisonProsCons({ comparison, tools }: ComparisonProsConsProps) {
  const orderedTools = getOrderedTools(comparison, tools);

  return (
    <div className="grid gap-10 mb-20 md:grid-cols-2">
      {orderedTools.map((tool, index) => {
        const strengths = (comparison.strengths[tool.name] ?? []).slice(0, 3);
        const limitations = (comparison.limitations[tool.name] ?? []).slice(0, 3);

        return (
          <motion.div
            key={tool.id}
            className="rounded-3xl border border-white/10 bg-zinc-900 p-8 card-hover"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                {tool.logo ? (
                  <img
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    className="h-10 w-10 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">{tool.name.slice(0, 1)}</span>
                )}
              </span>
              <span>{tool.name}</span>
            </h3>

            <div className="space-y-8">
              <div>
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Strengths
                </h4>
                <ul className="space-y-4">
                  {strengths.map((strength, strengthIndex) => (
                    <li
                      key={`${tool.slug}-strength-${strengthIndex}`}
                      className="flex gap-3 text-zinc-300"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  Limitations
                </h4>
                <ul className="space-y-4">
                  {limitations.map((limitation, limitationIndex) => (
                    <li
                      key={`${tool.slug}-limitation-${limitationIndex}`}
                      className="flex gap-3 text-zinc-300"
                    >
                      <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
