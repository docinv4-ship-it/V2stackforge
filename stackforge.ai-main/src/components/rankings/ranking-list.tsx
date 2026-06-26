"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RankingRow } from "@/lib/rankings/types";
import { RankingRow as RankingRowCard } from "./ranking-row";

type RankingListProps = {
  rows: RankingRow[];
  emptyTitle?: string;
  emptyDescription?: string;
};

const ITEMS_PER_PAGE = 25;

function getPageWindow(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 1) return [1];

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (pages[0] !== 1) {
    if (pages[0] !== 2) pages.unshift(1);
    if (pages[1] !== 2 && totalPages > 1) pages.splice(1, 0, -1);
  }

  if (pages[pages.length - 1] !== totalPages) {
    if (pages[pages.length - 1] !== totalPages - 1) pages.push(-1);
    pages.push(totalPages);
  }

  return pages.filter((page) => page > 0 || page === -1);
}

export function RankingList({
  rows,
  emptyTitle = "No rankings found",
  emptyDescription = "Try a different search or filter.",
}: RankingListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [rows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return rows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [rows, currentPage]);

  const startItem = rows.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, rows.length);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
        <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-zinc-950">
          {emptyTitle}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  const pageWindow = getPageWindow(currentPage, totalPages);

  return (
    <div className="space-y-6">
      <div className="divide-y divide-zinc-200 border-t border-zinc-200">
        {paginatedRows.map((row) => (
          <RankingRowCard key={`${row.rankingSlug}-${row.toolSlug}`} row={row} />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-3 border-t border-zinc-200 pt-6">
        <p className="text-xs text-zinc-500">
          Showing {startItem}–{endItem} of {rows.length} rankings
        </p>

        {totalPages > 1 ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 shadow-sm transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            {pageWindow.map((page, index) =>
              page === -1 ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-xs font-medium text-zinc-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={[
                    "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-xs font-medium shadow-sm transition",
                    page === currentPage
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900",
                  ].join(" ")}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 shadow-sm transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
