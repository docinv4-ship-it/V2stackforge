"use client";

import type { RankingSortKey } from "@/lib/rankings/types";

type RankingSortProps = {
  value: RankingSortKey;
  onChange: (value: RankingSortKey) => void;
};

const sortOptions: Array<{ value: RankingSortKey; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "score", label: "Top Rated" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "newest", label: "Newest" },
  { value: "best-for-beginners", label: "Best for Beginners" },
  { value: "best-for-agencies", label: "Best for Agencies" },
];

function normalizeSortKey(value: RankingSortKey): RankingSortKey {
  if (value === "bestForBeginners") return "best-for-beginners";
  if (value === "bestForAgencies") return "best-for-agencies";
  return value;
}

export function RankingSort({ value, onChange }: RankingSortProps) {
  const currentValue = normalizeSortKey(value);

  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
        Sort
      </span>

      <select
        value={currentValue}
        onChange={(event) => {
          const selected = event.target.value as RankingSortKey;
          onChange(normalizeSortKey(selected));
        }}
        className="h-10 cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        aria-label="Sort rankings"
      >
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-zinc-900"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
