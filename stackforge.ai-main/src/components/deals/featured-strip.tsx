import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DealItem } from "@/lib/data/deals";
import { formatWindowLabel } from "@/lib/utils/deal-status";

type Props = {
  deal: DealItem & { status: "active" | "upcoming" };
};

export function FeaturedStrip({ deal }: Props) {
  const firstWindow = deal.promoWindows[0];

  return (
    <section className="mb-10 w-full border border-zinc-200 bg-white px-5 py-5 rounded-xl shadow-sm transition-colors hover:bg-zinc-50/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
                deal.status === "active"
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 text-zinc-500 border border-zinc-200/60"
              }`}
            >
              {deal.status === "active" ? "Live Pool" : "Upcoming"}
            </span>
            <span className="font-mono text-xs font-bold text-zinc-900">{deal.tool}</span>
          </div>

          <p className="text-base font-bold text-zinc-950 font-mono">
            {deal.title}
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
             <span className="text-zinc-700">{deal.discount}</span>
             <span>•</span>
             <span>{formatWindowLabel(firstWindow)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Link
            href={`/deals/${deal.slug}`}
            className="font-mono text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors border-b border-transparent hover:border-zinc-950 pb-0.5 whitespace-nowrap"
          >
            Audit System
          </Link>

          <Link
            href={deal.promoUrl}
            target="_blank"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 font-mono text-xs font-bold text-white transition hover:bg-black shadow-sm whitespace-nowrap"
          >
            Claim Offer
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
