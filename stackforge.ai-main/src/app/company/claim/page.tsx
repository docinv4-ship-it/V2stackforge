import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

import { getAllTools } from "@/lib/tools/get-tool";
import type { Tool } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Claim a Tool | StackForge",
  description: "Search for your product and start the verified ownership flow.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 24;

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeCategories(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeCategories(item));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getSearchBlob(tool: Tool): string {
  const fields = [
    tool.name,
    tool.tagline,
    tool.description,
    tool.website,
    ...(normalizeCategories(tool.category) ?? []),
  ];

  return normalizeText(fields.join(" "));
}

function getCategoryBadge(tool: Tool): string {
  const categories = normalizeCategories(tool.category);
  return categories[0] || "Tool";
}

function buildPageHref(input: { q?: string; page: number }): string {
  const params = new URLSearchParams();

  if (input.q && input.q.trim()) {
    params.set("q", input.q.trim());
  }

  if (input.page > 1) {
    params.set("page", String(input.page));
  }

  const query = params.toString();
  return query ? `/company/claim?${query}` : "/company/claim";
}

export default async function CompanyClaimPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const allTools = await getAllTools();

  const query = params.q?.trim() ?? "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const filteredTools = allTools.filter((tool) => {
    if (!query) return true;
    return getSearchBlob(tool).includes(normalizeText(query));
  });

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paginatedTools = filteredTools.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const hasResults = paginatedTools.length > 0;

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
              Claim your profile
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Find your tool and start the ownership flow.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Search the directory, open the claim page, and verify your company details before approval.
            </p>

            <form method="get" action="/company/claim" className="mt-8 flex w-full max-w-2xl gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search by tool name, tagline, or category..."
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">Tool directory</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Showing {paginatedTools.length} of {filteredTools.length} matching tools
            </p>
          </div>

          <Link
            href="/company/dashboard"
            className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
          >
            Open dashboard
          </Link>
        </div>

        {hasResults ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedTools.map((tool) => (
                <article
                  key={tool.id || tool.slug}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold tracking-tight text-zinc-950">
                        {tool.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                        {tool.tagline || tool.description || "No short description available."}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {getCategoryBadge(tool)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {normalizeCategories(tool.category)
                      .slice(0, 3)
                      .map((category) => (
                        <span
                          key={category}
                          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700"
                        >
                          {category.replace(/-/g, " ")}
                        </span>
                      ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/company/claim/${tool.slug}`}
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      Claim this profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>

                    <Link
                      href={`/tool/${tool.slug}`}
                      className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
                    >
                      Open profile
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-col items-center gap-4 border-t border-zinc-200 pt-6">
                <div className="flex items-center gap-2">
                  <Link
                    href={buildPageHref({ q: query, page: Math.max(1, page - 1) })}
                    aria-disabled={page === 1}
                    className={[
                      "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition",
                      page === 1
                        ? "pointer-events-none border-zinc-200 bg-zinc-50 text-zinc-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950",
                    ].join(" ")}
                  >
                    Prev
                  </Link>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <Link
                        key={pageNumber}
                        href={buildPageHref({ q: query, page: pageNumber })}
                        className={[
                          "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition",
                          pageNumber === page
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950",
                        ].join(" ")}
                      >
                        {pageNumber}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={buildPageHref({ q: query, page: Math.min(totalPages, page + 1) })}
                    aria-disabled={page === totalPages}
                    className={[
                      "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition",
                      page === totalPages
                        ? "pointer-events-none border-zinc-200 bg-zinc-50 text-zinc-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950",
                    ].join(" ")}
                  >
                    Next
                  </Link>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center">
            <p className="text-sm text-zinc-500">
              No matching tools found. Try a different keyword.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
