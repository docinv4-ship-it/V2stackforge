import type { Metadata } from "next";
import { DealsHeader } from "@/components/deals/deals-header";
import { DealsGrid } from "@/components/deals/deals-grid";
import { getPublicDeals, type DealItem } from "@/lib/data/deals";

export const metadata: Metadata = {
  title: "Best SaaS Deals | StackForge",
  description: "Discover verified offers for CRM, funnels, automation, and core software utilities.",
};

export const dynamic = "force-dynamic";

type PublicDeal = DealItem & {
  status: "active" | "upcoming";
};

export default async function DealsPage() {
  // Pure dynamic data resolve karne ke liye yahan await lagaya hai
  const rawDeals = await getPublicDeals();
  const deals = rawDeals as PublicDeal[];

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-zinc-950 md:px-8 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Crisp Text Header Node */}
        <div className="border-b border-zinc-100 pb-8">
          <DealsHeader />
        </div>

        {/* Pure Data Matrix Grid — Ab tools strictly sirf yahan single card list mein show honge */}
        <div className="pt-4 text-zinc-950">
          <DealsGrid deals={deals} />
        </div>

        {/* Structural Empty State Node */}
        {deals.length === 0 ? (
          <div className="border border-dashed border-zinc-200 bg-transparent py-20 text-center font-mono text-xs text-zinc-400 rounded-xl">
            // No public active offers mapped to this network terminal.
          </div>
        ) : null}
      </div>
    </main>
  );
}
