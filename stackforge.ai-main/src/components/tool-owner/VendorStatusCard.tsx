"use client";

import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import type { Tool } from "@/lib/types";
import { ClaimButton } from "./ClaimButton";

type VendorStatusCardProps = {
  tool: Tool;
};

export function VendorStatusCard({ tool }: VendorStatusCardProps) {
  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
            <Building2 className="h-3.5 w-3.5 text-zinc-500" />
            Vendor Status
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            Own this profile for {tool.name}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Claim the official profile, verify your company domain, and unlock the managed vendor flow without touching the public review experience.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verify
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                Company email and domain match
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Approve
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                Admin review before vendor access
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                Manage
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                Open the owner workspace later
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <ClaimButton
            toolSlug={tool.slug}
            toolId={tool.id}
            toolName={tool.name}
            website={tool.website}
          />

          <Link
            href="/company/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
          >
            Open company dashboard
          </Link>
        </div>
      </div>
    </aside>
  );
}
