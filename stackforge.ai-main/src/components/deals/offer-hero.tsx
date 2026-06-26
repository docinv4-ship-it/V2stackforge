import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { DealItem } from "@/lib/data/deals";
import { formatWindowLabel } from "@/lib/utils/deal-status";

type Props = {
  deal: DealItem & { status: "active" | "upcoming" };
};

export function OfferHero({ deal }: Props) {
  const windowLabel = formatWindowLabel(deal.promoWindows[0]);

  return (
    <section className="mb-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
            {deal.tool}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl font-mono">
            {deal.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 font-mono">
            {deal.discount} <span className="mx-2 text-zinc-300">/</span> {deal.bonus}
          </p>
          <p className="mt-3 font-mono text-xs text-zinc-500 uppercase tracking-wider bg-zinc-50 inline-block px-3 py-1.5 border border-zinc-200 rounded-md">
            {windowLabel}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-0">
          <Link
            href={deal.upgradeUrl}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 font-mono text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
          >
            Existing User Upgrade
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
          </Link>

          <Link
            href={deal.promoUrl}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 font-mono text-xs font-bold text-white transition hover:bg-black shadow-sm"
          >
            Execute Access
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
