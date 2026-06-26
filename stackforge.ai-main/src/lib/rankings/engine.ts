import type {
  RankingBadge,
  RankingDefinition,
  RankingItem,
  RankingRow,
  RankingSourceTool,
} from "./types";

export interface BuildRankingRowInput {
  ranking: RankingDefinition;
  item: RankingItem;
  tool?: RankingSourceTool;
  overrides?: Partial<
    Pick<
      RankingRow,
      | "name"
      | "logoUrl"
      | "tagline"
      | "bestFor"
      | "badges"
      | "reviewUrl"
      | "compareUrl"
      | "affiliateUrl"
      | "priceLabel"
      | "reviewCount"
      | "score"
    >
  >;
}

function slugToLabel(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function uniqueBadges(badges: RankingBadge[]): RankingBadge[] {
  return [...new Set(badges)];
}

function summarizeText(value: string, maxLength = 88): string {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function inferBestForLabel(
  item: RankingItem,
  ranking: RankingDefinition,
  tool?: RankingSourceTool
): string {
  if (item.bestFor && item.bestFor.trim().length > 0) {
    return summarizeText(item.bestFor);
  }

  const useCase = tool?.useCases?.[0];
  if (useCase && useCase.trim().length > 0) {
    return summarizeText(useCase);
  }

  const fallback =
    ranking.category ||
    tool?.tagline ||
    slugToLabel(item.toolSlug) ||
    "Best fit";

  return summarizeText(fallback);
}

function inferPriceLabel(tool?: RankingSourceTool): string | undefined {
  const pricing = tool?.pricing;
  if (!pricing || pricing.length === 0) {
    return undefined;
  }

  const firstTier = pricing[0];
  if (!firstTier) {
    return undefined;
  }

  const price =
    typeof firstTier.price === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: firstTier.price % 1 === 0 ? 0 : 2,
        }).format(firstTier.price)
      : String(firstTier.price).trim();

  const period = firstTier.period?.trim();
  if (!period) {
    return price;
  }

  return `${price} ${period}`.trim();
}

function selectPrimaryUrl(tool?: RankingSourceTool, toolSlug?: string): string {
  const candidates = [
    tool?.buyUrl,
    tool?.trialUrl,
    tool?.website,
    tool?.officialUrl,
  ].filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0
  );

  return candidates[0] ?? `/tool/${toolSlug ?? ""}`.replace(/\/+$/, "");
}

function inferBadges(
  item: RankingItem,
  bestFor: string,
  tool?: RankingSourceTool
): RankingBadge[] {
  const badges: RankingBadge[] = [...(item.badges ?? [])];

  if (item.rank === 1) {
    badges.push("Leader");
  }

  if (item.score >= 9.2) {
    badges.push("Top Rated");
  }

  const text = normalizeText(
    [bestFor, tool?.tagline ?? "", tool?.description ?? ""].join(" ")
  );

  if (/beginner|beginners|starter|solopreneur|first-time|easy|free/i.test(text)) {
    badges.push("Beginner Friendly");
  }

  if (/agency|agencies|white-label|white label|client|teams?|team/i.test(text)) {
    badges.push("Agency Pick");
  }

  if (
    /value|budget|affordable|cost-effective|free plan|free forever/i.test(text) &&
    item.score >= 8.5
  ) {
    badges.push("Best Value");
  }

  if (
    /growth|scale|scaling|enterprise|power user|advanced/i.test(text) &&
    item.score >= 8.8
  ) {
    badges.push("Fastest Growing");
  }

  return uniqueBadges(badges).slice(0, 4);
}

export function calculateRankingDisplayScore({
  score,
  reviewCount = 0,
  rank = 99,
  badgeCount = 0,
  hasPrimaryUrl = false,
}: {
  score: number;
  reviewCount?: number;
  rank?: number;
  badgeCount?: number;
  hasPrimaryUrl?: boolean;
}): number {
  const reviewBonus = Math.min(reviewCount / 10000, 0.35);
  const rankBonus = rank === 1 ? 0.15 : rank === 2 ? 0.1 : rank === 3 ? 0.06 : 0.03;
  const badgeBonus = Math.min(badgeCount * 0.07, 0.22);
  const urlBonus = hasPrimaryUrl ? 0.05 : 0;

  const finalScore = score + reviewBonus + rankBonus + badgeBonus + urlBonus;
  return Math.round(Math.min(finalScore, 10) * 10) / 10;
}

export function getScoreTier(
  score: number
): "elite" | "strong" | "solid" | "good" | "starter" {
  if (score >= 9.5) return "elite";
  if (score >= 9) return "strong";
  if (score >= 8.5) return "solid";
  if (score >= 7.5) return "good";
  return "starter";
}

export function buildRankingRow({
  ranking,
  item,
  tool,
  overrides = {},
}: BuildRankingRowInput): RankingRow {
  const toolSlug = item.toolSlug;
  const toolName = overrides.name ?? tool?.name ?? slugToLabel(toolSlug);
  const bestFor = overrides.bestFor ?? inferBestForLabel(item, ranking, tool);
  const badges = uniqueBadges([
    ...(item.badges ?? []),
    ...(overrides.badges ?? []),
    ...inferBadges(item, bestFor, tool),
  ]);

  const reviewCount = overrides.reviewCount ?? tool?.reviewCount ?? 0;
  const priceLabel = overrides.priceLabel ?? inferPriceLabel(tool);

  return {
    rank: item.rank,
    rankingSlug: ranking.slug,
    rankingTitle: ranking.title,
    category: ranking.category,
    categorySlug: ranking.categorySlug,
    source: ranking.source,
    toolSlug,
    name: toolName,
    logoUrl: overrides.logoUrl ?? tool?.logo ?? `/logos/${toolSlug}.png`,
    score: overrides.score ?? item.score,
    tagline:
      overrides.tagline ??
      tool?.tagline ??
      tool?.description ??
      ranking.description,
    bestFor,
    badges,
    reviewCount,
    reviewUrl: overrides.reviewUrl ?? `/tool/${toolSlug}`,
    compareUrl:
      overrides.compareUrl ??
      `/comparisons?tool=${encodeURIComponent(
        toolSlug
      )}&ranking=${encodeURIComponent(ranking.slug)}`,
    affiliateUrl: overrides.affiliateUrl ?? selectPrimaryUrl(tool, toolSlug),
    priceLabel,
    reasoning: item.reasoning,
  };
}

function rowIdentity(row: RankingRow): string {
  return `${row.rankingSlug}::${row.toolSlug}`.toLowerCase();
}

function normalizeRow(row: RankingRow): RankingRow {
  return {
    ...row,
    badges: uniqueBadges(row.badges),
    name: row.name.trim(),
    tagline: row.tagline.trim(),
    bestFor: row.bestFor.trim(),
    reviewUrl: row.reviewUrl.trim(),
    compareUrl: row.compareUrl.trim(),
    affiliateUrl: row.affiliateUrl.trim(),
  };
}

/**
 * Builds rows and guarantees uniqueness by rankingSlug + toolSlug.
 * If the same tool appears more than once in the same ranking,
 * the first row wins and later duplicates are ignored.
 */
export function buildRankingRows(
  input: Array<BuildRankingRowInput & { sortOrder?: number }>
): RankingRow[] {
  const seen = new Set<string>();
  const rows: Array<{ row: RankingRow; sortOrder: number }> = [];

  for (const entry of input) {
    const row = normalizeRow(buildRankingRow(entry));
    const key = rowIdentity(row);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    rows.push({
      row,
      sortOrder: entry.sortOrder ?? row.rank,
    });
  }

  return rows
    .sort((a, b) => {
      if (a.row.rankingSlug !== b.row.rankingSlug) {
        return a.row.rankingSlug.localeCompare(b.row.rankingSlug);
      }

      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      return a.row.rank - b.row.rank;
    })
    .map((entry) => entry.row);
}

export function dedupeRankingRows(rows: RankingRow[]): RankingRow[] {
  const seen = new Set<string>();
  const uniqueRows: RankingRow[] = [];

  for (const row of rows) {
    const key = rowIdentity(row);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueRows.push(normalizeRow(row));
  }

  return uniqueRows;
}
