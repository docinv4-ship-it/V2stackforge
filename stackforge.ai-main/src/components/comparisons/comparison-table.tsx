"use client";

import { motion } from "framer-motion";
import type { Comparison, Tool } from "@/lib/types";

interface ComparisonTableProps {
  comparison: Comparison;
  tools: Tool[];
  tableId?: string;
}

function getOrderedTools(comparison: Comparison, tools: Tool[]): Tool[] {
  return comparison.tools
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => Boolean(tool));
}

function getCellValue(row: Comparison["tableData"][number], tool: Tool): string {
  return (
    row.values[tool.name] ??
    row.values[tool.slug] ??
    Object.values(row.values)[0] ??
    "—"
  );
}

export function ComparisonTable({
  comparison,
  tools,
  tableId = "comparison-table",
}: ComparisonTableProps) {
  const orderedTools = getOrderedTools(comparison, tools);
  const leftTool = orderedTools[0];
  const rightTool = orderedTools[1];

  return (
    <motion.div
      id={tableId}
      className="mb-16 overflow-hidden rounded-3xl bg-zinc-900"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="border-b border-white/10 p-8">
        <h2 className="text-center text-3xl font-bold">Feature-by-Feature Comparison</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-6 text-left font-medium text-gray-400">Feature</th>
              <th className="p-6 text-center font-semibold text-violet-400">
                {leftTool?.name ?? "Tool A"}
              </th>
              <th className="p-6 text-center font-medium">
                {rightTool?.name ?? "Tool B"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {comparison.tableData.map((row, rowIndex) => (
              <tr key={`${row.feature}-${rowIndex}`}>
                <td className="p-6 font-medium text-white">{row.feature}</td>
                <td className="p-6 text-center text-gray-300">
                  {leftTool ? getCellValue(row, leftTool) : "—"}
                </td>
                <td className="p-6 text-center text-gray-300">
                  {rightTool ? getCellValue(row, rightTool) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
