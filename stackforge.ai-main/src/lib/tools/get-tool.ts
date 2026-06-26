import "@/lib/ecosystems";

import {
  getRegisteredEcosystemByToolSlug,
  getRegisteredTools,
} from "@/lib/ecosystems/registry";
import {
  getToolBySlug as getLegacyToolBySlug,
  tools as legacyTools,
} from "@/lib/data/tools";
import { supabase } from "@/lib/supabase/client";
import type { Tool } from "@/lib/types";

type DatabaseToolRow = {
  id?: string | number;
  slug: string;
  name: string;

  short_description?: string | null;
  overview_text?: string | null;
  category?: unknown;
  affiliate_link?: string | null;
  try_free_link?: string | null;
  logo?: string | null;
  website?: string | null;
  rating?: number | string | null;
  review_count?: number | null;
  key_features?: unknown;
  pros?: unknown;
  cons?: unknown;
  use_cases?: unknown;
  pricing_plans?: unknown;
  faqs?: unknown;

  author_name?: string | null;
  author_role?: string | null;
  author_image?: string | null;
  author_bio?: string | null;
  evaluation_date?: string | null;
  confidence_level?: string | null;

  tagline?: string | null;
  description?: string | null;
  affiliate_url?: string | null;
  categories?: unknown;
  pricing_json?: unknown;
  faq_json?: unknown;
  pros_json?: unknown;
  cons_json?: unknown;
  use_cases_json?: unknown;

  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: unknown;
  screenshots?: unknown;
  alternatives?: unknown;
  best_for?: unknown;
  editorial_score?: number | string | null;
  pricing_score?: number | string | null;
  ease_of_use_score?: number | string | null;
  speed_score?: number | string | null;
  coverage_score?: number | string | null;
  support_score?: number | string | null;
  featured?: boolean | null;
  hero_featured?: boolean | null;
  homepage_featured?: boolean | null;
  editor_pick?: boolean | null;
  order_priority?: number | null;
  updated_at?: string | null;
};

type DatabaseToolReviewRow = {
  id?: string | number;
  tool_id?: string | number | null;
  slug: string;
  author_name?: string | null;
  publish_date?: string | null;
  content_markdown?: string | null;
  verdict_summary?: string | null;
  rating_breakdown?: unknown;
  author_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: unknown;
  best_for?: unknown;
  created_at?: string | null;
};

type DatabaseToolComparisonRow = {
  id?: string | number;
  slug: string;
  title: string;
  subtitle?: string | null;
  article?: unknown;
  winner_name?: string | null;
  recommendation_reason?: string | null;
  feature_comparison?: unknown;
  pricing_comparison?: unknown;
  faqs?: unknown;
  keywords?: unknown;
  seo_title?: string | null;
  seo_description?: string | null;
  rating?: number | string | null;
  review_count?: number | null;
  ranked_tools?: unknown;
};

type ToolLike = {
  id?: string | number;
  slug?: string;
  name?: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  officialUrl?: string;
  trialUrl?: string;
  buyUrl?: string;
  affiliate_url?: string;
  category?: unknown;
  categories?: unknown;
  pricing?: unknown;
  features?: unknown;
  pros?: unknown;
  cons?: unknown;
  useCases?: unknown;
  faq?: unknown;
  rating?: number | string | null;
  reviewCount?: number | string | null;

  author_name?: string | null;
  author_role?: string | null;
  author_image?: string | null;
  author_bio?: string | null;
  evaluation_date?: string | null;
  confidence_level?: string | null;

  content_markdown?: string | null;
  verdict_summary?: string | null;
  rating_breakdown?: unknown;
  review_slug?: string | null;
  review_author_name?: string | null;
  review_publish_date?: string | null;
  review_seo_title?: string | null;
  review_seo_description?: string | null;
  review_keywords?: unknown;
  review_best_for?: unknown;

  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: unknown;
  screenshots?: unknown;
  alternatives?: unknown;
  best_for?: unknown;
  editorial_score?: number | string | null;
  pricing_score?: number | string | null;
  ease_of_use_score?: number | string | null;
  speed_score?: number | string | null;
  coverage_score?: number | string | null;
  support_score?: number | string | null;
  featured?: boolean | null;
  hero_featured?: boolean | null;
  homepage_featured?: boolean | null;
  editor_pick?: boolean | null;
  order_priority?: number | null;
};

export type PaginatedToolsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

export type PaginatedToolsResult = {
  tools: Tool[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

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

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toInteger(value: unknown, fallback = 0): number {
  return Math.max(0, Math.trunc(toNumber(value, fallback)));
}

function normalizeStringArray(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeStringArray(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
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

function normalizeCategoryArray(value: unknown): string[] {
  return normalizeStringArray(value).map((item) =>
    item
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

function normalizeFaqArray(value: unknown): any[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((item) => ({
      question: pickText(item.question),
      answer: pickText(item.answer),
    }))
    .filter((item) => item.question && item.answer);
}

function normalizePricingArray(value: unknown): any[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((item) => ({
      name: pickText(item.name),
      price: typeof item.price === "number" ? item.price : pickText(item.price),
      period: pickText(item.period, item.billing),
      features: normalizeStringArray(item.features),
      highlighted: Boolean(item.highlighted),
    }))
    .filter((item) => item.name);
}

function firstNonEmptyArray<T>(
  primary: unknown,
  fallback: unknown,
  parser: (value: unknown) => T[]
): T[] {
  const primaryArray = parser(primary);
  if (primaryArray.length > 0) {
    return primaryArray;
  }

  return parser(fallback);
}

function reviewRowToToolLike(row: DatabaseToolReviewRow): ToolLike {
  return {
    review_slug: row.slug,
    review_author_name: row.author_name ?? undefined,
    review_publish_date: row.publish_date ?? undefined,
    content_markdown: row.content_markdown ?? "",
    verdict_summary: row.verdict_summary ?? "",
    rating_breakdown: row.rating_breakdown,
    review_seo_title: row.seo_title ?? undefined,
    review_seo_description: row.seo_description ?? undefined,
    review_keywords: row.keywords,
    review_best_for: row.best_for,
  };
}

function databaseRowToToolLike(row: DatabaseToolRow): ToolLike {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? row.short_description ?? "",
    description: row.description ?? row.overview_text ?? row.short_description ?? "",
    logo: row.logo ?? "",
    website: row.website ?? row.affiliate_link ?? row.affiliate_url ?? row.try_free_link ?? "",
    affiliate_url: row.affiliate_url ?? row.affiliate_link ?? "",

    category: row.category ?? row.categories ?? [],

    pricing: row.pricing_plans ?? row.pricing_json ?? [],
    features: row.key_features ?? [],
    pros: row.pros ?? row.pros_json ?? [],
    cons: row.cons ?? row.cons_json ?? [],
    useCases: row.use_cases ?? row.use_cases_json ?? [],
    faq: row.faqs ?? row.faq_json ?? [],

    rating: row.rating,
    reviewCount: row.review_count,

    author_name: row.author_name,
    author_role: row.author_role,
    author_image: row.author_image,
    author_bio: row.author_bio,
    evaluation_date: row.evaluation_date,
    confidence_level: row.confidence_level,

    seo_title: row.seo_title ?? undefined,
    seo_description: row.seo_description ?? undefined,
    keywords: row.keywords,
    screenshots: row.screenshots,
    alternatives: row.alternatives,
    best_for: row.best_for,
    editorial_score: row.editorial_score ?? undefined,
    pricing_score: row.pricing_score ?? undefined,
    ease_of_use_score: row.ease_of_use_score ?? undefined,
    speed_score: row.speed_score ?? undefined,
    coverage_score: row.coverage_score ?? undefined,
    support_score: row.support_score ?? undefined,
    featured: row.featured ?? undefined,
    hero_featured: row.hero_featured ?? undefined,
    homepage_featured: row.homepage_featured ?? undefined,
    editor_pick: row.editor_pick ?? undefined,
    order_priority: row.order_priority ?? undefined,
  };
}

function extractRankedToolSlugs(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") return [item];
        if (isRecord(item)) {
          const slug = pickText(
            item.toolSlug,
            item.tool_slug,
            item.slug,
            item.name,
            item.title
          );
          return slug ? [slug] : [];
        }
        return [];
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return extractRankedToolSlugs(parsed);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (isRecord(value)) {
    return Object.values(value)
      .flatMap((item) => extractRankedToolSlugs(item))
      .filter(Boolean);
  }

  return [];
}

function extractComparisonArticleText(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (isRecord(value)) {
    return pickText(
      value.article,
      value.content,
      value.text,
      value.body,
      value.summary
    );
  }

  return "";
}

async function getSimpleToolRecordBySlug(
  slug: string
): Promise<Pick<ToolLike, "slug" | "name" | "logo" | "website"> | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const legacy = getLegacyToolLike(normalizedSlug);
  if (legacy) {
    return {
      slug: pickText(legacy.slug, normalizedSlug),
      name: pickText(legacy.name, normalizedSlug),
      logo: pickText(legacy.logo),
      website: pickText(legacy.website, legacy.affiliate_url),
    };
  }

  const db = supabase;
  if (!db) return null;

  const { data, error } = await db
    .from("tools")
    .select("slug,name,logo,website,affiliate_link,affiliate_url")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as Partial<DatabaseToolRow> & {
    logo?: string | null;
    website?: string | null;
    affiliate_link?: string | null;
    affiliate_url?: string | null;
  };

  return {
    slug: pickText(row.slug, normalizedSlug),
    name: pickText(row.name, normalizedSlug),
    logo: pickText(row.logo),
    website: pickText(row.website, row.affiliate_link, row.affiliate_url),
  };
}

async function buildComparisonLogo(row: DatabaseToolComparisonRow): Promise<string> {
  const rankedSlugs = extractRankedToolSlugs(row.ranked_tools);

  for (const candidateSlug of rankedSlugs) {
    const tool = await getSimpleToolRecordBySlug(candidateSlug);
    if (tool?.logo) {
      return tool.logo;
    }
  }

  return "";
}

async function comparisonRowToToolLike(
  row: DatabaseToolComparisonRow
): Promise<ToolLike> {
  const articleText = extractComparisonArticleText(row.article);
  const logo = await buildComparisonLogo(row);

  return {
    id: row.id,
    slug: row.slug,
    name: row.title,
    tagline: row.subtitle ?? "",
    description: row.recommendation_reason ?? "",
    logo,
    website: `/compare/${row.slug}`,
    content_markdown: articleText,
    verdict_summary: row.recommendation_reason ?? "",
    faq: row.faqs ?? [],
    rating: row.rating,
    reviewCount: row.review_count,
    seo_title: row.seo_title ?? undefined,
    seo_description: row.seo_description ?? undefined,
    keywords: row.keywords,
  };
}

function buildTool(
  primary: ToolLike | null | undefined,
  fallback: ToolLike | null | undefined = null,
  review: ToolLike | null | undefined = null
): Tool | null {
  const source = primary ?? fallback;

  if (!source) {
    return null;
  }

  const slug = pickText(primary?.slug, fallback?.slug);
  if (!slug) {
    return null;
  }

  const name = pickText(primary?.name, fallback?.name, slug);
  const tagline = pickText(primary?.tagline, fallback?.tagline, name);
  const description = pickText(primary?.description, fallback?.description, tagline);
  const logo = pickText(primary?.logo, fallback?.logo);
  const website = pickText(
    primary?.website,
    primary?.affiliate_url,
    fallback?.website,
    fallback?.affiliate_url,
    fallback?.officialUrl,
    fallback?.trialUrl,
    fallback?.buyUrl,
    `/tool/${slug}`
  );

  const category = firstNonEmptyArray(
    primary?.category ?? primary?.categories,
    fallback?.category ?? fallback?.categories,
    normalizeCategoryArray
  );

  const pricing = firstNonEmptyArray(primary?.pricing, fallback?.pricing, normalizePricingArray);
  const features = firstNonEmptyArray(primary?.features, fallback?.features, normalizeStringArray);
  const pros = firstNonEmptyArray(primary?.pros, fallback?.pros, normalizeStringArray);
  const cons = firstNonEmptyArray(primary?.cons, fallback?.cons, normalizeStringArray);
  const useCases = firstNonEmptyArray(primary?.useCases, fallback?.useCases, normalizeStringArray);
  const faq = firstNonEmptyArray(primary?.faq, fallback?.faq, normalizeFaqArray);

  const author_name = pickText(primary?.author_name, fallback?.author_name);
  const author_role = pickText(primary?.author_role, fallback?.author_role);
  const author_image = pickText(primary?.author_image, fallback?.author_image);
  const author_bio = pickText(primary?.author_bio, fallback?.author_bio);
  const evaluation_date = pickText(primary?.evaluation_date, fallback?.evaluation_date);
  const confidence_level =
    pickText(primary?.confidence_level, fallback?.confidence_level) || "High";

  const reviewSource = review ?? primary ?? fallback;
  const content_markdown = pickText(
    reviewSource?.content_markdown,
    review?.content_markdown,
    fallback?.content_markdown
  );

  const verdict_summary = pickText(
    reviewSource?.verdict_summary,
    review?.verdict_summary,
    fallback?.verdict_summary
  );

  return {
    id: pickText(primary?.id, fallback?.id, slug),
    slug,
    name,
    tagline,
    description,
    logo,
    website,
    category,
    pricing,
    features,
    pros,
    cons,
    useCases,
    rating: toNumber(primary?.rating ?? fallback?.rating, 0),
    reviewCount: toInteger(primary?.reviewCount ?? fallback?.reviewCount, 0),
    faq,

    author_name,
    author_role,
    author_image,
    author_bio,
    evaluation_date,
    confidence_level,

    seo_title: pickText(primary?.seo_title, fallback?.seo_title, review?.review_seo_title),
    seo_description: pickText(
      primary?.seo_description,
      fallback?.seo_description,
      review?.review_seo_description
    ),
    keywords: primary?.keywords ?? fallback?.keywords ?? review?.review_keywords,
    screenshots: primary?.screenshots ?? fallback?.screenshots,
    alternatives: primary?.alternatives ?? fallback?.alternatives,
    best_for: primary?.best_for ?? fallback?.best_for ?? review?.review_best_for,
    editorial_score: toNumber(primary?.editorial_score ?? fallback?.editorial_score, 0),
    pricing_score: toNumber(primary?.pricing_score ?? fallback?.pricing_score, 0),
    ease_of_use_score: toNumber(primary?.ease_of_use_score ?? fallback?.ease_of_use_score, 0),
    speed_score: toNumber(primary?.speed_score ?? fallback?.speed_score, 0),
    coverage_score: toNumber(primary?.coverage_score ?? fallback?.coverage_score, 0),
    support_score: toNumber(primary?.support_score ?? fallback?.support_score, 0),
    featured: primary?.featured ?? fallback?.featured ?? false,
    hero_featured: primary?.hero_featured ?? fallback?.hero_featured ?? false,
    homepage_featured: primary?.homepage_featured ?? fallback?.homepage_featured ?? false,
    editor_pick: primary?.editor_pick ?? fallback?.editor_pick ?? false,
    order_priority: toInteger(primary?.order_priority ?? fallback?.order_priority, 0),

    review_slug: pickText(review?.review_slug, reviewSource?.review_slug),
    review_author_name: pickText(review?.review_author_name, reviewSource?.review_author_name),
    review_publish_date: pickText(review?.review_publish_date, reviewSource?.review_publish_date),
    content_markdown,
    verdict_summary,
    rating_breakdown: review?.rating_breakdown ?? reviewSource?.rating_breakdown,
    review_seo_title: pickText(review?.review_seo_title, reviewSource?.review_seo_title),
    review_seo_description: pickText(
      review?.review_seo_description,
      reviewSource?.review_seo_description
    ),
    review_keywords: review?.review_keywords ?? reviewSource?.review_keywords,
    review_best_for: review?.review_best_for ?? reviewSource?.review_best_for,
  } as Tool;
}

async function getDatabaseToolRows(): Promise<DatabaseToolRow[]> {
  const db = supabase;
  if (!db) {
    return [];
  }

  const { data, error } = await db.from("tools").select("*").order("created_at", {
    ascending: false,
  });

  if (error || !data) {
    return [];
  }

  return data as DatabaseToolRow[];
}

async function getDatabaseToolRowBySlug(slug: string): Promise<DatabaseToolRow | null> {
  const db = supabase;
  if (!db) {
    return null;
  }

  const { data, error } = await db
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DatabaseToolRow;
}

async function getDatabaseToolComparisonBySlug(
  slug: string
): Promise<DatabaseToolComparisonRow | null> {
  const db = supabase;
  if (!db) {
    return null;
  }

  const { data, error } = await db
    .from("tool_comparisons")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DatabaseToolComparisonRow;
}

async function getDatabaseToolReviewByToolId(
  toolId: string | number
): Promise<DatabaseToolReviewRow | null> {
  const db = supabase;
  if (!db) {
    return null;
  }

  const { data, error } = await db
    .from("tool_reviews")
    .select("*")
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DatabaseToolReviewRow;
}

async function getDatabaseToolReviewBySlug(
  slug: string
): Promise<DatabaseToolReviewRow | null> {
  const db = supabase;
  if (!db) {
    return null;
  }

  const { data, error } = await db
    .from("tool_reviews")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DatabaseToolReviewRow;
}

function getLegacyToolLike(slug: string): ToolLike | null {
  const ecosystemTool = getRegisteredEcosystemByToolSlug(slug)?.tool as
    | ToolLike
    | undefined;
  const legacyTool = getLegacyToolBySlug(slug) as ToolLike | undefined;

  return ecosystemTool ?? legacyTool ?? null;
}

function getLegacyToolPool(): Tool[] {
  const pool = [...getRegisteredTools(), ...legacyTools];
  const seen = new Map<string, Tool>();

  for (const item of pool) {
    const normalized = buildTool(item as ToolLike);
    if (normalized) {
      seen.set(normalized.slug, normalized);
    }
  }

  return [...seen.values()];
}

function sanitizeSearchTerm(term: string): string {
  return term
    .replace(/[%_]/g, "")
    .replace(/["',]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchFilter(term: string): string {
  const cleaned = sanitizeSearchTerm(term);
  if (!cleaned) {
    return "";
  }

  const likePattern = `%${cleaned}%`;

  return [
    `name.ilike.${likePattern}`,
    `slug.ilike.${likePattern}`,
    `short_description.ilike.${likePattern}`,
    `overview_text.ilike.${likePattern}`,
    `tagline.ilike.${likePattern}`,
    `description.ilike.${likePattern}`,
    `website.ilike.${likePattern}`,
    `affiliate_url.ilike.${likePattern}`,
  ].join(",");
}

async function getPaginatedDatabaseToolRows(
  options: PaginatedToolsQuery = {}
): Promise<{
  rows: DatabaseToolRow[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const db = supabase;
  const requestedPage = Math.max(1, toInteger(options.page ?? 1, 1) || 1);
  const requestedLimit = Math.max(1, Math.min(100, toInteger(options.limit ?? 50, 50) || 50));

  if (!db) {
    return {
      rows: [],
      totalCount: 0,
      page: requestedPage,
      limit: requestedLimit,
      totalPages: 0,
    };
  }

  const normalizedSearch = pickText(options.search);
  const normalizedCategory = pickText(options.category);

  const fetchPage = async (pageNumber: number) => {
    const from = (pageNumber - 1) * requestedLimit;
    const to = from + requestedLimit - 1;

    let query = db.from("tools").select("*", { count: "exact" });

    if (normalizedSearch) {
      const searchFilter = buildSearchFilter(normalizedSearch);
      if (searchFilter) {
        query = query.or(searchFilter);
      }
    }

    if (normalizedCategory && normalizedCategory.toLowerCase() !== "all") {
      const rawCat = normalizedCategory.trim();
      const slugCat = rawCat.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const spaceCat = rawCat.replace(/-/g, " ");

      query = query.or(
        `category.ilike.%${rawCat}%,` +
          `categories.ilike.%${rawCat}%,` +
          `category.ilike.%${slugCat}%,` +
          `categories.ilike.%${slugCat}%,` +
          `category.ilike.%${spaceCat}%,` +
          `categories.ilike.%${spaceCat}%`
      );
    }

    query = query
      .order("featured", { ascending: false })
      .order("order_priority", { ascending: true })
      .order("updated_at", { ascending: false })
      .order("name", { ascending: true })
      .range(from, to);

    const { data, error, count } = await query;

    if (error || !data) {
      return {
        rows: [] as DatabaseToolRow[],
        totalCount: 0,
      };
    }

    return {
      rows: data as DatabaseToolRow[],
      totalCount: count ?? 0,
    };
  };

  const firstPass = await fetchPage(requestedPage);
  let totalCount = firstPass.totalCount;
  let totalPages = totalCount > 0 ? Math.ceil(totalCount / requestedLimit) : 0;
  let page = requestedPage;
  let rows = firstPass.rows;

  if (totalPages > 0 && page > totalPages) {
    page = totalPages;
    const lastPageResult = await fetchPage(page);
    rows = lastPageResult.rows;
    totalCount = lastPageResult.totalCount;
    totalPages = totalCount > 0 ? Math.ceil(totalCount / requestedLimit) : 0;
  }

  return {
    rows,
    totalCount,
    page,
    limit: requestedLimit,
    totalPages,
  };
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) {
    return null;
  }

  const comparisonRow = await getDatabaseToolComparisonBySlug(normalizedSlug);
  if (comparisonRow) {
    const comparisonLike = await comparisonRowToToolLike(comparisonRow);
    return buildTool(comparisonLike, null, null);
  }

  const [databaseRow, legacySource] = await Promise.all([
    getDatabaseToolRowBySlug(normalizedSlug),
    Promise.resolve(getLegacyToolLike(normalizedSlug)),
  ]);

  const databaseLike = databaseRow ? databaseRowToToolLike(databaseRow) : null;

  let reviewLike: ToolLike | null = null;

  if (databaseRow?.id) {
    const reviewByToolId = await getDatabaseToolReviewByToolId(databaseRow.id);
    if (reviewByToolId) {
      reviewLike = reviewRowToToolLike(reviewByToolId);
    }
  }

  if (!reviewLike) {
    const reviewBySlug = await getDatabaseToolReviewBySlug(`${normalizedSlug}-review`);
    if (reviewBySlug) {
      reviewLike = reviewRowToToolLike(reviewBySlug);
    }
  }

  if (!reviewLike) {
    const directReview = await getDatabaseToolReviewBySlug(normalizedSlug);
    if (directReview) {
      reviewLike = reviewRowToToolLike(directReview);
    }
  }

  if (databaseLike) {
    return buildTool(databaseLike, legacySource, reviewLike);
  }

  return buildTool(legacySource, null, reviewLike);
}

export async function getAllTools(): Promise<Tool[]> {
  const legacy = getLegacyToolPool();
  const merged = new Map<string, Tool>();

  for (const tool of legacy) {
    merged.set(tool.slug, tool);
  }

  const databaseRows = await getDatabaseToolRows();

  for (const row of databaseRows) {
    const databaseLike = databaseRowToToolLike(row);
    const fallback = merged.get(row.slug) as ToolLike | undefined;
    const tool = buildTool(databaseLike, fallback);

    if (tool) {
      merged.set(tool.slug, tool);
    }
  }

  return [...merged.values()];
}

export async function getFeaturedTools(limit = 6): Promise<Tool[]> {
  const tools = await getAllTools();

  return [...tools]
    .sort((a, b) => {
      const scoreDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    })
    .slice(0, limit);
}

export async function getToolsBySlugs(slugs: string[]): Promise<Tool[]> {
  const results = await Promise.all(slugs.map((slug) => getToolBySlug(slug)));
  return results.filter(Boolean) as Tool[];
}

export async function getPaginatedTools(
  options: PaginatedToolsQuery = {}
): Promise<PaginatedToolsResult> {
  const { rows, totalCount, page, limit, totalPages } = await getPaginatedDatabaseToolRows(
    options
  );

  const tools = rows
    .map((row) => databaseRowToToolLike(row))
    .map((rowLike) => buildTool(rowLike, null))
    .filter(Boolean) as Tool[];

  return {
    tools,
    totalCount,
    page,
    limit,
    totalPages,
  };
}
