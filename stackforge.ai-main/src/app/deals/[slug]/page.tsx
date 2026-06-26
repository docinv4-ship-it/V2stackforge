import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { getDealBySlugAsync } from "@/lib/data/deals";
import { formatWindowLabel, type PromoWindow } from "@/lib/utils/deal-status";
import { OfferHero } from "@/components/deals/offer-hero";

type Props = {
  params: Promise<{ slug: string }>;
};

type DealStatus = "active" | "upcoming";

function isValidPromoWindow(window: unknown): window is PromoWindow {
  if (!window || typeof window !== "object") return false;

  const candidate = window as Partial<PromoWindow>;
  return (
    typeof candidate.start === "string" &&
    typeof candidate.end === "string" &&
    candidate.start.length > 0 &&
    candidate.end.length > 0
  );
}

function resolveDealStatus(promoWindows: PromoWindow[], now = new Date()): DealStatus {
  if (promoWindows.length === 0) {
    return "upcoming";
  }

  const nowTime = now.getTime();

  for (const window of promoWindows) {
    const startTime = new Date(window.start).getTime();
    const endTime = new Date(window.end).getTime();

    if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
      continue;
    }

    if (nowTime >= startTime && nowTime <= endTime) {
      return "active";
    }
  }

  return "upcoming";
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlugAsync(slug);

  if (!deal) {
    return { title: "Deal Not Found | StackForge" };
  }

  return {
    title: `${deal.tool || ""} ${deal.title || ""} | StackForge`,
    description: `${deal.discount || ""} · ${deal.bonus || ""}`,
  };
}

export default async function DealPage({ params }: Props) {
  const { slug } = await params;
  const deal = await getDealBySlugAsync(slug);

  if (!deal) notFound();

  const safePromoWindows = Array.isArray(deal.promoWindows)
    ? deal.promoWindows.filter(isValidPromoWindow)
    : [];

  const status = resolveDealStatus(safePromoWindows);

  const dealWithStatus = {
    ...deal,
    status,
  };

  const safeAngles = Array.isArray(deal.angles) ? deal.angles : [];
  const safeResources = Array.isArray(deal.resources) ? deal.resources : [];

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-zinc-950 md:px-8 border-t border-zinc-200">
      <div className="mx-auto max-w-5xl space-y-16">
        <div className="border-b border-zinc-100 pb-12">
          <OfferHero deal={dealWithStatus} />
        </div>

        <section className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-12">
            <div className="border-b border-zinc-100 pb-10">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                01 // PROMO INCLUSIONS
              </p>
              <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900">
                Verified Provisions
              </h2>
              <ul className="mt-5 space-y-3 font-mono text-xs leading-6 text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-400">//</span>
                  <span>{deal.discount || "Standard Discount Applies"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-400">//</span>
                  <span>{deal.bonus || "Exclusive Access Included"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-400">//</span>
                  <span>Only the exact promo windows listed below are valid for activation</span>
                </li>
              </ul>
            </div>

            <div className="border-b border-zinc-100 pb-10">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                02 // OPERATIONS FLOW
              </p>
              <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900">
                Strategic Promotion Blueprint
              </h2>
              <div className="mt-5 space-y-4">
                {safeAngles.length > 0 ? (
                  safeAngles.map((angle: string, index: number) => (
                    <div
                      key={`${angle || "angle"}-${index}`}
                      className="border-l border-zinc-900 bg-transparent py-1 pl-5 font-mono text-xs text-zinc-600 leading-6"
                    >
                      {angle}
                    </div>
                  ))
                ) : (
                  <div className="font-mono text-xs text-zinc-400 italic">
                    No active strategic channels configured.
                  </div>
                )}
              </div>
            </div>

            <div className="pb-4">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                03 // ENGINEERING ASSETS
              </p>
              <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900">
                Guides & Asset Packages
              </h2>
              <div className="mt-4 divide-y divide-zinc-100">
                {safeResources.length > 0 ? (
                  safeResources.map((resource: string, index: number) => (
                    <div
                      key={`${resource || "resource"}-${index}`}
                      className="flex items-center gap-3 py-4 font-mono text-xs text-zinc-600"
                    >
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span>{resource}</span>
                    </div>
                  ))
                ) : (
                  <div className="pt-4 font-mono text-xs text-zinc-400 italic">
                    No asset paths mapped for this deployment.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-12 lg:border-l lg:border-zinc-100 lg:pl-12">
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                04 // SCHEDULER WINDOWS
              </p>
              <div className="space-y-2">
                {safePromoWindows.length > 0 ? (
                  safePromoWindows.map((window: PromoWindow, index: number) => {
                    const keyString = `${window.start}-${window.end}-${index}`;

                    return (
                      <div
                        key={keyString}
                        className="border border-zinc-200 bg-zinc-50/50 px-4 py-3.5 font-mono text-xs text-zinc-700 rounded-xl shadow-sm"
                      >
                        {formatWindowLabel(window)}
                      </div>
                    );
                  })
                ) : (
                  <div className="font-mono text-xs italic text-zinc-400">
                    No live window intervals configured.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                05 // ACTION GATEWAY
              </p>
              <div className="space-y-2.5">
                <a
                  href={deal.promoUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3.5 font-mono text-xs font-bold text-white transition hover:bg-black shadow-sm"
                >
                  Claim Active Promo
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>

                <a
                  href={deal.upgradeUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 font-mono text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
                >
                  Existing User Upgrade
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
