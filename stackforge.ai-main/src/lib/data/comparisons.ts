import "@/lib/ecosystems";

import { getRegisteredComparisons } from "@/lib/ecosystems/registry";
import type { Comparison, ComparisonSearchIndex } from "@/lib/types";

type ComparisonRecord = Comparison & {
  aliases?: string[];
  keywords?: string[];
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
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

function buildAliases(comparison: ComparisonRecord): string[] {
  const toolLabels = comparison.tools.map(titleCase);
  const titleParts = comparison.title
    .replace(/\s*[:—-]\s*/g, " ")
    .split(/\s+vs\s+|\s+versus\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  return unique([
    ...(comparison.aliases ?? []),
    comparison.title,
    ...toolLabels,
    titleParts.join(" vs "),
    `${toolLabels[0] ?? comparison.tools[0]} vs ${toolLabels[1] ?? comparison.tools[1] ?? ""}`.trim(),
  ]);
}

function buildKeywords(comparison: ComparisonRecord): string[] {
  const featureTerms = comparison.tableData.flatMap((row) => [
    row.feature,
    ...Object.values(row.values),
  ]);

  const strengthTerms = Object.values(comparison.strengths).flat();
  const limitationTerms = Object.values(comparison.limitations).flat();

  return unique([
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
  ].map(normalize));
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

const baseComparisons: ComparisonRecord[] = [
  {
    id: "systeme-io-vs-clickfunnels",
    slug: "systeme-io-vs-clickfunnels",
    title: "Systeme.io vs ClickFunnels: Which Funnel Builder Is Best for You?",
    description:
      "A comprehensive comparison of Systeme.io and ClickFunnels, analyzing pricing, features, ease of use, and which platform suits different business stages and budgets. We help you decide based on your specific situation.",
    tools: ["systeme-io", "clickfunnels"],
    verdict: "systeme-io",
    verdictSummary:
      "For beginners, solopreneurs, and budget-conscious entrepreneurs, Systeme.io offers exceptional value with its forever-free plan and affordable scaling. For established businesses prioritizing proven conversion methodology, extensive templates, and community support, ClickFunnels remains the industry leader despite the premium price tag.",
    tableData: [
      {
        feature: "Starting Price",
        values: {
          "Systeme.io": "$0 (Free plan)",
          "ClickFunnels": "$147/month",
        },
      },
      {
        feature: "Free Plan",
        values: {
          "Systeme.io": "Yes, forever free",
          "ClickFunnels": "14-day trial only",
        },
      },
      {
        feature: "Cheapest Paid Plan",
        values: {
          "Systeme.io": "$27/month",
          "ClickFunnels": "$147/month",
        },
      },
      {
        feature: "Email Marketing",
        values: {
          "Systeme.io": "Included, full-featured",
          "ClickFunnels": "Included, basic features",
        },
      },
      {
        feature: "Course Hosting",
        values: {
          "Systeme.io": "Yes, included",
          "ClickFunnels": "Yes, membership area",
        },
      },
      {
        feature: "Affiliate Management",
        values: {
          "Systeme.io": "Yes, all plans",
          "ClickFunnels": "Yes, Pro plan and up",
        },
      },
      {
        feature: "Template Library",
        values: {
          "Systeme.io": "Growing selection",
          "ClickFunnels": "Extensive, proven templates",
        },
      },
      {
        feature: "Learning Curve",
        values: {
          "Systeme.io": "Easy, beginner-friendly",
          "ClickFunnels": "Moderate to steep",
        },
      },
      {
        feature: "Community",
        values: {
          "Systeme.io": "Growing community",
          "ClickFunnels": "Large, established",
        },
      },
      {
        feature: "Training Resources",
        values: {
          "Systeme.io": "Help docs and tutorials",
          "ClickFunnels": "FunnelFlix extensive library",
        },
      },
      {
        feature: "Best For",
        values: {
          "Systeme.io": "Beginners and solopreneurs",
          "ClickFunnels": "Established businesses",
        },
      },
    ],
    strengths: {
      "Systeme.io": [
        "Genuinely free plan with real functionality you can build a business on",
        "All-in-one including email, courses, and membership sites",
        "Lower barrier to entry lets you start without investment",
        "Affordable scaling with predictable monthly pricing",
        "Email marketing features exceed ClickFunnels capabilities",
        "Better value for solopreneurs and beginners",
        "No transaction fees on any plan",
        "GDPR compliance built-in as a European company",
      ],
      "ClickFunnels": [
        "Proven, high-converting funnel templates tested on millions in sales",
        "Extensive training methodology (FunnelFlix) teaches funnel marketing",
        "Large community of Funnel Hackers for support and ideas",
        "One-click upsells strategically increase average order value",
        "Established reputation provides credibility and trust",
        "More third-party integrations with other marketing tools",
        "Marketplace for buying and selling funnel templates",
        "Years of optimization and feature development",
      ],
    },
    limitations: {
      "Systeme.io": [
        "Smaller template library than ClickFunnels",
        "Fewer third-party integration options",
        "Community smaller than established ClickFunnels ecosystem",
        "Less emphasis on funnel methodology and training",
      ],
      "ClickFunnels": [
        "No free plan, paid plans start at $147/month",
        "Email features less robust than dedicated platforms",
        "Annual commitment often needed for best pricing",
        "Can feel feature-heavy for simple funnels",
        "Learning curve steeper for beginners",
      ],
    },
    recommendation:
      "Choose Systeme.io if you're a beginner, solopreneur, or want to test online business concepts with zero financial risk. The free plan lets you build a real business before investing. Choose ClickFunnels if you're an established business with budget, focused on funnel optimization, and want access to proven templates, extensive training, and a supportive community of serious funnel marketers.",
    category: "Funnels",
    categorySlug: "funnels",
    aliases: ["Systeme.io vs ClickFunnels", "Systeme vs ClickFunnels", "Funnel builder comparison"],
    keywords: [
      "systeme.io",
      "clickfunnels",
      "funnel builder",
      "best funnel builder",
      "sales funnel",
      "beginner funnel",
      "email marketing",
    ],
    updatedAt: "2026-06-04",
  },
  {
    id: "clickfunnels-vs-highlevel",
    slug: "clickfunnels-vs-highlevel",
    title: "ClickFunnels vs HighLevel: Sales Funnels vs All-in-One CRM",
    description:
      "Comparing ClickFunnels and HighLevel (GoHighLevel) to help you choose between a specialized funnel platform and a comprehensive CRM and marketing automation solution. These platforms serve different primary purposes.",
    tools: ["clickfunnels", "highlevel"],
    verdict: "depends",
    verdictSummary:
      "Choose ClickFunnels if your primary goal is building high-converting sales funnels with proven templates. Choose HighLevel if you need a comprehensive CRM, marketing automation, SMS, calling, and the ability to white-label—especially if you're an agency or need unified communications.",
    tableData: [
      {
        feature: "Primary Focus",
        values: {
          "ClickFunnels": "Sales funnels and conversions",
          "HighLevel": "CRM and marketing automation",
        },
      },
      {
        feature: "Starting Price",
        values: {
          "ClickFunnels": "$147/month",
          "HighLevel": "$97/month",
        },
      },
      {
        feature: "CRM Features",
        values: {
          "ClickFunnels": "Basic contact management",
          "HighLevel": "Full CRM with pipelines",
        },
      },
      {
        feature: "SMS Marketing",
        values: {
          "ClickFunnels": "No native SMS",
          "HighLevel": "Yes, two-way SMS",
        },
      },
      {
        feature: "Phone Calling",
        values: {
          "ClickFunnels": "No calling features",
          "HighLevel": "Yes, with recording",
        },
      },
      {
        feature: "White-Label Option",
        values: {
          "ClickFunnels": "No",
          "HighLevel": "Yes (Agency plans)",
        },
      },
      {
        feature: "Appointment Booking",
        values: {
          "ClickFunnels": "Third-party only",
          "HighLevel": "Native calendar",
        },
      },
      {
        feature: "Template Selection",
        values: {
          "ClickFunnels": "Extensive funnel templates",
          "HighLevel": "Growing template library",
        },
      },
      {
        feature: "Training Resources",
        values: {
          "ClickFunnels": "Comprehensive (FunnelFlix)",
          "HighLevel": "Active community and docs",
        },
      },
    ],
    strengths: {
      "ClickFunnels": [
        "Specialized excellence in high-converting sales funnels",
        "Extensive proven template library tested on real sales",
        "Strong methodology and training ecosystem (FunnelFlix)",
        "One-click upsells strategically designed into the platform",
        "Large community and established support resources",
        "Years of brand reputation and credibility",
        "Marketplace for template sharing and monetization",
        "Focus on funnel optimization without distraction",
      ],
      "HighLevel": [
        "Comprehensive CRM and complete marketing automation",
        "Native two-way SMS and phone calling unique in this space",
        "White-label capability creates agency revenue opportunity",
        "Unlimited contacts on all plans including starter",
        "More affordable entry point at $97/month",
        "Built-in appointment booking and calendar",
        "Reputation management for local businesses",
        "Replaces 10+ separate tools in your stack",
      ],
    },
    limitations: {
      "ClickFunnels": [
        "Limited to funnel-focused functionality",
        "No native SMS or phone communication",
        "Higher starting price at $147/month",
        "No white-label or agency-specific features",
        "CRM functionality basic compared to dedicated solutions",
      ],
      "HighLevel": [
        "Fewer funnel templates than specialized ClickFunnels",
        "Steeper initial learning curve due to feature depth",
        "Email deliverability requires proper configuration",
        "SMS and calling have separate usage fees",
        "Can feel overwhelming for simple funnel needs",
      ],
    },
    recommendation:
      "Choose ClickFunnels for dedicated sales funnel building with proven templates, methodology training, and a focus on conversion optimization. Choose HighLevel if you need comprehensive CRM, SMS communication, phone calling, appointment scheduling, or want to white-label a platform for agency clients. Many agencies use both—ClickFunnels for high-stakes funnels and HighLevel for ongoing client management and communication.",
    category: "Funnels",
    categorySlug: "funnels",
    aliases: ["ClickFunnels vs HighLevel", "Funnels vs CRM", "Sales funnel vs CRM"],
    keywords: [
      "clickfunnels",
      "highlevel",
      "gohighlevel",
      "crm comparison",
      "agency crm",
      "marketing automation",
      "white-label",
    ],
    updatedAt: "2026-06-04",
  },
  {
    id: "systeme-io-vs-highlevel",
    slug: "systeme-io-vs-highlevel",
    title: "Systeme.io vs HighLevel: Beginner-Friendly vs Agency Powerhouse",
    description:
      "An in-depth comparison of Systeme.io and HighLevel, two all-in-one platforms with different target audiences and optimal use cases. Both consolidate multiple tools, but they serve different business needs.",
    tools: ["systeme-io", "highlevel"],
    verdict: "depends",
    verdictSummary:
      "Systeme.io is ideal for beginners, solopreneurs, and course creators who want simplicity, a free starting option, and email marketing plus funnels in one place. HighLevel is better for agencies, local businesses, and users who need robust CRM, SMS, calling, and white-label capabilities.",
    tableData: [
      {
        feature: "Best For",
        values: {
          "Systeme.io": "Beginners and solopreneurs",
          "HighLevel": "Agencies and local businesses",
        },
      },
      {
        feature: "Starting Price",
        values: {
          "Systeme.io": "$0 (Free plan)",
          "HighLevel": "$97/month",
        },
      },
      {
        feature: "Free Plan",
        values: {
          "Systeme.io": "Yes, generous free plan",
          "HighLevel": "14-day trial",
        },
      },
      {
        feature: "White-Label",
        values: {
          "Systeme.io": "No",
          "HighLevel": "Yes (Agency plans)",
        },
      },
      {
        feature: "SMS Marketing",
        values: {
          "Systeme.io": "No",
          "HighLevel": "Yes, two-way SMS",
        },
      },
      {
        feature: "Phone Calling",
        values: {
          "Systeme.io": "No",
          "HighLevel": "Yes, with recording",
        },
      },
      {
        feature: "CRM Features",
        values: {
          "Systeme.io": "Basic contact management",
          "HighLevel": "Full CRM with pipelines",
        },
      },
      {
        feature: "Email Marketing",
        values: {
          "Systeme.io": "Strong email features",
          "HighLevel": "Included, good features",
        },
      },
      {
        feature: "Courses",
        values: {
          "Systeme.io": "Yes, included",
          "HighLevel": "Yes, included",
        },
      },
      {
        feature: "Learning Curve",
        values: {
          "Systeme.io": "Easy, beginner-friendly",
          "HighLevel": "Moderate to steep",
        },
      },
    ],
    strengths: {
      "Systeme.io": [
        "Genuinely free plan with real business value",
        "Easy, intuitive learning curve for beginners",
        "Email marketing features exceed most alternatives",
        "Course hosting included at no extra cost",
        "Affordable growth path with predictable pricing",
        "Perfect for testing ideas at zero risk",
        "Clean, focused interface without overwhelm",
        "GDPR compliance built-in for European users",
      ],
      "HighLevel": [
        "Most comprehensive CRM and automation suite",
        "Native two-way SMS and phone calling",
        "White-label capability enables agency revenue",
        "Unlimited contacts on all plans",
        "Appointment calendar and scheduling built-in",
        "Better suited for managing multiple clients",
        "Reputation management for local businesses",
        "Pipeline management for sales teams",
      ],
    },
    limitations: {
      "Systeme.io": [
        "No SMS or phone communication features",
        "No white-label or agency-specific features",
        "CRM less sophisticated than HighLevel",
        "Fewer integrations with external tools",
        "No built-in appointment scheduling",
      ],
      "HighLevel": [
        "No free plan for risk-free testing",
        "Steeper learning curve initially",
        "May be overkill for simple online business needs",
        "SMS and calling have separate usage costs",
        "Less beginner-friendly than Systeme.io",
      ],
    },
    recommendation:
      "Choose Systeme.io if you're a beginner, course creator, or solopreneur wanting to start free and scale affordably. The free plan and easy learning curve make it perfect for testing concepts. Choose HighLevel if you're an agency, local business, or need robust CRM, SMS marketing, phone communication, and white-label capability. HighLevel excels at managing leads through a full pipeline with multiple communication channels.",
    category: "All-in-One",
    categorySlug: "all-in-one",
    aliases: ["Systeme.io vs HighLevel", "Beginner platform vs agency CRM", "All-in-one comparison"],
    keywords: [
      "systeme.io",
      "highlevel",
      "gohighlevel",
      "beginner friendly",
      "agency platform",
      "all-in-one",
      "crm comparison",
    ],
    updatedAt: "2026-06-04",
  },
];

const registeredComparisons = (getRegisteredComparisons() as ComparisonRecord[]) ?? [];

export const comparisons: ComparisonRecord[] = mergeComparisons(
  baseComparisons,
  registeredComparisons
).map((comparison) => ({
  ...comparison,
  aliases: unique(comparison.aliases ?? []),
  keywords: unique((comparison.keywords ?? []).map(normalize)),
}));

export const comparisonSearchIndex: ComparisonSearchIndex[] = comparisons.map((comparison) =>
  buildSearchIndex(comparison)
);

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((comparison) => comparison.slug === slug);
}

export function getComparisonsForTool(toolId: string): Comparison[] {
  return comparisons.filter((comparison) => comparison.tools.includes(toolId));
}

export function getComparisonSearchIndexBySlug(
  slug: string
): ComparisonSearchIndex | undefined {
  return comparisonSearchIndex.find((entry) => entry.comparisonSlug === slug);
}

export function getComparisonSearchIndexForTool(toolSlug: string): ComparisonSearchIndex[] {
  const needle = normalize(toolSlug);
  return comparisonSearchIndex.filter(
    (entry) =>
      normalize(entry.toolSlug) === needle ||
      entry.toolSlugs?.some((value) => normalize(value) === needle) ||
      entry.aliases.some((alias) => normalize(alias).includes(needle))
  );
}

export function searchComparisons(query: string): Comparison[] {
  const needle = normalize(query);
  if (!needle) {
    return comparisons;
  }

  return comparisons.filter((comparison) => {
    const haystack = searchHaystack(comparison);
    return haystack.includes(needle);
  });
}

export function searchComparisonIndex(query: string): ComparisonSearchIndex[] {
  const needle = normalize(query);
  if (!needle) {
    return comparisonSearchIndex;
  }

  return comparisonSearchIndex.filter((entry) => {
    const haystack = normalize(
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
    );

    return haystack.includes(needle);
  });
}
