"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RankingSearch } from "@/components/rankings/ranking-search";
import { RankingFilters } from "@/components/rankings/ranking-filters";
import { RankingSort } from "@/components/rankings/ranking-sort";
import { RankingList } from "@/components/rankings/ranking-list";

import { getLiveRankingCatalog } from "@/lib/rankings/data";
import { searchRankingLibrary } from "@/lib/rankings/search";
import type { RankingSortKey } from "@/lib/rankings/types";

type LiveRankingCatalog = Awaited<ReturnType<typeof getLiveRankingCatalog>>;

export default function RankingsPage() {
  const [catalog, setCatalog] = useState<LiveRankingCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<RankingSortKey>("recommended");

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        setLoading(true);
        const liveCatalog = await getLiveRankingCatalog();
        if (mounted) {
          setCatalog(liveCatalog);
        }
      } catch (err) {
        console.error("Error loading rankings catalog:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      mounted = false;
    };
  }, []);

  const categoryOptions = useMemo(
    () =>
      (catalog?.rankingCategories ?? []).map(({ slug, title }) => ({
        slug,
        title,
      })),
    [catalog]
  );

  const results = useMemo(
    () =>
      searchRankingLibrary(
        catalog?.rankings ?? [],
        catalog?.rankingRows ?? [],
        catalog?.rankingCategories ?? [],
        {
          query,
          categorySlug: selectedCategory,
          sortBy,
        }
      ),
    [catalog, query, selectedCategory, sortBy]
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 overflow-x-hidden">
      {/* JOURNAL HEADER BLOCK */}
      <header className="bg-zinc-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-3xl text-xs font-medium mb-6 tracking-wide uppercase">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Independent SaaS Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-playfair)] tracking-tighter mb-4">
            Tool Rankings
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed">
            Clean, compact rankings built for fast scanning. Search by category or tool, sort by what matters, and jump straight to compare or review.
          </p>
        </div>
      </header>

      {/* FILTER & SEARCH PANEL */}
      <section className="border-b border-zinc-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <RankingSearch
              value={query}
              onChange={setQuery}
              placeholder="Search rankings, categories, or tools..."
            />
            <RankingSort value={sortBy} onChange={setSortBy} />
          </div>

          <div className="mt-4">
            <RankingFilters
              categories={categoryOptions}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full">
        <section className="space-y-6 w-full">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-zinc-200 pb-4">
            <div className="min-w-0">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-playfair)]">
                All Rankings
              </h2>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="shrink-0 w-full md:w-auto rounded-xl border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-medium text-xs shadow-sm"
            >
              <Link href="/comparisons" className="flex items-center gap-1">
                Compare tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading && !catalog ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-16 text-center shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 font-[family-name:var(--font-playfair)]">
                Loading live rankings…
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Fetching tools from Supabase and building ranking cards.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <RankingList
                rows={results.rows}
                emptyTitle="No rankings match your search"
                emptyDescription="Try a broader keyword, switch the category, or clear the sort/filter state."
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
