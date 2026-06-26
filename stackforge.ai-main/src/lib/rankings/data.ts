import "@/lib/ecosystems";

import { tools as baseTools } from "@/lib/data/tools";
import { getAllTools } from "@/lib/tools/get-tool";
import { getRegisteredEcosystems } from "@/lib/ecosystems/registry";

import {
  buildRankingRow,
  calculateRankingDisplayScore,
  dedupeRankingRows,
} from "./engine";

import type {
  RankingBadge,
  RankingCategory,
  RankingDefinition,
  RankingItem,
  RankingRow,
  RankingSourceTool,
} from "./types";

function normalizeBadges(value: readonly string[] | undefined): RankingBadge[] {
  return [...new Set((value ?? []).filter(Boolean) as RankingBadge[])];
}

function normalizeTool(tool: {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  website: string;
  officialUrl?: string;
  trialUrl?: string;
  buyUrl?: string;
  category?: string[] | string;
  categories?: string[];
  pricing?: Array<{
    name: string;
    price: number | string;
    period?: string;
    billing?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
  }>;
  features?: string[];
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  rating?: number;
  reviewCount?: number;
  quickFacts?: string[];
}): RankingSourceTool {
  const categories = Array.isArray(tool.categories)
    ? tool.categories
    : Array.isArray(tool.category)
      ? tool.category
      : typeof tool.category === "string"
        ? tool.category.split(",").map((item) => item.trim()).filter(Boolean)
        : [];

  return {
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    logo: tool.logo,
    website: tool.website,
    officialUrl: tool.officialUrl,
    trialUrl: tool.trialUrl,
    buyUrl: tool.buyUrl,
    categories,
    pricing: tool.pricing ?? [],
    features: tool.features ?? [],
    pros: tool.pros ?? [],
    cons: tool.cons ?? [],
    useCases: tool.useCases ?? [],
    rating: tool.rating,
    reviewCount: tool.reviewCount,
    quickFacts: tool.quickFacts ?? [],
  };
}

function slugToCategorySlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqByToolSlug(rows: RankingRow[]): RankingRow[] {
  const seen = new Set<string>();
  const uniqueRows: RankingRow[] = [];

  for (const row of rows) {
    if (seen.has(row.toolSlug)) {
      continue;
    }

    seen.add(row.toolSlug);
    uniqueRows.push(row);
  }

  return uniqueRows;
}

function buildToolIndex(liveTools: RankingSourceTool[] = []): Map<string, RankingSourceTool> {
  const index = new Map<string, RankingSourceTool>();

  const registryTools = getRegisteredEcosystems().map((ecosystem) =>
    normalizeTool(ecosystem.tool)
  );

  for (const tool of baseTools) {
    index.set(tool.slug, normalizeTool(tool));
  }

  for (const tool of registryTools) {
    index.set(tool.slug, tool);
  }

  for (const tool of liveTools) {
    index.set(tool.slug, tool);
  }

  return index;
}

function getToolFromIndex(
  slug: string,
  index: Map<string, RankingSourceTool>
): RankingSourceTool | undefined {
  return index.get(slug);
}

function buildRowsForRanking(
  ranking: RankingDefinition,
  toolIndex: Map<string, RankingSourceTool>
): RankingRow[] {
  const rows = ranking.items
    .map((item, index) => {
      const tool = getToolFromIndex(item.toolSlug, toolIndex);

      if (!tool) {
        return null;
      }

      const row = buildRankingRow({
        ranking,
        item,
        tool,
        overrides: {
          tagline: tool.tagline || tool.description,
          bestFor: item.bestFor?.trim() ? item.bestFor : tool.useCases?.[0],
          badges: normalizeBadges(item.badges),
        },
      });

      return {
        ...row,
        score: calculateRankingDisplayScore({
          score: row.score,
          reviewCount: row.reviewCount,
          rank: row.rank,
          badgeCount: row.badges.length,
          hasPrimaryUrl: Boolean(row.affiliateUrl),
        }),
        _order: index,
      } as RankingRow & { _order: number };
    })
    .filter((row): row is RankingRow & { _order: number } => row !== null);

  const deduped = uniqByToolSlug(rows) as Array<RankingRow & { _order: number }>;

  return deduped
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.rank - b.rank;
    })
    .map(({ _order: _ignored, ...row }) => row);
}

function buildAllToolsRanking(
  toolIndex: Map<string, RankingSourceTool>
): RankingDefinition {
  const allTools = [...toolIndex.values()]
    .filter((tool) => Boolean(tool.slug))
    .filter(
      (tool, index, arr) => arr.findIndex((item) => item.slug === tool.slug) === index
    )
    .sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;

      const reviewDiff = (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      if (reviewDiff !== 0) return reviewDiff;

      return a.name.localeCompare(b.name);
    });

  return {
    id: "rank-all-tools",
    slug: "all-tools",
    title: "All Tools from StackForge",
    description:
      "Live ranking of every tool in the database, sorted automatically by rating and review count.",
    category: "All Tools",
    categorySlug: "all-tools",
    source: "manual",
    methodology:
      "Automatically generated from Supabase tools. Tools are sorted by rating, review count, and overall ranking score.",
    items: allTools.map((tool, index) => ({
      rank: index + 1,
      toolSlug: tool.slug,
      score: tool.rating ?? 0,
      reasoning: tool.tagline || tool.description || tool.name,
    })),
  };
}

const manualRankings: RankingDefinition[] = [
  {
    id: "rank-funnel-builders",
    slug: "best-funnel-builders",
    title: "Best Funnel Builders for Online Businesses in 2026",
    description:
      "Compact ranking of the top funnel platforms for entrepreneurs, course creators, and online businesses.",
    category: "Funnels",
    categorySlug: "funnels",
    source: "manual",
    methodology:
      "Ranked by funnel-specific features, conversion strength, ease of use, and overall value for real buyers.",
    items: [
      {
        rank: 1,
        toolSlug: "clickfunnels",
        score: 9.4,
        reasoning:
          "ClickFunnels stays the strongest pure funnel builder because of its conversion-focused templates and proven funnel workflow.",
      },
      {
        rank: 2,
        toolSlug: "systeme-io",
        score: 9.1,
        reasoning:
          "Systeme.io offers strong funnel building plus an accessible free plan and built-in email automation.",
      },
      {
        rank: 3,
        toolSlug: "highlevel",
        score: 8.6,
        reasoning:
          "HighLevel is powerful for funnels when you also want CRM, messaging, and automation in one system.",
      },
    ],
  },
  {
    id: "rank-marketing-platforms",
    slug: "best-marketing-platforms",
    title: "Best All-in-One Marketing Platforms for 2026",
    description:
      "A clean shortlist of platforms that combine email, funnels, CRM, and automation without clutter.",
    category: "Marketing Automation",
    categorySlug: "marketing-automation",
    source: "manual",
    methodology:
      "Ranked by breadth of features, integration quality, workflow consolidation, and practical value.",
    items: [
      {
        rank: 1,
        toolSlug: "highlevel",
        score: 9.5,
        reasoning:
          "HighLevel leads here because it combines CRM, messaging, funnels, appointments, and white-label capability.",
      },
      {
        rank: 2,
        toolSlug: "systeme-io",
        score: 9.2,
        reasoning:
          "Systeme.io gives strong all-in-one value with a very easy entry point.",
      },
      {
        rank: 3,
        toolSlug: "clickfunnels",
        score: 8.0,
        reasoning:
          "ClickFunnels is excellent for funnels, but it needs more add-ons for a broader marketing stack.",
      },
    ],
  },
  {
    id: "rank-all-in-one-business",
    slug: "best-all-in-one-business-tools",
    title: "Best All-in-One Business Platforms for Entrepreneurs",
    description:
      "The strongest compact options for running an online business from one dashboard.",
    category: "All-in-One",
    categorySlug: "all-in-one",
    source: "manual",
    methodology:
      "Ranked by how many separate tools the platform genuinely replaces and how easy it is to adopt.",
    items: [
      {
        rank: 1,
        toolSlug: "highlevel",
        score: 9.6,
        reasoning:
          "HighLevel gives the widest operational coverage for agencies and service businesses.",
      },
      {
        rank: 2,
        toolSlug: "systeme-io",
        score: 9.3,
        reasoning:
          "Systeme.io keeps the stack simple while still covering the essentials.",
      },
      {
        rank: 3,
        toolSlug: "clickfunnels",
        score: 7.9,
        reasoning:
          "ClickFunnels remains strongest for funnel-first teams, not full-stack operators.",
      },
    ],
  },
  {
    id: "rank-tools-online-business",
    slug: "best-tools-for-online-business",
    title: "Best Tools for Starting an Online Business in 2026",
    description:
      "The cleanest options for launching a new business without unnecessary complexity.",
    category: "Online Business",
    categorySlug: "online-business",
    source: "manual",
    methodology:
      "Ranked by budget fit, beginner friendliness, and ability to launch quickly.",
    items: [
      {
        rank: 1,
        toolSlug: "systeme-io",
        score: 9.7,
        reasoning:
          "Systeme.io is the easiest place to start because the free plan removes friction.",
      },
      {
        rank: 2,
        toolSlug: "highlevel",
        score: 8.5,
        reasoning:
          "HighLevel works well once you already know your process and need stronger operations.",
      },
      {
        rank: 3,
        toolSlug: "clickfunnels",
        score: 8.1,
        reasoning:
          "ClickFunnels is excellent once you have a proven offer and want a focused funnel system.",
      },
    ],
  },
  {
    id: "rank-sales-funnel",
    slug: "best-sales-funnel-software",
    title: "Best Sales Funnel Software for High-Converting Funnels",
    description:
      "Focused funnel software ranking with only the strongest buyer-intent options.",
    category: "Sales Funnels",
    categorySlug: "sales-funnels",
    source: "manual",
    methodology:
      "Ranked by funnel performance, upsell support, template quality, and overall conversion use.",
    items: [
      {
        rank: 1,
        toolSlug: "clickfunnels",
        score: 9.3,
        reasoning:
          "ClickFunnels remains the most recognizable pure funnel system for conversion-led teams.",
      },
      {
        rank: 2,
        toolSlug: "systeme-io",
        score: 8.7,
        reasoning:
          "Systeme.io is the best value funnel option when budget matters.",
      },
      {
        rank: 3,
        toolSlug: "highlevel",
        score: 8.2,
        reasoning:
          "HighLevel is a strong funnel option when CRM and follow-up are part of the same workflow.",
      },
    ],
  },
  {
    id: "rank-mac-vm",
    slug: "best-mac-virtual-machines",
    title: "Best Mac Virtual Machines for Windows-on-Mac",
    description:
      "A compact category for users who need Windows on Mac without noise or filler.",
    category: "Mac Virtualization",
    categorySlug: "mac-virtualization",
    source: "manual",
    methodology:
      "Ranked by real Mac workflow fit, support quality, and Apple silicon readiness.",
    items: [
      {
        rank: 1,
        toolSlug: "parallels",
        score: 9.6,
        reasoning:
          "Parallels is the strongest Mac-first virtualization option for most users.",
      },
      {
        rank: 2,
        toolSlug: "vmware-fusion",
        score: 8.4,
        reasoning:
          "VMware Fusion remains relevant for some technical workflows.",
      },
      {
        rank: 3,
        toolSlug: "virtualbox",
        score: 7.9,
        reasoning:
          "VirtualBox is flexible, but not as polished for daily Mac users.",
      },
    ],
  },
  {
    id: "rank-managed-hosting",
    slug: "best-managed-hosting-providers",
    title: "Best Managed Hosting Providers for 2026",
    description:
      "A focused ranking of managed hosting platforms for businesses that need reliability, support, and scalability.",
    category: "Web Hosting",
    categorySlug: "web-hosting",
    source: "manual",
    methodology:
      "Ranked by support quality, infrastructure reliability, managed workflow depth, and business fit.",
    items: [
      {
        rank: 1,
        toolSlug: "liquid-web",
        score: 9.7,
        reasoning:
          "Liquid Web is the strongest managed hosting option here because it combines expert support, scalable infrastructure, and business-friendly hosting workflows.",
      },
    ],
  },
];

function buildCatalogWithTools(
  liveTools: RankingSourceTool[]
): {
  rankings: RankingDefinition[];
  rankingCategories: RankingCategory[];
  rankingRows: RankingRow[];
  rankingRowsByRanking: Map<string, RankingRow[]>;
} {
  const toolIndex = buildToolIndex(liveTools);

  const liveRankings: RankingDefinition[] = [
    ...manualRankings,
    buildAllToolsRanking(toolIndex),
  ];

  const rankingRowsByRanking = new Map<string, RankingRow[]>();

  for (const ranking of liveRankings) {
    rankingRowsByRanking.set(ranking.slug, buildRowsForRanking(ranking, toolIndex));
  }

  const rankingRows = dedupeRankingRows(
    liveRankings.flatMap((ranking) => rankingRowsByRanking.get(ranking.slug) ?? [])
  ).sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (a.rankingSlug !== b.rankingSlug) {
      return a.rankingSlug.localeCompare(b.rankingSlug);
    }

    return a.rank - b.rank;
  });

  const rankingCategories: RankingCategory[] = liveRankings.map((ranking) => ({
    slug: ranking.categorySlug ?? slugToCategorySlug(ranking.category ?? ranking.title),
    title: ranking.category ?? ranking.title,
    description: ranking.description,
    count: ranking.items.length,
    rankingCount: 1,
    toolCount: ranking.items.length,
    rankings: [ranking],
  }));

  return {
    rankings: liveRankings,
    rankingCategories,
    rankingRows,
    rankingRowsByRanking,
  };
}

// Legacy static exports (kept so existing pages do not break immediately)
export const rankings: RankingDefinition[] = manualRankings;

export const rankingCategories: RankingCategory[] = manualRankings.map((ranking) => ({
  slug: ranking.categorySlug ?? slugToCategorySlug(ranking.category ?? ranking.title),
  title: ranking.category ?? ranking.title,
  description: ranking.description,
  count: ranking.items.length,
  rankingCount: 1,
  toolCount: ranking.items.length,
  rankings: [ranking],
}));

const staticToolIndex = buildToolIndex();

const rankingRowsByRanking = new Map<string, RankingRow[]>();

for (const ranking of rankings) {
  rankingRowsByRanking.set(ranking.slug, buildRowsForRanking(ranking, staticToolIndex));
}

export const rankingRows: RankingRow[] = dedupeRankingRows(
  rankings.flatMap((ranking) => rankingRowsByRanking.get(ranking.slug) ?? [])
).sort((a, b) => {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  if (a.rankingSlug !== b.rankingSlug) {
    return a.rankingSlug.localeCompare(b.rankingSlug);
  }

  return a.rank - b.rank;
});

export function getRankingBySlug(slug: string): RankingDefinition | undefined {
  return rankings.find((ranking) => ranking.slug === slug);
}

export function getRankingRowsForRanking(slug: string): RankingRow[] {
  return rankingRowsByRanking.get(slug) ?? [];
}

export function getRankingCategoryBySlug(slug: string): RankingCategory | undefined {
  return rankingCategories.find((category) => category.slug === slug);
}

export function getRankingRowsForCategory(slug: string): RankingRow[] {
  return rankingRows.filter((row) => row.categorySlug === slug);
}

export function getVisibleRankingCount(): number {
  return rankingRows.length;
}

// Live Supabase-backed helpers
let liveCatalogCache: Promise<ReturnType<typeof buildCatalogWithTools>> | null = null;

async function getLiveToolIndex(): Promise<Map<string, RankingSourceTool>> {
  const liveTools = await getAllTools();
  const normalizedLiveTools = liveTools.map((tool) => normalizeTool(tool));
  return buildToolIndex(normalizedLiveTools);
}

export async function getLiveRankingCatalog() {
  if (!liveCatalogCache) {
    liveCatalogCache = (async () => {
      const liveToolIndex = await getLiveToolIndex();
      const liveRankings: RankingDefinition[] = [
        ...manualRankings,
        buildAllToolsRanking(liveToolIndex),
      ];

      const liveRankingRowsByRanking = new Map<string, RankingRow[]>();

      for (const ranking of liveRankings) {
        liveRankingRowsByRanking.set(
          ranking.slug,
          buildRowsForRanking(ranking, liveToolIndex)
        );
      }

      const liveRankingRows = dedupeRankingRows(
        liveRankings.flatMap((ranking) => liveRankingRowsByRanking.get(ranking.slug) ?? [])
      ).sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        if (a.rankingSlug !== b.rankingSlug) {
          return a.rankingSlug.localeCompare(b.rankingSlug);
        }

        return a.rank - b.rank;
      });

      const liveRankingCategories: RankingCategory[] = liveRankings.map((ranking) => ({
        slug: ranking.categorySlug ?? slugToCategorySlug(ranking.category ?? ranking.title),
        title: ranking.category ?? ranking.title,
        description: ranking.description,
        count: ranking.items.length,
        rankingCount: 1,
        toolCount: ranking.items.length,
        rankings: [ranking],
      }));

      return {
        rankings: liveRankings,
        rankingCategories: liveRankingCategories,
        rankingRows: liveRankingRows,
        rankingRowsByRanking: liveRankingRowsByRanking,
      };
    })();
  }

  return liveCatalogCache;
}

export async function getLiveRankingBySlug(slug: string): Promise<RankingDefinition | undefined> {
  const catalog = await getLiveRankingCatalog();
  return catalog.rankings.find((ranking) => ranking.slug === slug);
}

export async function getLiveRankingRowsForRanking(slug: string): Promise<RankingRow[]> {
  const catalog = await getLiveRankingCatalog();
  return catalog.rankingRowsByRanking.get(slug) ?? [];
}

export async function getLiveRankingRowsForCategory(slug: string): Promise<RankingRow[]> {
  const catalog = await getLiveRankingCatalog();
  return catalog.rankingRows.filter((row) => row.categorySlug === slug);
}
