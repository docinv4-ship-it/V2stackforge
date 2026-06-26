"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, ShieldAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FAQSection } from "@/components/ui/faq-section";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/types";

import { ToolHero } from "./components/tool-hero";
import { ToolOverview } from "./components/tool-overview";
import { ToolPricing } from "./components/tool-pricing";

export type PricingPlan = {
  name?: string;
  price?: number | string;
  period?: string;
  billing?: string;
  features?: string[];
  highlighted?: boolean;
};

export type ToolWithOptionalFields = Tool & {
  category?: unknown;
  categories?: unknown;
  pricing?: PricingPlan[];
  features?: string[];
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  content_markdown?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  author_name?: string;
  author_role?: string;
  author_image?: string;
  author_bio?: string;
  evaluation_date?: string;
  confidence_level?: "High" | "Medium" | "Low" | string;
};

interface ToolDetailContentProps {
  tool: Tool;
}

export function normalizeStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeStringArray(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function cleanText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value).trim();
  return "";
}

export function pickText(...values: unknown[]): string {
  for (const value of values) {
    const text = cleanText(value);
    if (text) return text;
  }
  return "";
}

export function getPrimaryCategory(tool: ToolWithOptionalFields): string {
  const categories = normalizeStringArray(tool.category ?? tool.categories);
  if (categories.length > 0) {
    return categories[0].replace(/-/g, " ");
  }
  return "Tool";
}

export function getPlanPriceLabel(plan: PricingPlan): string {
  if (plan.price === 0 || plan.price === "0") return "Free";
  const period = (plan.period ?? plan.billing ?? "").trim();
  if (typeof plan.price === "number") {
    return `$${plan.price}${period ? `/${period}` : ""}`;
  }
  const priceText = String(plan.price).trim();
  return period ? `${priceText}/${period}` : priceText;
}

export function hasFreePlan(pricing: PricingPlan[]): boolean {
  return pricing.some((plan) => plan.price === 0 || plan.price === "0");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getSafeAuthorStars(confidenceLevel: string): number {
  const normalized = confidenceLevel.toLowerCase();
  if (normalized.includes("low")) return 3;
  if (normalized.includes("medium")) return 4;
  return 5;
}

export function ToolDetailContent({ tool }: ToolDetailContentProps) {
  const safeTool = tool as ToolWithOptionalFields;

  const displayTagline = pickText(
    safeTool.tagline,
    (safeTool as any).short_description,
    safeTool.description,
    (safeTool as any).overview_text
  );

  const displayDescription = pickText(
    safeTool.description,
    (safeTool as any).overview_text,
    (safeTool as any).short_description,
    safeTool.tagline
  );

  const displayWebsite = pickText(
    safeTool.website,
    (safeTool as any).affiliate_link,
    (safeTool as any).affiliate_url,
    "#"
  );

  const features = safeTool.features ?? (safeTool as any).key_features ?? [];
  const pros = safeTool.pros ?? [];
  const cons = safeTool.cons ?? [];
  const useCases = safeTool.useCases ?? (safeTool as any).use_cases ?? [];
  const pricing = safeTool.pricing ?? (safeTool as any).pricing_plans ?? [];
  const faqs = safeTool.faq ?? (safeTool as any).faqs ?? [];
  const fullArticleMarkdown = (safeTool as any).content_markdown || (safeTool as any).content || "";

  const rating = typeof safeTool.rating === "number" ? safeTool.rating : 0;
  const reviewCount =
    typeof safeTool.reviewCount === "number" && Number.isFinite(safeTool.reviewCount)
      ? safeTool.reviewCount
      : 0;

  const primaryCategory = getPrimaryCategory(safeTool);
  const firstPlan = pricing[0];
  const startingPrice = firstPlan ? getPlanPriceLabel(firstPlan) : "Custom";
  const freePlan = hasFreePlan(pricing);

  const authorName = pickText(safeTool.author_name) || "StackForge Editorial Team";
  const authorRole = pickText(safeTool.author_role) || "Independent Tool Reviewer";
  const authorBio =
    pickText(safeTool.author_bio) ||
    `Concise, practical review notes for ${safeTool.name}. Focused on product fit, pricing clarity, pros, cons, and real-world usefulness.`;
  const authorImage = pickText(safeTool.author_image);
  const confidenceLevel = pickText(safeTool.confidence_level) || "High";
  const evaluationDate = pickText(safeTool.evaluation_date) || "Active review";
  const authorStars = getSafeAuthorStars(confidenceLevel);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 antialiased overflow-x-hidden">
      <div className="w-full block bg-zinc-950 text-white relative">
        <ToolHero
          safeTool={safeTool}
          displayTagline={displayTagline}
          displayWebsite={displayWebsite}
          rating={rating}
          reviewCount={reviewCount}
          authorName={authorName}
          authorImage={authorImage}
          confidenceLevel={confidenceLevel}
          primaryCategory={primaryCategory}
          startingPrice={startingPrice}
          freePlan={freePlan}
          featuresCount={features.length}
        />
      </div>

      <ToolOverview
        safeTool={safeTool}
        displayDescription={displayDescription}
        evaluationDate={evaluationDate}
        authorName={authorName}
        authorRole={authorRole}
        authorStars={authorStars}
        authorBio={authorBio}
        authorImage={authorImage}
      />

      <motion.section
        className="border-b border-zinc-200 bg-white py-12 lg:py-16 w-full overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-600">
              Capabilities
            </span>
            <h2 className="[font-family:var(--font-playfair)] mt-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Key Architecture Components
            </h2>
          </div>

          {features.length > 0 ? (
            <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={`${feature}-${index}`}
                  className="flex items-start gap-3 border-b border-r border-zinc-200 bg-white p-6 last:border-b-0 sm:last:border-b lg:[&:nth-child(3n)]:border-r-0"
                >
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100">
                    <Check className="h-3 w-3 text-zinc-950" />
                  </div>
                  <span className="text-sm leading-6 text-zinc-700">{feature}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-xs text-zinc-500 shadow-sm">
              No feature matrix parameters isolated yet.
            </div>
          )}
        </div>
      </motion.section>

      {pricing.length > 0 ? (
        <ToolPricing pricing={pricing} displayWebsite={displayWebsite} />
      ) : null}

      <motion.section
        className="border-b border-zinc-200 bg-white py-12 lg:py-16 w-full overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 w-full">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2.5 border-b border-zinc-100 pb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <Check className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700">
                  Operational Strengths
                </h3>
              </div>
              {pros.length > 0 ? (
                <ul className="space-y-3">
                  {pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-950">
                        ✓
                      </span>
                      <span className="leading-normal text-zinc-600">{pro}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500">No positive vector logs verified.</p>
              )}
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2.5 border-b border-zinc-100 pb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-rose-700">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700">
                  System Liabilities
                </h3>
              </div>
              {cons.length > 0 ? (
                <ul className="space-y-3">
                  {cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-950">
                        !
                      </span>
                      <span className="leading-normal text-zinc-600">{con}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500">No friction logs detected during baseline tests.</p>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="border-b border-zinc-200 bg-white py-12 lg:py-16 w-full overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-600">
              Target Flow
            </span>
            <h2 className="[font-family:var(--font-playfair)] mt-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Optimal Workflow Scenarios
            </h2>
          </div>

          {useCases.length > 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden divide-y divide-zinc-100 shadow-sm">
              {useCases.map((useCase, index) => (
                <div key={index} className="p-5 flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-950" />
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 pt-0.5">{useCase}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center text-xs text-zinc-500 shadow-sm">
              No scenario flows documented for this runtime configuration.
            </div>
          )}
        </div>
      </motion.section>

      {fullArticleMarkdown ? (
        <motion.section
          className="border-b border-zinc-200 bg-white py-12 lg:py-16 w-full overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-600">
                In-Depth Review
              </span>
              <h2 className="[font-family:var(--font-playfair)] mt-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
                Complete Editorial Analysis
              </h2>
            </div>

            <div className="prose prose-zinc prose-sm md:prose-base max-w-none text-zinc-600 leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-950 prose-h1:text-3xl prose-h1:md:text-4xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl prose-h2:md:text-3xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-xl prose-h3:md:text-2xl prose-p:mb-4 prose-strong:text-zinc-950 prose-a:font-semibold prose-a:text-blue-500 prose-a:no-underline hover:prose-a:text-blue-400 prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-li:mb-1.5 prose-hr:my-8 prose-hr:border-zinc-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="font-semibold text-blue-500 underline underline-offset-4 decoration-blue-300 hover:text-blue-400"
                      target={
                        typeof props.href === "string" && /^https?:\/\//i.test(props.href)
                          ? "_blank"
                          : props.target
                      }
                      rel={
                        typeof props.href === "string" && /^https?:\/\//i.test(props.href)
                          ? "noreferrer noopener"
                          : props.rel
                      }
                    >
                      {props.children}
                    </a>
                  ),
                  table: ({ node, ...props }) => (
                    <div className="my-6 overflow-x-auto rounded-2xl border border-zinc-200">
                      <table {...props} className="w-full border-collapse text-left" />
                    </div>
                  ),
                  thead: ({ node, ...props }) => <thead {...props} className="bg-zinc-50" />,
                  th: ({ node, ...props }) => (
                    <th
                      {...props}
                      className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700"
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td {...props} className="border-b border-zinc-200 px-4 py-3 text-sm text-zinc-700" />
                  ),
                  tr: ({ node, ...props }) => <tr {...props} className="align-top" />,
                }}
              >
                {fullArticleMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        </motion.section>
      ) : null}

      {faqs.length > 0 ? (
        <motion.section
          className="border-b border-zinc-200 bg-white py-12 lg:py-16 w-full overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-600">
                Knowledge Base
              </span>
              <h2 className="[font-family:var(--font-playfair)] mt-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
                Frequently Queried Execution Logs
              </h2>
            </div>
            <FAQSection faqs={faqs} />
          </div>
        </motion.section>
      ) : null}

      <section className="bg-white py-16 w-full overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-center shadow-sm md:p-12">
            <h2 className="[font-family:var(--font-playfair)] mb-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Initialize System Testing on {safeTool.name}?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-zinc-600">
              Connect your pipelines to {safeTool.name} to confirm scaling throughput parameters under real production conditions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Button
                variant="primary"
                size="lg"
                className="h-10 w-full sm:w-auto rounded-xl bg-zinc-900 px-5 text-xs font-mono uppercase tracking-wider font-bold text-white transition-colors hover:bg-black"
                asChild
              >
                <a href={displayWebsite} target="_blank" rel="noopener noreferrer">
                  Get Started
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-10 w-full sm:w-auto rounded-xl border-zinc-200 bg-white px-5 text-xs font-mono uppercase tracking-wider font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                asChild
              >
                <Link href="/comparisons">
                  Compare Matrix
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
