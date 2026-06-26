"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { DealItem } from "@/lib/data/deals";

type Props = DealItem & {
  status: "active" | "upcoming";
};

export function DealCard(deal: Props) {
  // Safe image loading node wrapper track rules
  const [imgError, setImgError] = useState(false);

  // Dynamic automatic slug builder targeting your public/logos/ directory
  const logoSlug = deal.tool.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const logoPath = `/logos/${logoSlug}.png`;

  return (
    <div className="group w-full bg-white py-5 px-6 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150 hover:bg-zinc-50/40">
      
      {/* Brand Identity Layer & Metadata Description combined flat */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
        
        {/* Short Text Name Node along with Unified Premium Logo Engine */}
        <div className="min-w-[190px] flex-shrink-0 flex items-center gap-3">
          
          {/* Strict Premium Monochromatic Logo Square Framework */}
          <div className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
            {!imgError ? (
              <Image
                src={logoPath}
                alt={`${deal.tool} Asset Logo`}
                width={24}
                height={24}
                className="h-6 w-6 object-contain filter group-hover:scale-[1.03] transition-transform duration-200"
                onError={() => setImgError(true)}
              />
            ) : (
              /* High-Contrast Luxury Abstract Placeholder Node fallback */
              <div className="h-full w-full bg-zinc-950 flex items-center justify-center text-[11px] font-black text-white font-mono uppercase">
                {deal.tool.substring(0, 2)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold text-zinc-900 block truncate tracking-tight">
              {deal.tool}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mt-0.5">
              System Node
            </span>
          </div>
        </div>

        {/* Dynamic Descriptive Flow (Acquisition Report Style) */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-500 truncate max-w-xl">
            <span className="text-zinc-950 font-bold mr-2">{deal.title}</span> 
            — {deal.summary || "Verified deployment path with active strategic allocation assets mapped to network."}
          </p>
        </div>
      </div>

      {/* Financial Metric & Direct CTA Terminal */}
      <div className="flex items-center justify-between md:justify-end gap-6 border-t border-zinc-100 pt-3 md:border-t-0 md:pt-0 whitespace-nowrap">
        
        {/* Hidden Conversion Element (Social Proof Rail / Dynamic Rating) */}
        <div className="text-[11px] font-medium text-zinc-400">
          <span>Active Allocation</span>
        </div>

        {/* High Contrast Numeric Savings Column */}
        <div className="text-right min-w-[70px]">
          <span className="text-sm font-black text-zinc-900 block">
            {deal.discount || "40%"}
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400 block -mt-0.5">
            Savings
          </span>
        </div>

        {/* Ultra Premium Monochromatic Action Triggers */}
        <div className="flex items-center gap-4">
          <Link
            href={`/deals/${deal.slug}`}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Analysis
          </Link>

          <a
            href={deal.promoUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-950 px-4 text-xs font-bold text-white transition-all duration-150 hover:bg-black hover:scale-[1.02] shadow-sm"
          >
            Unlock Access →
          </a>
        </div>

      </div>
    </div>
  );
}
