import type { Comparison, Ranking, Tool } from "@/lib/types";
import type { EcosystemBundle } from "../types";

import { parallelsTool as rawParallelsTool } from "./tool";
import { parallelsReview } from "./review";
import { parallelsFaq } from "./faq";
import { parallelsAffiliateProgram } from "./affiliate";

import { installWindows11OnMac } from "./tutorials/install-windows-11-on-mac";
import { setupParallelsM3 } from "./tutorials/setup-parallels-m3";
import { gamingOnMacGuide } from "./tutorials/gaming-on-mac-guide";

import { parallelsVsVmware } from "./comparisons/parallels-vs-vmware";
import { parallelsVsVirtualBox } from "./comparisons/parallels-vs-virtualbox";
import { parallelsVsCrossOver } from "./comparisons/parallels-vs-crossover";

import { bestMacVirtualMachines } from "./rankings/best-mac-virtual-machines";
import { bestWindowsOnMacSolutions } from "./rankings/best-windows-on-mac-solutions";

import { parallelsMailingListDiscount } from "./deals/coupon";
import { parallelsBlackFridayWatch } from "./deals/black-friday";

const PARALLELS_BUY_URL = "https://www.parallels.com/products/desktop/buy/";

export const parallelsTool: Tool = {
  id: rawParallelsTool.id,
  slug: rawParallelsTool.slug,
  name: rawParallelsTool.name,
  tagline: rawParallelsTool.tagline,
  description:
    "Parallels Desktop is a Mac-first virtualization platform that lets users run Windows, Linux, or another macOS instance without rebooting. It is designed for people who need a polished Windows-on-Mac workflow, especially on Apple silicon Macs.",
  logo: rawParallelsTool.logo,
  website: rawParallelsTool.website,
  category: [...rawParallelsTool.categories] as unknown as Tool["category"],
  pricing: rawParallelsTool.pricing.map((tier) => ({
    name: tier.name,
    price: tier.price,
    period: tier.period,
    features: [...tier.features],
    highlighted: "highlighted" in tier ? tier.highlighted : undefined,
  })),
  features: [...rawParallelsTool.features],
  pros: [...rawParallelsTool.pros],
  cons: [...rawParallelsTool.cons],
  useCases: [...rawParallelsTool.useCases],
  rating: 4.8,
  reviewCount: 1284,
  faq: parallelsFaq.map((item) => ({
    question: item.question,
    answer: item.answer,
  })),
};

type RawComparison = {
  slug: string;
  title: string;
  summary?: string;
  verdict?: string;
  recommendation?: string;
  winner?: string;
  table: ReadonlyArray<{
    feature: string;
    parallels: string;
    competitor: string;
  }>;
};

function buildComparison(
  raw: RawComparison,
  competitorName: string,
  competitorSlug: string
): Comparison {
  const isParallelsWinner =
    raw.winner?.toLowerCase().includes("parallels") ?? false;

  return {
    id: raw.slug,
    slug: raw.slug,
    title: raw.title,
    description: raw.summary ?? "",
    tools: [parallelsTool.id, competitorSlug],
    verdict: isParallelsWinner ? parallelsTool.id : "depends",
    verdictSummary: raw.verdict ?? raw.recommendation ?? raw.summary ?? "",
    tableData: raw.table.map((row) => ({
      feature: row.feature,
      values: {
        [parallelsTool.name]: row.parallels,
        [competitorName]: row.competitor,
      },
    })),
    strengths: {
      [parallelsTool.name]: [
        "Mac-first experience",
        "Runs Windows without rebooting",
        "Good fit for Apple silicon workflows",
      ],
      [competitorName]: [
        `${competitorName} can still work well for specific use cases.`,
      ],
    },
    limitations: {
      [parallelsTool.name]: [
        "Not a free permanent product",
        "Best on modern Mac hardware",
      ],
      [competitorName]: [
        "May be less convenient for everyday Mac users",
      ],
    },
    recommendation:
      raw.recommendation ??
      raw.verdict ??
      raw.summary ??
      "Choose the option that best matches your workflow.",
  };
}

type RawRankingItem = {
  rank: number;
  name: string;
  reason: string;
  bestFor?: string;
  link?: string;
};

type RawRanking = {
  slug: string;
  title: string;
  summary?: string;
  methodology: string;
  items: ReadonlyArray<RawRankingItem>;
};

function toolSlugFromName(name: string) {
  switch (name.toLowerCase()) {
    case "parallels desktop":
      return "parallels";
    case "vmware fusion":
      return "vmware-fusion";
    case "virtualbox":
      return "virtualbox";
    case "utm":
      return "utm";
    case "crossover":
      return "crossover";
    default:
      return name.toLowerCase().replace(/\s+/g, "-");
  }
}

function buildRanking(raw: RawRanking): Ranking {
  return {
    id: raw.slug,
    slug: raw.slug,
    title: raw.title,
    description: raw.summary ?? "",
    category: "Parallels",
    items: raw.items.map((item) => ({
      rank: item.rank,
      toolSlug: toolSlugFromName(item.name),
      score: Math.max(10 - (item.rank - 1) * 0.5, 1),
      reasoning: item.reason,
    })),
    methodology: raw.methodology,
  };
}

export const parallelsEcosystem = {
  slug: "parallels",
  name: "Parallels Desktop",
  tool: parallelsTool,
  review: parallelsReview,
  faq: [...parallelsFaq],
  affiliateProgram: parallelsAffiliateProgram,
  tutorials: [
    installWindows11OnMac,
    setupParallelsM3,
    gamingOnMacGuide,
  ],
  comparisons: [
    buildComparison(parallelsVsVmware as RawComparison, "VMware Fusion", "vmware-fusion"),
    buildComparison(parallelsVsVirtualBox as RawComparison, "VirtualBox", "virtualbox"),
    buildComparison(parallelsVsCrossOver as RawComparison, "CrossOver", "crossover"),
  ],
  rankings: [
    buildRanking(bestMacVirtualMachines as RawRanking),
    buildRanking(bestWindowsOnMacSolutions as RawRanking),
  ],
  deals: [
    {
      ...parallelsMailingListDiscount,
      promoUrl: PARALLELS_BUY_URL,
      cta: {
        label: "See the official offer",
        href: PARALLELS_BUY_URL,
      },
    },
    {
      ...parallelsBlackFridayWatch,
      cta: {
        label: "No live seasonal deal yet",
        href: PARALLELS_BUY_URL,
      },
    },
  ],
  blogPosts: [],
  searchTerms: [
    "parallels",
    "parallels desktop",
    "windows on mac",
    "apple silicon",
    "virtualization",
  ],
} as unknown as EcosystemBundle;