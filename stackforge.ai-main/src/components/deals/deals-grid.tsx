"use client";

import Image from "next/image";
import { useState } from "react";
import { DealItem } from "@/lib/data/deals";

type Props = {
  deals: (DealItem & { status: "active" | "upcoming" })[];
};

export function DealsGrid({ deals }: Props) {
  // Har image ka error state track karne ke liye object state
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  if (!deals || deals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-transparent py-20 text-center font-mono text-xs text-zinc-400">
        // No public active offers mapped to this network terminal.
      </div>
    );
  }

  const extractDiscountNumber = (discountStr: string) => {
    const match = discountStr.match(/\d+/);
    return match ? match[0] : "40";
  };

  return (
    <section className="w-full space-y-16">
      <div className="border-b border-zinc-200 pb-3">
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400">
          Active Platform Opportunities
        </h2>
      </div>

      {/* LOOP START: Har ek deal ab alag bada card banegi */}
      {deals.map((deal) => {
        const logoSlug = deal.tool
          ? deal.tool.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
          : "";
        const logoPath = `/logos/${logoSlug}.png`;
        const hasError = imgErrors[deal.slug] || false;

        return (
          <article 
            key={deal.slug} 
            className="w-full overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">
              <span>Verified Opportunity</span>
              {deal.status === "active" ? (
                <span className="flex items-center gap-2 tracking-[0.2em] text-zinc-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Allocation
                </span>
              ) : (
                <span className="tracking-[0.2em] text-zinc-400">Staged Pool</span>
              )}
            </div>

            {/* Main Content Body */}
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-col justify-between p-8 lg:w-3/5 lg:p-10">
                <div>
                  {/* Tool Info & Logo */}
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                      {!hasError && logoSlug ? (
                        <Image
                          src={logoPath}
                          alt={`${deal.tool} Brand Logo`}
                          width={36}
                          height={36}
                          className="h-9 w-9 object-contain"
                          onError={() => setImgErrors(prev => ({ ...prev, [deal.slug]: true }))}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-950 font-mono text-xl font-black uppercase text-white">
                          {deal.tool ? deal.tool.substring(0, 2) : "ST"}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
                        {deal.tool}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        Project & Core Software Operations Layer
                      </p>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h4 className="mb-4 text-3xl font-bold tracking-tight text-zinc-950 lg:text-4xl">
                    {deal.title}
                  </h4>

                  <p className="mb-8 text-sm leading-relaxed text-zinc-600">
                    {deal.summary ||
                      "Teams looking to streamline infrastructure and consolidate operational stacks deploy this verified pipeline framework for instant workforce leverage."}
                  </p>

                  {/* Onboarding Bullets */}
                  <div className="mb-8 space-y-3">
                    <div className="flex items-center gap-3 text-zinc-600">
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100">
                        <span className="text-xs font-bold text-zinc-900">✓</span>
                      </div>
                      <span className="text-xs font-medium">
                        Priority system onboarding included
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-zinc-600">
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100">
                        <span className="text-xs font-bold text-zinc-900">✓</span>
                      </div>
                      <span className="text-xs font-medium">
                        No external data migration cost overhead
                      </span>
                    </div>
                  </div>

                  {/* Editorial Signal */}
                  <div className="mt-2 border-t border-zinc-100 pt-6">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                      Editorial Signal
                    </span>
                    <p className="text-xs font-medium text-zinc-900">
                      High adoption velocity observed across scaling startups and remote engineering teams.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side Call-to-Action Panel */}
              <div className="flex flex-col items-center justify-between border-t border-zinc-100 bg-zinc-50/50 p-8 text-center lg:w-2/5 lg:border-l lg:border-t-0 lg:p-10">
                <div className="my-auto">
                  <div className="mx-auto mb-4 flex h-28 w-28 flex-col items-center justify-center rounded-3xl bg-zinc-950 text-white shadow-md">
                    <span className="text-4xl font-black leading-none tracking-tighter">
                      {extractDiscountNumber(deal.discount)}%
                    </span>
                    <span className="mt-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      Savings Metric
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-600">
                    Instant activation architecture verified
                  </p>
                </div>

                <div className="mt-6 w-full space-y-3 lg:mt-0">
                  <a
                    href={deal.promoUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-xl bg-zinc-950 px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-black"
                  >
                    Activate Offer
                  </a>

                  <a
                    href={`/deals/${deal.slug}`}
                    className="block py-1 text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-zinc-900"
                  >
                    Read Acquisition Analysis &rarr;
                  </a>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
