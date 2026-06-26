"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock3, Search, Sparkles, X } from "lucide-react";
import type { ComparisonSearchIndex } from "@/lib/types";

interface ComparisonSearchProps {
  items: ComparisonSearchIndex[];
  title?: string;
  description?: string;
  placeholder?: string;
  compact?: boolean;
}

const STORAGE_KEY = "stackforge-comparison-searches";

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildSearchBlob(item: ComparisonSearchIndex): string {
  return normalize(
    [
      item.toolSlug,
      item.toolName,
      item.comparisonSlug,
      item.comparisonTitle,
      item.category,
      ...(item.aliases ?? []),
      ...(item.keywords ?? []),
      ...(item.toolSlugs ?? []),
    ].join(" ")
  );
}

export function ComparisonSearch({
  items,
  title = "Search comparisons",
  description = "Find a match fast. Search by tool name, category, or comparison title.",
  placeholder = "Cursor vs VS Code, CRM comparisons, funnel builders...",
  compact = false,
}: ComparisonSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter(Boolean).slice(0, 6));
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const filteredItems = useMemo(() => {
    const needle = normalize(query);
    const base = needle
      ? items.filter((item) => buildSearchBlob(item).includes(needle))
      : items;

    return base.slice(0, 8);
  }, [items, query]);

  const popularItems = useMemo(() => items.slice(0, 6), [items]);

  const storeRecentSearch = (value: string) => {
    const next = [value, ...recentSearches.filter((item) => normalize(item) !== normalize(value))].slice(0, 6);
    setRecentSearches(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage may be unavailable in private contexts; ignore quietly.
    }
  };

  const submitSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    storeRecentSearch(trimmed);
    router.push(`/comparisons?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className={compact ? "" : "border-b border-white/10 bg-black/50"}>
      <div className={compact ? "" : "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"}>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                Comparison search
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                {description}
              </p>
            </div>
          </div>

          <form
            className="mt-6 flex flex-col gap-3 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(query);
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="h-14 w-full rounded-2xl border border-white/10 bg-zinc-950 pl-11 pr-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500/60"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-violet-600 px-6 font-semibold text-white transition hover:bg-violet-500"
            >
              Search
            </button>
          </form>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Clock3 className="h-4 w-4 text-violet-300" />
                Recent searches
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => submitSearch(item)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">Your recent searches will appear here.</p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-white">Popular comparisons</div>
              <div className="flex flex-wrap gap-2">
                {popularItems.map((item) => (
                  <Link
                    key={item.comparisonSlug}
                    href={`/compare/${item.comparisonSlug}`}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
                  >
                    {item.comparisonTitle}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {query ? (
            <div className="mt-8">
              <div className="mb-3 text-sm font-semibold text-white">
                Results for “{query}”
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <Link
                    key={item.comparisonSlug}
                    href={`/compare/${item.comparisonSlug}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]"
                  >
                    <p className="text-sm font-semibold text-white">{item.comparisonTitle}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.category}</p>
                  </Link>
                ))}

                {filteredItems.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
                    No exact comparison matched that search. Try a tool name or category.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
