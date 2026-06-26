"use client";

import React from "react";
import { ToolWithOptionalFields } from "../content";

interface ToolSidebarProps {
  safeTool: ToolWithOptionalFields;
  primaryCategory: string;
  startingPrice: string;
  freePlan: boolean;
  featuresCount: number;
}

export function ToolSidebar({
  safeTool,
  primaryCategory,
  startingPrice,
  freePlan,
  featuresCount,
}: ToolSidebarProps) {
  return (
    <aside className="w-full">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        {/* Core Profile Header */}
        <div className="mb-5 flex items-center gap-4 border-b border-zinc-100 pb-5">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
            {safeTool.logo ? (
              <img
                src={safeTool.logo}
                alt={`${safeTool.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-zinc-900 font-mono">
                {safeTool.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold tracking-tight text-zinc-900 [font-family:var(--font-inter)]">
              {safeTool.name}
            </h3>
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 truncate mt-0.5">
              {primaryCategory}
            </p>
          </div>
        </div>

        {/* Structured Parameter Matrix Lines */}
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
            <span className="text-zinc-500 font-medium">Starting Tier</span>
            <span className="font-semibold text-zinc-900 font-mono">{startingPrice}</span>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
            <span className="text-zinc-500 font-medium">Free Tier</span>
            <span className={`font-semibold font-mono ${freePlan ? "text-emerald-600" : "text-zinc-500"}`}>
              {freePlan ? "Available" : "Restricted"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-zinc-500 font-medium">Verified Features</span>
            <span className="font-semibold text-zinc-900 font-mono">{featuresCount}+ Modules</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
