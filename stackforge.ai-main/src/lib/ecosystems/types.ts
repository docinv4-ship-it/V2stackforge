export type EcosystemContentKind =
  | "tool"
  | "review"
  | "faq"
  | "affiliate"
  | "tutorial"
  | "comparison"
  | "ranking"
  | "deal"
  | "blog";

export interface EcosystemPricingTier {
  name: string;
  price: number | string;
  billing?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
}

export interface EcosystemFaqItem {
  question: string;
  answer: string;
}

export interface EcosystemAuthor {
  name: string;
  bio?: string;
  avatar?: string;
}

export interface EcosystemTool {
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
  categories?: string[];
  pricing?: EcosystemPricingTier[];
  features?: string[];
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  rating?: number;
  reviewCount?: number;
  quickFacts?: string[];
}

export interface EcosystemReview {
  slug: string;
  title: string;
  excerpt?: string;
  verdict?: string;
  author?: EcosystemAuthor;
  score?: Record<string, number>;
  sections?: Array<{
    heading: string;
    body: string[];
  }>;
  pros?: string[];
  cons?: string[];
  bestFor?: string[];
  notBestFor?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface EcosystemAffiliateProgram {
  programName: string;
  affiliateSignupUrl: string;
  trackedOfferUrl?: string;
  commissionRate?: string;
  network?: string;
  payoutNotes?: string[];
  bestFor?: string[];
}

export interface EcosystemTutorial {
  slug: string;
  title: string;
  summary?: string;
  intent?: string;
  steps?: string[];
  tips?: string[];
  cta?: {
    label: string;
    href: string;
  };
}

export interface EcosystemComparison {
  slug: string;
  title: string;
  summary?: string;
  winner?: string;
  verdict?: string;
  recommendation?: string;
  table?: Array<{
    feature: string;
    parallels?: string;
    competitor?: string;
    values?: Record<string, string>;
  }>;
  cta?: {
    label: string;
    href: string;
  };
}

export interface EcosystemRankingItem {
  rank: number;
  name?: string;
  toolSlug?: string;
  score?: number;
  reason?: string;
  bestFor?: string;
  link?: string;
  reasoning?: string;
}

export interface EcosystemRanking {
  slug: string;
  title: string;
  summary?: string;
  methodology?: string;
  category?: string;
  items: EcosystemRankingItem[];
}

export interface EcosystemDeal {
  slug: string;
  title: string;
  summary?: string;
  discount?: string;
  bonus?: string;
  promoWindows?: Array<{
    start: string;
    end: string;
  }>;
  promoUrl?: string;
  upgradeUrl?: string;
  contentAngles?: string[];
  resources?: string[];
  active?: boolean;
  note?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export interface EcosystemBlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: EcosystemAuthor;
  publishedAt?: string;
  readTime?: number;
  featured?: boolean;
}

export interface EcosystemBundle {
  slug: string;
  name: string;
  tool: EcosystemTool;
  review?: EcosystemReview;
  faq?: EcosystemFaqItem[];
  affiliate?: EcosystemAffiliateProgram;
  tutorials?: EcosystemTutorial[];
  comparisons?: EcosystemComparison[];
  rankings?: EcosystemRanking[];
  deals?: EcosystemDeal[];
  blogPosts?: EcosystemBlogPost[];
  searchTerms?: string[];
  metadata?: Record<string, unknown>;
}