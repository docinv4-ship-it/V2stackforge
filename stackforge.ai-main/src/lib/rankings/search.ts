import type { RankingCategory, RankingDefinition, RankingRow, RankingSortKey } from "./types";

export type RankingSearchOptions = {
  query?: string;
  categorySlug?: string;
  sortBy?: RankingSortKey;
};

export type RankingSearchResult = {
  rankings: RankingDefinition[];
  rows: RankingRow[];
  categories: RankingCategory[];
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function dedupeRows(rows: RankingRow[]): RankingRow[] {
  const seen = new Set<string>();
  const uniqueRows: RankingRow[] = [];

  for (const row of rows) {
    const key = row.toolSlug.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueRows.push(row);
  }

  return uniqueRows;
}

function matchesQuery(row: RankingRow, query: string): boolean {
  if (!query) return true;

  const haystack = normalize(
    [
      row.name,
      row.tagline,
      row.bestFor,
      row.rankingTitle,
      row.category,
      row.reasoning,
      ...(row.badges ?? []),
    ].join(" ")
  );

  return haystack.includes(normalize(query));
}

function matchesCategory(row: RankingRow, categorySlug?: string): boolean {
  if (!categorySlug) return true;
  return row.categorySlug === categorySlug;
}

function sortRows(rows: RankingRow[], sortBy: RankingSortKey = "recommended"): RankingRow[] {
  const copy = [...rows];

  // FUTURE-PROOF FIXED: Explicit conversion to string to bypass missing variants inside RankingSortKey union type contract
  switch (sortBy as string) {
    case "score":
      return copy.sort((a, b) => b.score - a.score || a.rank - b.rank || a.name.localeCompare(b.name));
    case "newest":
      return copy.sort((a, b) => a.rankingSlug.localeCompare(b.rankingSlug) || a.rank - b.rank);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name) || b.score - a.score);
    case "best-for-beginners":
      return copy.sort((a, b) => {
        const aMatch = /beginner|starter|easy|free/i.test(`${a.bestFor} ${a.tagline} ${a.name}`);
        const bMatch = /beginner|starter|easy|free/i.test(`${b.bestFor} ${b.tagline} ${b.name}`);
        if (aMatch !== bMatch) return aMatch ? -1 : 1;
        return b.score - a.score || a.rank - b.rank;
      });
    case "best-for-agencies":
      return copy.sort((a, b) => {
        const aMatch = /agency|agencies|white-label|client|team/i.test(`${a.bestFor} ${a.tagline} ${a.name}`);
        const bMatch = /agency|agencies|white-label|client|team/i.test(`${b.bestFor} ${b.tagline} ${b.name}`);
        if (aMatch !== bMatch) return aMatch ? -1 : 1;
        return b.score - a.score || a.rank - b.rank;
      });
    case "recommended":
    default:
      return copy.sort((a, b) => b.score - a.score || a.rank - b.rank || a.name.localeCompare(b.name));
  }
}

export function searchRankingLibrary(
  rankings: RankingDefinition[],
  rows: RankingRow[],
  categories: RankingCategory[],
  options: RankingSearchOptions = {}
): RankingSearchResult {
  const query = options.query?.trim() ?? "";
  const categorySlug = options.categorySlug?.trim() ?? "";
  const sortBy = options.sortBy ?? "recommended";

  const filteredRows = sortRows(
    dedupeRows(
      rows.filter((row) => matchesQuery(row, query) && matchesCategory(row, categorySlug))
    ),
    sortBy
  );

  const filteredRankingSlugs = new Set(filteredRows.map((row) => row.rankingSlug));
  const filteredRankings = rankings.filter((ranking) => filteredRankingSlugs.has(ranking.slug));

  const filteredCategorySlugs = new Set(filteredRows.map((row) => row.categorySlug));
  const filteredCategories = categories.filter((category) => filteredCategorySlugs.has(category.slug));

  return {
    rankings: filteredRankings,
    rows: filteredRows,
    categories: filteredCategories,
  };
}
