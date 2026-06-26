export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  website: string;
  category: ToolCategory[];
  pricing: PricingTier[];
  features: string[];
  pros: string[];
  cons: string[];
  useCases: string[];
  rating: number;
  reviewCount: number;
  faq: FAQ[];
}

export type ToolCategory =
  | "funnel-builder"
  | "marketing-automation"
  | "crm"
  | "email-marketing"
  | "sales-funnel"
  | "online-business";

export interface PricingTier {
  name: string;
  price: number | string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Comparison {
  id: string;
  slug: string;
  title: string;
  description: string;
  tools: string[];
  verdict: string;
  verdictSummary: string;
  tableData: ComparisonRow[];
  strengths: Record<string, string[]>;
  limitations: Record<string, string[]>;
  recommendation: string;
  category?: string;
  categorySlug?: string;
  aliases?: string[];
  keywords?: string[];
  updatedAt?: string;
}

export interface ComparisonRow {
  feature: string;
  values: Record<string, string>;
}

export interface ComparisonSearchIndex {
  toolSlug: string;
  toolName: string;
  comparisonSlug: string;
  comparisonTitle: string;
  category: string;
  aliases: string[];
  keywords: string[];
  toolSlugs?: string[];
  summary?: string;
}

export interface Ranking {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  items: RankingItem[];
  methodology: string;
}

export interface RankingItem {
  rank: number;
  toolSlug: string;
  score: number;
  reasoning: string;
  bestFor?: string;
  badges?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export interface Author {
  name: string;
  bio: string;
  avatar: string;
}

export interface AffiliateProgram {
  id: string;
  slug: string;
  toolSlug: string;
  name: string;
  description: string;
  commissionType: string;
  commissionRate: string;
  cookieDuration: string;
  paymentThreshold: string;
  highlights: string[];
  bestFor: string[];
  signupUrl: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SearchItem {
  type: "tool" | "comparison" | "ranking" | "blog" | "program";
  title: string;
  description: string;
  href: string;
  category?: string;
}
