import {
  comparisonSearchIndex,
  comparisons,
  getComparisonBySlug,
  getComparisonsForTool,
} from "@/lib/data/comparisons";
import type { Comparison, ComparisonSearchIndex } from "@/lib/types";

export type ComparisonSearchSort = "relevance" | "newest" | "alphabetical";

export interface ComparisonSearchOptions {
  query?: string;
  category?: string;
  sortBy?: ComparisonSearchSort;
  limit?: number;
}

export interface RelatedComparisonOptions {
  limit?: number;
  includeSameToolComparisons?: boolean;
  includeSameCategoryComparisons?: boolean;
}

interface ScoredComparison {
  comparison: Comparison;
  score: number;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length > 1);
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseDate(value?: string): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function comparisonHaystack(comparison: Comparison): string {
  return normalize(
    [
      comparison.id,
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
      ...comparison.tableData.map((row) => row.feature),
      ...comparison.tableData.flatMap((row) => Object.values(row.values)),
      ...Object.values(comparison.strengths).flat(),
      ...Object.values(comparison.limitations).flat(),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function indexHaystack(entry: ComparisonSearchIndex): string {
  return normalize(
    [
      entry.toolSlug,
      entry.toolName,
      entry.comparisonSlug,
      entry.comparisonTitle,
      entry.category,
      ...(entry.aliases ?? []),
      ...(entry.keywords ?? []),
      ...(entry.toolSlugs ?? []),
      entry.summary ?? "",
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function scoreMatch(text: string, queryTokens: string[]): number {
  if (!queryTokens.length) return 0;

  const normalizedText = normalize(text);
  let score = 0;

  for (const token of queryTokens) {
    if (!token) continue;

    if (normalizedText === token) {
      score += 10;
      continue;
    }

    if (normalizedText.startsWith(token)) {
      score += 6;
      continue;
    }

    if (normalizedText.includes(token)) {
      score += 3;
      continue;
    }

    const words = normalizedText.split(" ");
    if (words.some((word) => word === token)) {
      score += 4;
    }
  }

  return score;
}

function scoreComparison(comparison: Comparison, query: string): number {
  const needle = normalize(query);
  if (!needle) {
    const recency = parseDate(comparison.updatedAt) / 1e13;
    const winnerBonus = comparison.verdict !== "depends" ? 0.75 : 0.4;
    const depthBonus = Math.min(comparison.tableData.length / 10, 0.5);
    return winnerBonus + depthBonus + recency;
  }

  const queryTokens = tokenize(query);
  const haystack = comparisonHaystack(comparison);

  let score = 0;

  score += scoreMatch(comparison.title, queryTokens) * 4;
  score += scoreMatch(comparison.description, queryTokens) * 2;
  score += scoreMatch(comparison.category ?? "", queryTokens) * 3;
  score += scoreMatch(comparison.categorySlug ?? "", queryTokens) * 3;
  score += scoreMatch(comparison.verdictSummary, queryTokens) * 3;
  score += scoreMatch(comparison.recommendation, queryTokens) * 2;

  for (const alias of comparison.aliases ?? []) {
    score += scoreMatch(alias, queryTokens) * 4;
  }

  for (const keyword of comparison.keywords ?? []) {
    score += scoreMatch(keyword, queryTokens) * 2;
  }

  for (const toolSlug of comparison.tools) {
    score += scoreMatch(toolSlug, queryTokens) * 5;
  }

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      score += 1.5;
    }
  }

  const recency = parseDate(comparison.updatedAt);
  if (recency > 0) {
    score += recency / 1e13;
  }

  if (comparison.verdict !== "depends") {
    score += 1.25;
  }

  score += Math.min(comparison.tableData.length / 12, 0.6);
  score += Math.min(
    Object.values(comparison.strengths).flat().length / 30,
    0.5
  );

  return score;
}

function sortComparisons(
  list: Comparison[],
  query: string,
  sortBy: ComparisonSearchSort
): Comparison[] {
  if (sortBy === "alphabetical") {
    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortBy === "newest") {
    return [...list].sort((a, b) => {
      const aDate = parseDate(a.updatedAt);
      const bDate = parseDate(b.updatedAt);
      return bDate - aDate || a.title.localeCompare(b.title);
    });
  }

  return [...list]
    .map((comparison) => ({
      comparison,
      score: scoreComparison(comparison, query),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      const aDate = parseDate(a.comparison.updatedAt);
      const bDate = parseDate(b.comparison.updatedAt);
      return bDate - aDate || a.comparison.title.localeCompare(b.comparison.title);
    })
    .map((entry) => entry.comparison);
}

function categoryMatches(comparison: Comparison, category: string): boolean {
  const needle = normalize(category);
  if (!needle || needle === "all") return true;

  const haystack = normalize(
    [
      comparison.category ?? "",
      comparison.categorySlug ?? "",
      comparison.title,
      comparison.description,
      ...(comparison.aliases ?? []),
      ...(comparison.keywords ?? []),
    ].join(" ")
  );

  return haystack.includes(needle);
}

function queryMatches(comparison: Comparison, query: string): boolean {
  const needle = normalize(query);
  if (!needle) return true;

  const haystack = comparisonHaystack(comparison);
  if (haystack.includes(needle)) return true;

  const tokens = tokenize(query);
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
}

export function searchComparisons(
  options: ComparisonSearchOptions = {}
): Comparison[] {
  const query = options.query ?? "";
  const category = options.category ?? "All";
  const sortBy = options.sortBy ?? "relevance";
  const limit = options.limit ?? 0;

  const filtered = comparisons.filter(
    (comparison) =>
      categoryMatches(comparison, category) && queryMatches(comparison, query)
  );

  const sorted = sortComparisons(filtered, query, sortBy);

  return limit > 0 ? sorted.slice(0, limit) : sorted;
}

export function searchComparisonIndex(
  query: string,
  limit = 12
): ComparisonSearchIndex[] {
  const needle = normalize(query);
  const tokens = tokenize(query);

  const scored = comparisonSearchIndex
    .map((entry) => {
      const haystack = indexHaystack(entry);
      let score = 0;

      if (!needle) {
        score = 1 + Math.min((entry.keywords?.length ?? 0) / 25, 0.4);
      } else {
        for (const token of tokens) {
          if (haystack === token) {
            score += 10;
          } else if (haystack.startsWith(token)) {
            score += 6;
          } else if (haystack.includes(token)) {
            score += 3;
          }
        }

        if (entry.aliases?.some((alias) => normalize(alias) === needle)) {
          score += 5;
        }

        if (entry.comparisonTitle && normalize(entry.comparisonTitle).includes(needle)) {
          score += 4;
        }

        if (entry.category && normalize(entry.category).includes(needle)) {
          score += 2;
        }
      }

      return { entry, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.comparisonTitle.localeCompare(b.entry.comparisonTitle);
    })
    .map((item) => item.entry);

  return limit > 0 ? scored.slice(0, limit) : scored;
}

export function searchByTool(
  toolSlug: string,
  options: Omit<ComparisonSearchOptions, "query"> = {}
): Comparison[] {
  const needle = normalize(toolSlug);

  const directMatches = comparisons.filter((comparison) =>
    comparison.tools.some((tool) => normalize(tool) === needle)
  );

  const indexMatches = comparisonSearchIndex
    .filter(
      (entry) =>
        normalize(entry.toolSlug) === needle ||
        (entry.toolSlugs ?? []).some((value) => normalize(value) === needle) ||
        entry.aliases.some((alias) => normalize(alias).includes(needle))
    )
    .map((entry) => getComparisonBySlug(entry.comparisonSlug))
    .filter((item): item is Comparison => Boolean(item));

  const merged = unique([...directMatches, ...indexMatches]);

  return sortComparisons(merged, toolSlug, options.sortBy ?? "relevance").slice(
    0,
    options.limit && options.limit > 0 ? options.limit : merged.length
  );
}

export function searchByCategory(
  category: string,
  options: Omit<ComparisonSearchOptions, "category"> = {}
): Comparison[] {
  return searchComparisons({
    query: options.query ?? "",
    category,
    sortBy: options.sortBy ?? "relevance",
    limit: options.limit ?? 0,
  });
}

export function getPopularComparisons(limit = 6): Comparison[] {
  return [...comparisons]
    .map((comparison) => {
      const featureCount = comparison.tableData.length;
      const toolCount = comparison.tools.length;
      const strengthCount = Object.values(comparison.strengths).flat().length;
      const keywordCount = (comparison.keywords ?? []).length;
      const aliasCount = (comparison.aliases ?? []).length;
      const recency = parseDate(comparison.updatedAt) / 1e13;

      const score =
        featureCount * 1.25 +
        toolCount * 0.75 +
        strengthCount * 0.08 +
        keywordCount * 0.05 +
        aliasCount * 0.05 +
        recency +
        (comparison.verdict !== "depends" ? 1 : 0);

      return { comparison, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aDate = parseDate(a.comparison.updatedAt);
      const bDate = parseDate(b.comparison.updatedAt);
      return bDate - aDate || a.comparison.title.localeCompare(b.comparison.title);
    })
    .slice(0, limit)
    .map((item) => item.comparison);
}

export function getRelatedComparisons(
  comparisonSlug: string,
  options: RelatedComparisonOptions = {}
): Comparison[] {
  const limit = options.limit ?? 6;
  const includeSameToolComparisons =
    options.includeSameToolComparisons ?? true;
  const includeSameCategoryComparisons =
    options.includeSameCategoryComparisons ?? true;

  const source = getComparisonBySlug(comparisonSlug);
  if (!source) return [];

  const sourceTools = new Set(source.tools.map(normalize));
  const sourceCategory = normalize(source.category ?? "");
  const sourceKeywords = new Set((source.keywords ?? []).map(normalize));
  const sourceAliases = new Set((source.aliases ?? []).map(normalize));

  const scored: ScoredComparison[] = comparisons
    .filter((comparison) => comparison.slug !== comparisonSlug)
    .map((comparison) => {
      let score = 0;

      const comparisonTools = comparison.tools.map(normalize);

      const sharedTools = comparisonTools.filter((tool) => sourceTools.has(tool)).length;
      if (includeSameToolComparisons) {
        score += sharedTools * 6;
      }

      if (includeSameCategoryComparisons) {
        if (normalize(comparison.category ?? "") === sourceCategory) {
          score += 4;
        }

        if (
          sourceCategory &&
          normalize(comparison.categorySlug ?? "").includes(sourceCategory)
        ) {
          score += 2;
        }
      }

      const comparisonKeywords = new Set((comparison.keywords ?? []).map(normalize));
      const comparisonAliases = new Set((comparison.aliases ?? []).map(normalize));

      const sharedKeywords = [...comparisonKeywords].filter((keyword) =>
        sourceKeywords.has(keyword)
      ).length;
      const sharedAliases = [...comparisonAliases].filter((alias) =>
        sourceAliases.has(alias)
      ).length;

      score += sharedKeywords * 0.8;
      score += sharedAliases * 0.6;

      const sharedTitleWords = tokenize(source.title).filter((word) =>
        normalize(comparison.title).includes(word)
      ).length;
      score += Math.min(sharedTitleWords * 0.5, 2);

      score += Math.min((comparison.tableData.length / 10) * 0.4, 0.6);
      score += parseDate(comparison.updatedAt) / 1e13;

      return { comparison, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.comparison.title.localeCompare(b.comparison.title);
    });

  return scored.slice(0, limit).map((item) => item.comparison);
}

export function getComparisonSuggestions(query: string, limit = 8): string[] {
  return searchComparisonIndex(query, limit).map((entry) => entry.comparisonTitle);
}

export function getComparisonCategories(): string[] {
  return unique(
    comparisons
      .map((comparison) => comparison.category ?? "Comparison")
      .filter(Boolean)
  ).sort((a, b) => a.localeCompare(b));
}

export function getComparisonToolSlugs(): string[] {
  return unique(comparisons.flatMap((comparison) => comparison.tools));
}

export function getComparisonCountByCategory(category: string): number {
  return searchByCategory(category).length;
}

export function getComparisonSearchStats() {
  return {
    totalComparisons: comparisons.length,
    totalIndexedRecords: comparisonSearchIndex.length,
    categories: getComparisonCategories(),
    toolSlugs: getComparisonToolSlugs(),
  };
}

export function resolveComparisonQuery(query: string): Comparison[] {
  return searchComparisons({ query, sortBy: "relevance" });
}

export function resolveComparisonIndexQuery(query: string): ComparisonSearchIndex[] {
  return searchComparisonIndex(query);
}

export function findComparisonBySlug(slug: string): Comparison | undefined {
  return getComparisonBySlug(slug);
}

export function findComparisonsForTool(toolSlug: string): Comparison[] {
  return getComparisonsForTool(toolSlug);
}

export function getComparisonLabelList(limit = 6): string[] {
  return getPopularComparisons(limit).map((comparison) => comparison.title);
}

export function searchComparisonsByText(query: string, limit = 12): Comparison[] {
  return searchComparisons({ query, sortBy: "relevance", limit });
}

export function searchComparisonsByCategory(
  category: string,
  limit = 12
): Comparison[] {
  return searchByCategory(category, { limit });
}

export function searchComparisonsByTool(
  toolSlug: string,
  limit = 12
): Comparison[] {
  return searchByTool(toolSlug, { limit });
}
