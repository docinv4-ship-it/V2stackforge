"use client";

import { Search, X } from "lucide-react";

type RankingSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function RankingSearch({
  value,
  onChange,
  placeholder = "Search rankings, categories, tools...",
}: RankingSearchProps) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-400">
        <Search className="h-4 w-4" />
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm"
        type="text"
        aria-label="Search rankings"
      />

      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
