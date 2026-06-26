"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { ToolCard } from "@/components/cards/tool-card";
import type { Tool } from "@/lib/types";

interface ToolsListClientProps {
  initialTools: Tool[];
}

const ITEMS_PER_PAGE = 25;

const CORE_GROUP_LABELS = [
  "AI",
  "Writing",
  "Image",
  "Video",
  "Coding",
  "Marketing",
  "Productivity",
  "Design",
  "Business",
  "Education",
  "Voice",
  "Automation",
  "Entertainment",
  "Gaming",
  "Finance",
  "Sales",
  "Analytics",
  "Security",
  "Research",
  "Health",
  "Social",
  "Support",
] as const;

type CoreGroupLabel = (typeof CORE_GROUP_LABELS)[number];
type FilterGroup = "All" | CoreGroupLabel | "Other";

const GROUP_DEFINITIONS: Array<{
  label: CoreGroupLabel;
  terms: readonly (string | RegExp)[];
}> = [
  {
    label: "AI",
    terms: [
      "ai",
      "artificial intelligence",
      "llm",
      "large language model",
      "assistant",
      "chatbot",
      "agent",
      "copilot",
      "prompt",
      "generative",
      "gen ai",
      "machine learning",
      "ml",
      "openai",
      "anthropic",
      "gemini",
      "claude",
      "gpt",
      "model",
      "inference",
    ],
  },
  {
    label: "Writing",
    terms: [
      "writing",
      "writer",
      "copywriting",
      "copy editor",
      "content",
      "blog",
      "article",
      "grammar",
      "text editor",
      "draft",
      "newsletter",
      "script writing",
      "summarizer",
      "rewrite",
      "proofread",
      "writing assistant",
      "article writer",
      "editorial",
    ],
  },
  {
    label: "Image",
    terms: [
      "image",
      "photo",
      "picture",
      "graphic",
      "illustration",
      "art",
      "logo",
      "thumbnail",
      "avatar",
      "background remover",
      "photo editor",
      "image generator",
      "image editing",
      "ai art",
      "design image",
    ],
  },
  {
    label: "Video",
    terms: [
      "video",
      "shorts",
      "reel",
      "reels",
      "animation",
      "subtitle",
      "caption",
      "clip",
      "video editor",
      "screen recorder",
      "motion",
      "video generation",
      "video editing",
      "video ai",
      "stream",
    ],
  },
  {
    label: "Coding",
    terms: [
      "code",
      "coding",
      "developer",
      "devtools",
      "programming",
      "script",
      "api",
      "terminal",
      "database",
      "github",
      "deployment",
      "software",
      "cli",
      "debug",
      "ide",
      "dev",
      "engineering",
      "sdk",
      "framework",
    ],
  },
  {
    label: "Marketing",
    terms: [
      "marketing",
      "seo",
      "email",
      "funnel",
      "sales",
      "crm",
      "ads",
      "campaign",
      "lead",
      "landing page",
      "automation",
      "newsletter",
      "analytics",
      "conversion",
      "growth",
      "promotions",
      "affiliate",
      "customer acquisition",
    ],
  },
  {
    label: "Productivity",
    terms: [
      "productivity",
      "task",
      "todo",
      "notes",
      "calendar",
      "meeting",
      "workspace",
      "project",
      "collaboration",
      "docs",
      "planning",
      "knowledge base",
      "organize",
      "workflow",
      "planner",
      "assistant",
    ],
  },
  {
    label: "Design",
    terms: [
      "design",
      "ui",
      "ux",
      "prototype",
      "wireframe",
      "figma",
      "layout",
      "creative",
      "brand",
      "mockup",
      "prototyping",
      "design system",
      "visual",
      "branding",
    ],
  },
  {
    label: "Business",
    terms: [
      "business",
      "startup",
      "agency",
      "saas",
      "entrepreneur",
      "analytics",
      "operations",
      "management",
      "client",
      "enterprise",
      "revenue",
      "company",
      "team",
      "workflow",
      "b2b",
    ],
  },
  {
    label: "Education",
    terms: [
      "education",
      "learn",
      "learning",
      "course",
      "teacher",
      "student",
      "study",
      "training",
      "classroom",
      "tutor",
      "academy",
      "lesson",
      "tutorial",
      "e-learning",
    ],
  },
  {
    label: "Voice",
    terms: [
      "voice",
      "audio",
      "speech",
      "transcription",
      "podcast",
      "dubbing",
      "tts",
      "text-to-speech",
      "speech-to-text",
      "microphone",
      "voiceover",
      "dictation",
      "sound",
    ],
  },
  {
    label: "Automation",
    terms: [
      "automation",
      "workflow",
      "integration",
      "zap",
      "webhook",
      "orchestration",
      "bot",
      "agent",
      "process",
      "pipeline",
      "trigger",
      "sync",
      "automate",
      "connections",
      "ops",
    ],
  },
  {
    label: "Entertainment",
    terms: [
      "entertainment",
      "fun",
      "game",
      "games",
      "music",
      "memes",
      "social",
      "creator",
      "streaming",
      "fan",
      "community",
      "media",
      "content creator",
      "viral",
      "movie",
      "show",
    ],
  },
  {
    label: "Gaming",
    terms: [
      "gaming",
      "game",
      "games",
      "gameplay",
      "game studio",
      "streaming",
      "esports",
      "player",
      "game design",
      "game ai",
      "npc",
      "level design",
      "unity",
      "unreal",
      "gamer",
    ],
  },
  {
    label: "Finance",
    terms: [
      "finance",
      "financial",
      "accounting",
      "budget",
      "bookkeeping",
      "tax",
      "investment",
      "banking",
      "payment",
      "billing",
      "expense",
      "payroll",
      "invoicing",
      "money",
      "invoice",
    ],
  },
  {
    label: "Sales",
    terms: [
      "sales",
      "pipeline",
      "lead",
      "prospect",
      "outreach",
      "demo",
      "closing",
      "deal",
      "prospecting",
      "cold email",
      "appointment",
      "follow up",
      "follow-up",
      "client acquisition",
      "revenue",
    ],
  },
  {
    label: "Analytics",
    terms: [
      "analytics",
      "report",
      "dashboard",
      "tracking",
      "insights",
      "metrics",
      "data",
      "measurement",
      "conversion rate",
      "performance",
      "statistics",
      "reporting",
      "analysis",
      "kpi",
    ],
  },
  {
    label: "Security",
    terms: [
      "security",
      "privacy",
      "encryption",
      "auth",
      "compliance",
      "threat",
      "vulnerability",
      "password",
      "vault",
      "firewall",
      "access control",
      "secure",
      "protection",
      "identity",
    ],
  },
  {
    label: "Research",
    terms: [
      "research",
      "paper",
      "academic",
      "citation",
      "scholar",
      "literature",
      "survey",
      "report",
      "insights",
      "study",
      "knowledge",
      "analysis",
      "reference",
      "knowledge base",
    ],
  },
  {
    label: "Health",
    terms: [
      "health",
      "medical",
      "wellness",
      "fitness",
      "nutrition",
      "patient",
      "doctor",
      "clinic",
      "care",
      "mental health",
      "therapy",
      "exercise",
      "hospital",
    ],
  },
  {
    label: "Social",
    terms: [
      "social",
      "community",
      "followers",
      "posts",
      "scheduling",
      "engagement",
      "twitter",
      "x",
      "linkedin",
      "instagram",
      "tiktok",
      "post scheduler",
      "social media",
      "creator",
      "audience",
    ],
  },
  {
    label: "Support",
    terms: [
      "support",
      "helpdesk",
      "customer service",
      "ticket",
      "live chat",
      "knowledge base",
      "onboarding",
      "chat support",
      "customer success",
      "faq",
      "help center",
      "agent",
      "resolution",
    ],
  },
];

const FILTER_GROUPS = ["All", ...CORE_GROUP_LABELS, "Other"] as const;

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim().toLowerCase();
}

function collectTextFragments(value: unknown): string[] {
  if (value === null || value === undefined) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTextFragments(item));
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [String(value)];
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((item) =>
      collectTextFragments(item)
    );
  }

  return [];
}

function normalizeCategory(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeCategory(item));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getToolTextBlob(tool: Tool): string {
  const raw = tool as unknown as Record<string, unknown>;

  const fields = [
    raw.name,
    raw.tagline,
    raw.short_description,
    raw.description,
    raw.overview_text,
    raw.content_markdown,
    raw.verdict_summary,
    raw.recommendation,
    raw.best_for,
    raw.review_best_for,
    raw.seo_title,
    raw.seo_description,
    raw.keywords,
    raw.features,
    raw.pros,
    raw.cons,
    raw.useCases,
    raw.use_cases,
    raw.faq,
    raw.faqs,
    raw.pricing,
    raw.pricing_plans,
    raw.pricing_json,
    raw.affiliate_link,
    raw.affiliateUrl,
    raw.website,
    raw.officialUrl,
    raw.trialUrl,
    raw.buyUrl,
    raw.category,
    raw.categories,
    raw.tags,
    raw.topics,
    raw.summary,
  ];

  return normalizeText(fields.flatMap((field) => collectTextFragments(field)).join(" "));
}

function toSearchableText(tool: Tool): string {
  return getToolTextBlob(tool);
}

function getToolFilterGroups(tool: Tool): FilterGroup[] {
  const haystack = getToolTextBlob(tool);
  const groups: FilterGroup[] = [];

  const add = (
    group: FilterGroup,
    tests: readonly (string | RegExp)[]
  ) => {
    const matched = tests.some((test) =>
      typeof test === "string" ? haystack.includes(test) : test.test(haystack)
    );

    if (matched && !groups.includes(group)) {
      groups.push(group);
    }
  };

  for (const group of GROUP_DEFINITIONS) {
    add(group.label, group.terms);
  }

  if (groups.length === 0) {
    groups.push("Other");
  }

  return groups;
}

function buildPaginationPages(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "...")[] = [1];

  if (currentPage > 4) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    if (!pages.includes(page)) {
      pages.push(page);
    }
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export default function ToolsListClient({ initialTools }: ToolsListClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterGroup>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = FILTER_GROUPS;

  const filteredTools = useMemo(() => {
    const search = query.trim().toLowerCase();

    const matchingTools = initialTools.filter((tool) => {
      const searchableText = toSearchableText(tool);
      const toolGroups = getToolFilterGroups(tool);

      const matchesQuery = !search || searchableText.includes(search);
      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Other"
          ? toolGroups.length === 1 && toolGroups[0] === "Other"
          : toolGroups.includes(activeCategory));

      return matchesQuery && matchesCategory;
    });

    if (activeCategory === "Other" && matchingTools.length === 0) {
      return initialTools.filter((tool) => {
        const searchableText = toSearchableText(tool);
        const matchesQuery = !search || searchableText.includes(search);
        return matchesQuery;
      });
    }

    return matchingTools;
  }, [query, activeCategory, initialTools]);

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredTools.slice(startIndex, endIndex);
  }, [filteredTools, currentPage]);

  const visibleFrom = filteredTools.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const visibleTo = Math.min(currentPage * ITEMS_PER_PAGE, filteredTools.length);

  const paginationPages = useMemo(
    () => buildPaginationPages(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 transition-colors focus-within:border-zinc-400">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find tools instantly..."
            className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-900"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        <div className="px-1 text-xs font-medium text-zinc-500">
          Showing {filteredTools.length} of {initialTools.length} tools
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((category) => {
          const active = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={[
                "rounded-xl border px-4 py-1.5 text-xs font-medium tracking-tight transition-all",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900",
              ].join(" ")}
            >
              {category}
            </button>
          );
        })}
      </div>

      <section className="pt-2">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedTools.map((tool, index) => (
            <motion.div
              key={tool.id || tool.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>

        {filteredTools.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
            <p className="text-sm text-zinc-500">No tools matched your search parameters.</p>
          </div>
        ) : null}

        {filteredTools.length > 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-zinc-200 pt-6">
            <div className="text-xs text-zinc-500">
              Showing {visibleFrom}-{visibleTo} of {filteredTools.length} tools
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex h-10 items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>

              <div className="flex items-center gap-2">
                {paginationPages.map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-xs font-medium text-zinc-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={[
                        "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-xs font-medium transition",
                        page === currentPage
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex h-10 items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
