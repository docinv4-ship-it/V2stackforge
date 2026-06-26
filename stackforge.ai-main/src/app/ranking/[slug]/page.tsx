// src/app/ranking/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RankingList } from "@/components/rankings/ranking-list";
import {
  getLiveRankingBySlug,
  getLiveRankingRowsForRanking,
} from "@/lib/rankings/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ranking = await getLiveRankingBySlug(slug);

  if (!ranking) {
    return {
      title: "Ranking Not Found | StackForge AI",
    };
  }

  return {
    title: `${ranking.title} | StackForge AI`,
    description: ranking.description,
    openGraph: {
      title: ranking.title,
      description: ranking.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ranking.title,
      description: ranking.description,
    },
  };
}

export default async function RankingDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const ranking = await getLiveRankingBySlug(slug);
  if (!ranking) {
    notFound();
  }

  const rows = await getLiveRankingRowsForRanking(slug);
  const topRow = rows[0];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 overflow-x-hidden">
      {/* SOLID MONOCHROME HEADER - NO PURPLE GLOW, NO BLURRED TEXT OVERLAPS */}
      <header className="bg-zinc-900 text-white py-20 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-6">
          
          {/* Tagline Badge with Clean Emerald State Indicator */}
          <div className="mb-6 inline-flex items-center gap-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-3xl text-xs font-medium tracking-wide uppercase text-zinc-200 border border-white/5">
            <Trophy className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            <span>{ranking.category}</span>
          </div>

          {/* High Contrast Clean Typography */}
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-playfair)] tracking-tighter mb-4 text-white leading-tight">
            {ranking.title}
          </h1>

          <p className="text-lg text-zinc-300 max-w-3xl font-normal leading-relaxed">
            {ranking.description}
          </p>
          
        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full">
        <section className="space-y-6 w-full">
          
          {/* Section Control Panel */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-zinc-200 pb-5">
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-zinc-900">
                Ranked Tools Index
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Strict editorial criteria applied to live operational data metrics.
              </p>
            </div>

            {/* Action Buttons with Valid Type Controls */}
            <div className="flex flex-col gap-3 w-full md:w-auto sm:flex-row shrink-0">
              {topRow ? (
                <Button 
                  variant="primary" 
                  size="sm" 
                  asChild 
                  className="w-full sm:w-auto rounded-xl bg-zinc-900 text-white hover:bg-black transition-colors font-medium text-xs px-5 py-2.5 shadow-sm"
                >
                  <a href={topRow.affiliateUrl} target="_blank" rel="noreferrer">
                    Visit top pick
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : null}

              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="w-full sm:w-auto rounded-xl border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-medium text-xs px-5 py-2.5 shadow-sm"
              >
                <Link href="/rankings">
                  Back to rankings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Listings Grid */}
          <div className="w-full">
            <RankingList
              rows={rows}
              emptyTitle="No ranked tools found"
              emptyDescription="This ranking context is valid, but no operational database rows were synced to render."
            />
          </div>

        </section>
      </main>
    </div>
  );
}
