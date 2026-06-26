"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PricingPlan } from "../content";

interface ToolPricingProps {
  pricing: PricingPlan[];
  displayWebsite: string;
}

export function ToolPricing({ pricing, displayWebsite }: ToolPricingProps) {
  if (!pricing || pricing.length === 0) return null;

  return (
    <section id="pricing" className="border-b border-zinc-200 bg-zinc-50 py-12 lg:py-16 w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <span className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-zinc-600">
            Billing Ledger
          </span>
          <h2 className="[font-family:var(--font-playfair)] mt-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
            Predictive Pricing Analysis
          </h2>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            Compare plan tiers with a clean, editorial structure so every price and benefit stays visible at a glance.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 items-stretch w-full">
          {pricing.map((plan, index) => {
            const isHighlighted = Boolean(plan.highlighted);

            return (
              <div
                key={index}
                className={`relative flex flex-col rounded-3xl border p-6 transition-all shadow-sm ${
                  isHighlighted
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-xl ring-1 ring-zinc-900/20"
                    : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {isHighlighted ? (
                  <span className="absolute -top-3 left-6 inline-flex rounded-full bg-zinc-900 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Recommended
                  </span>
                ) : null}

                <div className="mb-5">
                  <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isHighlighted ? "text-zinc-300" : "text-zinc-500"}`}>
                    {plan.name || "Standard Layer"}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-4xl font-bold tracking-tight [font-family:var(--font-playfair)] ${isHighlighted ? "text-white" : "text-zinc-950"}`}>
                      {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                    </span>
                    {plan.period ? (
                      <span className={`text-xs font-mono ${isHighlighted ? "text-zinc-400" : "text-zinc-500"}`}>
                        /{plan.period}
                      </span>
                    ) : null}
                  </div>

                  {plan.billing ? (
                    <p className={`mt-1 text-[11px] font-mono ${isHighlighted ? "text-zinc-400" : "text-zinc-500"}`}>
                      {plan.billing}
                    </p>
                  ) : null}
                </div>

                <div className={`my-4 border-t ${isHighlighted ? "border-zinc-800" : "border-zinc-100"}`} />

                {plan.features && plan.features.length > 0 ? (
                  <ul className="mb-6 space-y-3 flex-1">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            isHighlighted ? "text-white" : "text-zinc-900"
                          }`}
                        />
                        <span className={isHighlighted ? "leading-normal text-zinc-200" : "leading-normal text-zinc-600"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={`mb-6 flex-1 rounded-2xl border px-4 py-3 text-sm ${isHighlighted ? "border-zinc-800 bg-zinc-900/40 text-zinc-300" : "border-zinc-100 bg-zinc-50 text-zinc-600"}`}>
                    No extra feature notes for this tier.
                  </div>
                )}

                <Button
                  variant={isHighlighted ? "primary" : "outline"}
                  className={`h-10 w-full rounded-xl px-4 text-xs font-bold uppercase tracking-wider transition-all ${
                    isHighlighted
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-950 text-white hover:bg-black border-zinc-950"
                  }`}
                  asChild
                >
                  <a href={displayWebsite} target="_blank" rel="noopener noreferrer">
                    Initialize Tier
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
