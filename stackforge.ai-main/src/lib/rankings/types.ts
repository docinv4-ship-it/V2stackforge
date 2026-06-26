export type RankingSource = "manual" | "ecosystem";

export type RankingBadge =
  | "Leader"
  | "Best Value"
  | "Beginner Friendly"
  | "Agency Pick"
  | "Fastest Growing"
  | "Top Rated"
  | (string & {});

export type RankingSortKey =
  | "recommended"
  | "score"
  | "alphabetical"
  | "newest"
  | "bestForBeginners"
  | "bestForAgencies"
  | "best-for-beginners"
  | "best-for-agencies";

export interface RankingPricingTier {
  name: string;
  price: number | string;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
}

export interface RankingSourceTool {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  officialUrl?: string;
  trialUrl?: string;
  buyUrl?: string;
  category?: string[] | string;
  categories?: string[] | string;
  pricing?: RankingPricingTier[];
  features?: string[];
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  reviewCount?: number;
  rating?: number;
  quickFacts?: string[];
}

export interface RankingItem {
  rank: number;
  toolSlug: string;
  score: number;
  reasoning: string;
  bestFor?: string;
  badges?: RankingBadge[];
}

export interface RankingDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  items: RankingItem[];
  methodology: string;
  source: RankingSource;
  updatedAt?: string;
}

export interface RankingRow {
  rank: number;
  rankingSlug: string;
  rankingTitle: string;
  category: string;
  categorySlug: string;
  source: RankingSource;
  toolSlug: string;
  name: string;
  logoUrl: string;
  score: number;
  tagline: string;
  bestFor: string;
  badges: RankingBadge[];
  reviewCount: number;
  reviewUrl: string;
  compareUrl: string;
  affiliateUrl: string;
  priceLabel?: string;
  reasoning: string;
}

export interface RankingCategory {
  slug: string;
  title: string;
  description: string;
  rankingCount: number;
  toolCount: number;
  rankings: RankingDefinition[];
}

export interface RankingSearchResult {
  query: string;
  sortBy: RankingSortKey;
  categories: RankingCategory[];
  rankings: RankingDefinition[];
  rows: RankingRow[];
}

export interface RankingSearchInput {
  query?: string;
  categorySlug?: string;
  sortBy?: RankingSortKey;
}
