import "@/lib/ecosystems";

import { getRegisteredComparisons } from "@/lib/ecosystems/registry";
import { supabase } from "@/lib/supabase/client";
import { getAllTools } from "@/lib/tools/get-tool";
import type { Comparison, ComparisonSearchIndex, Tool } from "@/lib/types";
import {
  comparisons as localComparisons,
  comparisonSearchIndex as localComparisonSearchIndex,
} from "./comparisons";

type ComparisonRecord = Comparison & {
  aliases?: string[];
  keywords?: string[];
};

type DatabaseComparisonRow = {
  id?: string | number;
  slug: string;
  title: string;
  subtitle?: string | null;
  tool_a_id?: string | null;
  tool_b_name?: string | null;
  tool_a_rating?: number | string | null;
  tool_a_reviews?: number | null;
  approach_text?: string | null;
  best_for_text?: string | null;
  setup_text?: string | null;
  why_it_stands_out?: unknown;
  feature_comparison?: unknown;
  tool_a_strengths?: unknown;
  tool_a_limitations?: unknown;
  tool_b_pros?: unknown;
  tool_b_cons?: unknown;
  quick_take?: string | null;
  winner_name?: string | null;
  recommendation_reason?: string | null;
  winner_cta_text?: string | null;
  winner_cta_link?: string | null;
  category?: string | null;
  category_slug?: string | null;
  aliases?: unknown;
  keywords?: unknown;
  updated_at?: string | null;
  created_at?: string | null;
};

type LiveComparisonCatalog = {
  comparisons: ComparisonRecord[];
  comparisonSearchIndex: ComparisonSearchIndex[];
};

function normalize(value: string): string {
  return (value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function pickText(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value).trim();
    }
  }

  return "";
}

function normalizeStringArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeStringArray(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // Not a JSON string, fallback to split processing
    }
    return value
      .split("\n")
      .flatMap((line) => line.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (isRecord(value)) {
    return Object.values(value)
      .flatMap((item) => normalizeStringArray(item))
      .filter(Boolean);
  }

  return [];
}

function buildToolLookup(tools: Tool[]): {
  byId: Map<string, Tool>;
  bySlug: Map<string, Tool>;
  byName: Map<string, Tool>;
} {
  const byId = new Map<string, Tool>();
  const bySlug = new Map<string, Tool>();
  const byName = new Map<string, Tool>();

  for (const tool of tools) {
    const idKey = normalize(String(tool.id ?? ""));
    const slugKey = normalize(tool.slug ?? "");
    const nameKey = normalize(tool.name ?? "");

    if (idKey) byId.set(idKey, tool);
    if (slugKey) bySlug.set(slugKey, tool);
    if (nameKey) byName.set(nameKey, tool);
  }

  return { byId, bySlug, byName };
}

function findTool(
  lookup: { byId: Map<string, Tool>; bySlug: Map<string, Tool>; byName: Map<string, Tool> },
  value: string | null | undefined
): Tool | undefined {
  const needle = normalize(value ?? "");
  if (!needle) return undefined;
  return lookup.byId.get(needle) ?? lookup.bySlug.get(needle) ?? lookup.byName.get(needle);
}

function fallbackTool(name: string, slug?: string): Tool {
  const safeName = name.trim() || "Tool";
  const safeSlug = slug?.trim() || slugify(safeName);

  return {
    id: safeSlug,
    slug: safeSlug,
    name: safeName,
    tagline: safeName,
    description: safeName,
    logo: "",
    website: "#",
    category: [],
    pricing: [],
    features: [],
    pros: [],
    cons: [],
    useCases: [],
    rating: 0,
    reviewCount: 0,
    faq: [],
  } as Tool;
}

function comparisonToolNames(comparison: ComparisonRecord): [string, string] {
  const parts = comparison.title
    .replace(/\s*[:—-]\s*/g, " ")
    .split(/\s+vs\s+|\s+versus\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  return [parts[0] ?? comparison.tools[0] ?? "Tool A", parts[1] ?? comparison.tools[1] ?? "Tool B"];
}

function buildAliases(comparison: ComparisonRecord): string[] {
  const toolLabels = comparison.tools.map(titleCase);
  const [leftName, rightName] = comparisonToolNames(comparison);
  const titleParts = comparison.title
    .replace(/\s*[:—-]\s*/g, " ")
    .split(/\s+vs\s+|\s+versus\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  return unique([
    ...(comparison.aliases ?? []),
    comparison.title,
    ...toolLabels,
    leftName && rightName ? `${leftName} vs ${rightName}` : "",
    titleParts.join(" vs "),
  ]);
}

function buildKeywords(comparison: ComparisonRecord): string[] {
  const featureTerms = comparison.tableData.flatMap((row) => [
    row.feature,
    ...Object.values(row.values),
  ]);

  const strengthTerms = Object.values(comparison.strengths).flat();
  const limitationTerms = Object.values(comparison.limitations).flat();

  return unique(
    [
      ...(comparison.keywords ?? []),
      comparison.category ?? "",
      comparison.categorySlug ?? "",
      comparison.title,
      comparison.description,
      comparison.verdictSummary,
      comparison.recommendation,
      ...comparison.tools,
      ...featureTerms,
      ...strengthTerms,
      ...limitationTerms,
    ]
      .map(normalize)
      .filter(Boolean)
  );
}

function buildSearchIndex(comparison: ComparisonRecord): ComparisonSearchIndex {
  const firstToolSlug = comparison.tools[0] ?? comparison.slug;
  const secondToolSlug = comparison.tools[1] ?? "";
  const toolName = titleCase(firstToolSlug);

  return {
    toolSlug: firstToolSlug,
    toolName,
    comparisonSlug: comparison.slug,
    comparisonTitle: comparison.title,
    category: comparison.category ?? "Comparison",
    aliases: buildAliases(comparison),
    keywords: buildKeywords(comparison),
    toolSlugs: unique([firstToolSlug, secondToolSlug].filter(Boolean)),
    summary: comparison.verdictSummary || comparison.description,
  };
}

function searchHaystack(comparison: ComparisonRecord): string {
  return normalize(
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
      ...comparison.tableData.map((row) => row.feature),
      ...comparison.tableData.flatMap((row) => Object.values(row.values)),
      ...Object.values(comparison.strengths).flat(),
      ...Object.values(comparison.limitations).flat(),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function mergeComparisons(base: ComparisonRecord[], extra: ComparisonRecord[]): ComparisonRecord[] {
  const map = new Map<string, ComparisonRecord>();

  for (const comparison of base) {
    map.set(comparison.slug, comparison);
  }

  for (const comparison of extra) {
    map.set(comparison.slug, comparison);
  }

  return [...map.values()];
}

function normalizeFeatureComparison(
  featureComparison: unknown,
  toolA: Tool,
  toolB: Tool,
  fallbackRows: Array<{ feature: string; values: Record<string, string> }>
): Array<{ feature: string; values: Record<string, string> }> {
  if (Array.isArray(featureComparison)) {
    const rows = featureComparison
      .map((item) => {
        if (!isRecord(item)) return null;

        const feature = pickText(item.feature, item.label, item.name, item.title);
        if (!feature) return null;

        const values = isRecord(item.values) ? item.values : item;

        return {
          feature,
          values: {
            [toolA.name]: pickText(
              values[toolA.name],
              values[toolA.slug],
              values.tool_a,
              values.toolA,
              values.left,
              values.a
            ) || "—",
            [toolB.name]: pickText(
              values[toolB.name],
              values[toolB.slug],
              values.tool_b,
              values.toolB,
              values.right,
              values.b
            ) || "—",
          },
        };
      })
      .filter(Boolean) as Array<{ feature: string; values: Record<string, string> }>;

    if (rows.length > 0) {
      return rows;
    }
  }

  if (isRecord(featureComparison)) {
    const rows = Object.entries(featureComparison)
      .map(([feature, value]) => {
        if (isRecord(value)) {
          return {
            feature,
            values: {
              [toolA.name]: pickText(
                value[toolA.name],
                value[toolA.slug],
                value.tool_a,
                value.toolA,
                value.left,
                value.a
              ) || "—",
              [toolB.name]: pickText(
                value[toolB.name],
                value[toolB.slug],
                value.tool_b,
                value.toolB,
                value.right,
                value.b
              ) || "—",
            },
          };
        }

        return {
          feature,
          values: {
            [toolA.name]: pickText(value) || "—",
            [toolB.name]: pickText(value) || "—",
          },
        };
      })
      .filter((row) => row.feature.trim());

    if (rows.length > 0) {
      return rows;
    }
  }

  return fallbackRows;
}

function determineWinnerSlug(
  row: DatabaseComparisonRow,
  toolA: Tool,
  toolB: Tool
): string {
  const winnerName = normalize(row.winner_name ?? "");
  if (!winnerName) {
    return "depends";
  }

  if (winnerName === normalize(toolA.slug) || winnerName === normalize(toolA.name)) {
    return toolA.slug;
  }

  if (winnerName === normalize(toolB.slug) || winnerName === normalize(toolB.name)) {
    return toolB.slug;
  }

  return "depends";
}

function databaseRowToComparison(
  row: DatabaseComparisonRow,
  lookup: { byId: Map<string, Tool>; bySlug: Map<string, Tool>; byName: Map<string, Tool> }
): ComparisonRecord {
  const titleParts = row.title
    .replace(/\s*[:—-]\s*/g, " ")
    .split(/\s+vs\s+|\s+versus\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  const toolAFromRow =
    findTool(lookup, row.tool_a_id) ??
    findTool(lookup, titleParts[0]) ??
    fallbackTool(titleParts[0] ?? "Tool A", slugify(titleParts[0] ?? "tool-a"));

  const toolBFromRow =
    findTool(lookup, row.tool_b_name) ??
    findTool(lookup, titleParts[1]) ??
    fallbackTool(row.tool_b_name ?? titleParts[1] ?? "Tool B", slugify(row.tool_b_name ?? titleParts[1] ?? "tool-b"));

  const toolA = toolAFromRow;
  const toolB = toolBFromRow;

  const summary = pickText(
    row.quick_take,
    row.recommendation_reason,
    row.approach_text,
    row.subtitle,
    row.title
  );

  const category = pickText(row.category, Array.isArray(toolA.category) ? toolA.category[0] : "", "Comparison");
  const winnerSlug = determineWinnerSlug(row, toolA, toolB);

  const fallbackRows = [
    {
      feature: "Primary Focus",
      values: {
        [toolA.name]: pickText(row.approach_text, row.subtitle, "—"),
        [toolB.name]: pickText(row.quick_take, row.recommendation_reason, "—"),
      },
    },
    {
      feature: "Best For",
      values: {
        [toolA.name]: pickText(row.best_for_text, row.approach_text, "—"),
        [toolB.name]: pickText(row.recommendation_reason, row.quick_take, "—"),
      },
    },
    {
      feature: "Setup",
      values: {
        [toolA.name]: pickText(row.setup_text, "Managed"),
        [toolB.name]: pickText(row.setup_text, "Managed"),
      },
    },
  ];

  const strengthsA = unique([
    ...normalizeStringArray(row.tool_a_strengths),
    ...normalizeStringArray(row.why_it_stands_out).filter(() => winnerSlug === toolA.slug)
  ]);

  const strengthsB = row.tool_b_pros 
    ? unique(normalizeStringArray(row.tool_b_pros))
    : unique([...normalizeStringArray(row.why_it_stands_out).filter(() => winnerSlug === toolB.slug)]);

  const limitationsA = unique(normalizeStringArray(row.tool_a_limitations));
  const limitationsB = unique(normalizeStringArray(row.tool_b_cons));

  return {
    id: String(row.id ?? row.slug),
    slug: row.slug,
    title: row.title,
    description: summary,
    tools: [toolA.slug, toolB.slug],
    verdict: winnerSlug,
    verdictSummary: summary,
    tableData: normalizeFeatureComparison(row.feature_comparison, toolA, toolB, fallbackRows),
    strengths: {
      [toolA.name]: strengthsA,
      [toolB.name]: strengthsB,
    },
    limitations: {
      [toolA.name]: limitationsA,
      [toolB.name]: limitationsB,
    },
    recommendation: pickText(row.recommendation_reason, row.quick_take, summary),
    category,
    categorySlug: slugify(category),
    aliases: unique([
      row.title,
      ...(row.aliases ? normalizeStringArray(row.aliases) : []),
      `${toolA.name} vs ${toolB.name}`,
      `${toolB.name} vs ${toolA.name}`,
    ]),
    keywords: unique([
      ...normalizeStringArray(row.keywords),
      row.slug,
      row.title,
      toolA.slug,
      toolB.slug,
      toolA.name,
      toolB.name,
      category,
    ].map(normalize)),
    updatedAt: row.updated_at ?? row.created_at ?? undefined,
  } as ComparisonRecord;
}

async function getDatabaseComparisons(): Promise<ComparisonRecord[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tool_comparisons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const tools = await getAllTools();
  const lookup = buildToolLookup(tools);

  return (data as DatabaseComparisonRow[]).map((row) => databaseRowToComparison(row, lookup));
}

async function buildLiveCatalog(): Promise<LiveComparisonCatalog> {
  const registeredComparisons = (getRegisteredComparisons() as ComparisonRecord[]) ?? [];
  const databaseComparisons = await getDatabaseComparisons();

  const mergedComparisons = mergeComparisons(
    localComparisons as ComparisonRecord[],
    mergeComparisons(registeredComparisons, databaseComparisons)
  ).map((comparison) => ({
    ...comparison,
    aliases: unique(comparison.aliases ?? []),
    keywords: unique((comparison.keywords ?? []).map(normalize)),
  }));

  const mergedSearchIndex = mergedComparisons.map((comparison) => buildSearchIndex(comparison));

  return {
    comparisons: mergedComparisons,
    comparisonSearchIndex: mergedSearchIndex,
  };
}

let liveCatalogCache: Promise<LiveComparisonCatalog> | null = null;

export async function getLiveComparisonCatalog(): Promise<LiveComparisonCatalog> {
  liveCatalogCache = buildLiveCatalog();
  return liveCatalogCache;
}

export async function getLiveComparisonBySlug(
  slug: string
): Promise<ComparisonRecord | undefined> {
  const catalog = await getLiveComparisonCatalog();
  return catalog.comparisons.find((comparison) => comparison.slug === slug);
}

export async function getLiveComparisonSearchIndexBySlug(
  slug: string
): Promise<ComparisonSearchIndex | undefined> {
  const catalog = await getLiveComparisonCatalog();
  return catalog.comparisonSearchIndex.find((entry) => entry.comparisonSlug === slug);
}

export async function getLiveComparisonSearchIndexForTool(
  toolSlug: string
): Promise<ComparisonSearchIndex[]> {
  const catalog = await getLiveComparisonCatalog();
  const needle = normalize(toolSlug);

  return catalog.comparisonSearchIndex.filter(
    (entry) =>
      normalize(entry.toolSlug) === needle ||
      entry.toolSlugs?.some((value) => normalize(value) === needle) ||
      entry.aliases.some((alias) => normalize(alias).includes(needle))
  );
}

export async function searchLiveComparisons(query: string): Promise<ComparisonRecord[]> {
  const needle = normalize(query);
  const catalog = await getLiveComparisonCatalog();

  if (!needle) {
    return catalog.comparisons;
  }

  return catalog.comparisons.filter((comparison) => searchHaystack(comparison).includes(needle));
}

export async function searchLiveComparisonIndex(
  query: string
): Promise<ComparisonSearchIndex[]> {
  const needle = normalize(query);
  const catalog = await getLiveComparisonCatalog();

  if (!needle) {
    return catalog.comparisonSearchIndex;
  }

  return catalog.comparisonSearchIndex.filter((entry) =>
    normalize(
      [
        entry.toolSlug,
        entry.toolName,
        entry.comparisonSlug,
        entry.comparisonTitle,
        entry.category,
        ...entry.aliases,
        ...entry.keywords,
        ...(entry.toolSlugs ?? []),
      ].join(" ")
    ).includes(needle)
  );
}
