import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, Search, Sparkles } from "lucide-react";

import { ComparisonCard } from "@/components/cards/comparison-card";
import { getLiveComparisonCatalog } from "@/lib/data/comparisons-live";

export const metadata: Metadata = {
  title: "Systems Comparison Ledgers | StackForge Intel",
  description:
    "Data-driven side by side intelligence audits. Analyze features, operational performance thresholds, and matrix alignment without advertising layouts.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

type SortKey = "recommended" | "newest" | "alphabetical";

const ITEMS_PER_PAGE = 24;

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function parsePage(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function buildHref(input: {
  q?: string;
  category?: string;
  sort?: SortKey;
  page?: number;
}): string {
  const params = new URLSearchParams();

  if (input.q && input.q.trim()) params.set("q", input.q.trim());
  if (input.category && input.category !== "All") params.set("category", input.category);
  if (input.sort && input.sort !== "recommended") params.set("sort", input.sort);
  if (input.page && input.page > 1) params.set("page", String(input.page));

  const query = params.toString();
  return query ? `/comparisons?${query}` : "/comparisons";
}

function buildPageWindow(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  for (let offset = -1; offset <= 1; offset += 1) {
    const page = currentPage + offset;
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const current = sorted[index];
    const next = sorted[index + 1];

    result.push(current);

    if (typeof next === "number" && next - current > 1) {
      result.push("ellipsis");
    }
  }

  return result.filter((item): item is number => item !== "ellipsis");
}

export default async function ComparisonsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const catalog = await getLiveComparisonCatalog();

  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "All";
  const sortBy = (params.sort?.trim() ?? "recommended") as SortKey;
  const currentPage = parsePage(params.page);

  const categoryOptions = [
    "All",
    ...new Set(catalog.comparisons.map((comparison) => comparison.category || "Comparison")),
  ];

  const filteredComparisons = catalog.comparisons
    .filter((comparison) => {
      if (category !== "All" && (comparison.category || "Comparison") !== category) {
        return false;
      }

      if (!query) return true;

      const searchBlob = normalize(
        [
          comparison.slug,
          comparison.title,
          comparison.description,
          comparison.category,
          comparison.categorySlug,
          comparison.verdict,
          comparison.verdictSummary,
          comparison.recommendation,
          ...(comparison.aliases ?? []),
          ...(comparison.keywords ?? []),
          ...comparison.tools,
        ].join(" ")
      );

      return searchBlob.includes(normalize(query));
    })
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "newest") {
        const aDate = a.updatedAt ?? "";
        const bDate = b.updatedAt ?? "";
        return bDate.localeCompare(aDate) || a.title.localeCompare(b.title);
      }

      const aRecommended = a.verdict !== "depends" ? 1 : 0;
      const bRecommended = b.verdict !== "depends" ? 1 : 0;

      return (
        bRecommended - aRecommended ||
        (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") ||
        a.title.localeCompare(b.title)
      );
    });

  const totalResults = filteredComparisons.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComparisons = filteredComparisons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pageWindow = buildPageWindow(safeCurrentPage, totalPages);

  return (
    <div className="min-h-screen bg-white text-zinc-950 antialiased">
      {/* Editorial Tech Header Area */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-16 lg:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded bg-zinc-200/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              <Scale className="h-3 w-3" />
              Structural Matrices List
            </div>

            <h1 className="font-mono text-4xl font-black tracking-tight text-zinc-900 md:text-5xl lg:text-6xl">
              Tool <span className="font-normal text-zinc-400">Comparisons</span>
            </h1>

            <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-zinc-500">
              Clean side-by-side technical rows. No advertisements. Filter the active category pool, scan the index variables, and view full analytical overviews instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Luxury Minimal Search Terminal Row */}
      <section className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8 md:flex-row">
          <form method="get" action="/comparisons" className="flex w-full flex-1 gap-3 font-mono text-xs">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              <input
                id="comparison-search"
                name="q"
                defaultValue={query}
                placeholder="Search active matrices index (e.g. ClickUp, Cursor, CRM)..."
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="sort" value={sortBy} />
            </div>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-5 font-bold uppercase tracking-wider text-white transition hover:bg-black"
            >
              Search
            </button>
          </form>

          <div className="flex max-w-full flex-wrap items-center gap-2 overflow-x-auto py-1 font-mono text-[10px]">
            {categoryOptions.map((item) => {
              const active = item === category;
              return (
                <Link
                  key={item}
                  href={buildHref({ q: query, category: item, sort: sortBy, page: 1 })}
                  className={`whitespace-nowrap rounded-md border px-3 py-1.5 font-bold uppercase tracking-wider transition ${
                    active
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Premium Card Grid Section */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {paginatedComparisons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {paginatedComparisons.map((comparison) => (
                  <ComparisonCard key={comparison.id} comparison={comparison} />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <p className="text-xs font-medium text-zinc-500">
                    Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalResults)} of{" "}
                    {totalResults} comparisons
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Link
                      href={buildHref({
                        q: query,
                        category,
                        sort: sortBy,
                        page: Math.max(1, safeCurrentPage - 1),
                      })}
                      className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                        safeCurrentPage === 1
                          ? "pointer-events-none border-zinc-200 bg-white text-zinc-300"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                      }`}
                    >
                      Prev
                    </Link>

                    {pageWindow.map((page) => {
                      const active = page === safeCurrentPage;

                      return (
                        <Link
                          key={page}
                          href={buildHref({
                            q: query,
                            category,
                            sort: sortBy,
                            page,
                          })}
                          className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                            active
                              ? "border-zinc-950 bg-zinc-950 text-white"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                          }`}
                        >
                          {page}
                        </Link>
                      );
                    })}

                    <Link
                      href={buildHref({
                        q: query,
                        category,
                        sort: sortBy,
                        page: Math.min(totalPages, safeCurrentPage + 1),
                      })}
                      className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                        safeCurrentPage === totalPages
                          ? "pointer-events-none border-zinc-200 bg-white text-zinc-300"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                      }`}
                    >
                      Next
                    </Link>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-200 p-12 text-center font-mono">
              <Sparkles className="mx-auto h-5 w-5 text-zinc-300" />
              <h2 className="mt-4 text-sm font-bold uppercase tracking-widest text-zinc-900">
                Index pool empty
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                No matrices match the active variable string query input.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FIXED CRITICAL: Banner area with strict inline and global overrides */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl md:p-12">
            <h2
              className="font-mono text-2xl font-black tracking-tight md:text-3xl !text-white"
              style={{ color: "#ffffff" }}
            >
              Still Evaluating Operational Infrastructure?
            </h2>

            <p
              className="mx-auto mt-4 max-w-xl font-mono text-xs !text-zinc-200 leading-relaxed"
              style={{ color: "#e4e4e7" }}
            >
              Analytical logs index high-velocity data strings. Switch filters directly to access verified ecosystem allocations.
            </p>

            <div className="mt-8 flex justify-center font-mono text-xs">
              <Link
                href="/rankings"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-bold uppercase tracking-wider text-black shadow-sm transition hover:scale-[1.01] hover:bg-zinc-200"
              >
                View Global Rankings
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
