"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info,
  Scale,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { Comparison, Tool } from "@/lib/types";

interface ComparisonPageContentProps {
  comparison: Comparison;
  tools: Tool[];
}

const LOGODEV_TOKEN = process.env.NEXT_PUBLIC_LOGODEV_TOKEN || "";

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

function summarize(value: string, maxLength = 160): string {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

function getComparisonValue(row: Comparison["tableData"][number], tool: Tool): string {
  return (
    row.values[tool.name] ??
    row.values[tool.slug] ??
    row.values[titleCase(tool.slug)] ??
    Object.values(row.values)[0] ??
    "—"
  );
}

function getHeadlineToolSlug(comparison: Comparison, tools: Tool[]): string {
  if (comparison.verdict !== "depends" && comparison.tools.includes(comparison.verdict)) {
    return comparison.verdict;
  }

  const haystack = normalize(
    [
      comparison.title,
      comparison.description,
      comparison.verdictSummary,
      comparison.recommendation,
      ...(comparison.aliases ?? []),
      ...(comparison.keywords ?? []),
    ].join(" ")
  );

  const matchedTool = tools.find((tool) => haystack.includes(normalize(tool.name)));
  return matchedTool?.slug ?? tools[0]?.slug ?? comparison.tools[0] ?? "";
}

function getQuickRows(comparison: Comparison) {
  return comparison.tableData.slice(0, 3);
}

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function extractDomainFromUrl(value: string): string {
  const input = normalizeText(value);
  if (!input) return "";

  try {
    const normalized =
      input.startsWith("http://") || input.startsWith("https://")
        ? input
        : `https://${input}`;

    const parsed = new URL(normalized);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return input
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .toLowerCase()
      .replace(/^www\./, "");
  }
}

function getToolWebsite(tool: Tool): string {
  return normalizeText(
    (tool as any)?.website ||
      (tool as any)?.officialUrl ||
      (tool as any)?.affiliateUrl ||
      (tool as any)?.affiliate_link ||
      (tool as any)?.buyUrl ||
      ""
  );
}

function getDirectLogoSrc(tool: Tool): string {
  return normalizeText((tool as any)?.logo || "");
}

function getLogoCandidates(tool: Tool): string[] {
  const directLogo = getDirectLogoSrc(tool);
  const domain = extractDomainFromUrl(getToolWebsite(tool));

  const candidates: string[] = [];

  if (directLogo) {
    candidates.push(directLogo);
  }

  if (domain) {
    candidates.push(`https://logo.clearbit.com/${domain}`);
    candidates.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
    );

    if (LOGODEV_TOKEN) {
      candidates.push(
        `https://img.logo.dev/${domain}?token=${encodeURIComponent(LOGODEV_TOKEN)}&size=256`
      );
    }
  }

  return [...new Set(candidates)];
}

function LogoBlock({ tool, className }: { tool: Tool; className: string }) {
  const candidates = useMemo(() => getLogoCandidates(tool), [tool]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setFailed(false);
  }, [candidates.join("|"), tool.slug]);

  const activeCandidate = candidates[candidateIndex] || "";

  const goToNextCandidate = () => {
    setCandidateIndex((current) => {
      const nextIndex = current + 1;
      if (nextIndex >= candidates.length) {
        setFailed(true);
        return current;
      }
      return nextIndex;
    });
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {!failed && activeCandidate ? (
        <img
          key={activeCandidate}
          src={activeCandidate}
          alt={`${tool.name} logo`}
          loading="lazy"
          decoding="async"
          onLoad={(event) => {
            const img = event.currentTarget;

            if (activeCandidate.includes("google.com/s2/favicons") && img.naturalWidth <= 16) {
              goToNextCandidate();
            }
          }}
          onError={goToNextCandidate}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "opacity 150ms ease",
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-zinc-50">
          <div className="h-5 w-5 rounded-full border border-zinc-300 bg-zinc-100" />
        </div>
      )}
    </div>
  );
}

export function ComparisonPageContent({ comparison, tools }: ComparisonPageContentProps) {
  const leftTool = tools[0];
  const rightTool = tools[1];
  const headlineToolSlug = getHeadlineToolSlug(comparison, tools);
  const headlineTool = tools.find((tool) => tool.slug === headlineToolSlug) ?? leftTool;

  const quickRows = getQuickRows(comparison);

  const formattedDate = comparison.updatedAt
    ? new Date(comparison.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "June 2026";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-zinc-950 antialiased">
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-zinc-950 font-mono">
              StackForge <span className="font-normal text-zinc-400">/</span> Intel
            </span>
          </div>

          <div className="hidden items-center gap-8 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 md:flex">
            <Link href="/comparisons" className="transition hover:text-zinc-950">
              All Matrixes
            </Link>
            <Link href="/rankings" className="transition hover:text-zinc-950">
              Rankings
            </Link>
            <Link href="/deals" className="transition hover:text-zinc-950">
              Allocations
            </Link>
          </div>

          <Link
            href="/rankings"
            className="shrink-0 whitespace-nowrap rounded-xl bg-zinc-950 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-black"
          >
            View Rankings
          </Link>
        </div>
      </nav>

      <section className="border-b border-zinc-200 bg-zinc-50/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-100 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            <Scale className="h-3 w-3 text-zinc-600" />
            <span className="truncate max-w-[200px] sm:max-w-none">
              {comparison.category || "Strategic Audit"}
            </span>
            <span className="text-zinc-300">•</span>
            <span>Updated {formattedDate}</span>
          </div>

          <h1 className="font-mono text-3xl font-black leading-none tracking-tight text-zinc-900 sm:text-5xl">
            {comparison.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-mono text-sm leading-relaxed text-zinc-500 sm:text-base">
            {comparison.description}
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                document.getElementById("comparison-table")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black sm:w-auto"
            >
              Analyze Feature Matrix
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-16 space-y-12">
          <div className="border-b border-zinc-200 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Acquisition Targets Overview
            </h2>
          </div>

          <div className="grid gap-12 divide-zinc-200/80 md:grid-cols-2 md:divide-x md:divide-y-0">
            {tools.map((tool, index) => {
              const isWinner = tool.slug === headlineToolSlug;
              const rating = typeof tool.rating === "number" ? tool.rating.toFixed(1) : "—";
              const reviewCount = new Intl.NumberFormat("en-US").format(tool.reviewCount || 0);
              const strengths = comparison.strengths[tool.name] ?? [];
              const cardRows = quickRows.map((row) => ({
                feature: row.feature,
                value: getComparisonValue(row, tool),
              }));

              return (
                <div
                  key={tool.id}
                  className={`flex flex-col justify-between pt-8 md:pt-0 ${
                    index === 1 ? "md:pl-12" : "md:pr-12"
                  }`}
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <LogoBlock
                          tool={tool}
                          className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-1.5 shadow-inner"
                        />
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                            {tool.name}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                isWinner
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border border-zinc-200 bg-zinc-100 text-zinc-500"
                              }`}
                            >
                              {isWinner ? "Recommended Node" : "Alternative Asset"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 font-mono">
                          <span className="text-2xl font-black text-zinc-900">{rating}</span>
                          <Star className="mb-0.5 h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        </div>
                        <p className="font-mono text-[10px] font-medium text-zinc-400">
                          {reviewCount} data points
                        </p>
                      </div>
                    </div>

                    <div className="my-6 space-y-2 border-b border-t border-zinc-100 py-4 font-mono text-xs">
                      {cardRows.map((row, rowIndex) => (
                        <div
                          key={`${tool.slug}-${row.feature}-${rowIndex}`}
                          className="flex justify-between gap-4 py-0.5"
                        >
                          <span className="text-zinc-400">{row.feature}</span>
                          <span className="text-right font-bold text-zinc-900">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900">
                        <ShieldCheck className="h-4 w-4 text-zinc-800" />
                        Operational Signal
                      </div>
                      <p className="font-mono text-xs leading-relaxed text-zinc-600">
                        {summarize(tool.tagline || tool.description, 130)}
                      </p>
                      <div className="grid gap-2 border-t border-zinc-200/60 pt-2">
                        {strengths.slice(0, 3).map((strength, strengthIndex) => (
                          <div
                            key={`${tool.slug}-strength-${strengthIndex}`}
                            className="flex items-start gap-2 text-xs text-zinc-700"
                          >
                            <span className="mr-1 font-bold text-emerald-600">✓</span>
                            <span className="leading-snug">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-xs font-bold uppercase tracking-wider transition font-mono shadow-sm ${
                      isWinner
                        ? "bg-zinc-950 text-white hover:bg-black"
                        : "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                    }`}
                  >
                    {comparison.verdict === "depends" && !isWinner
                      ? `Evaluate ${tool.name}`
                      : `Unlock ${tool.name} Access`}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div
          id="comparison-table"
          className="mb-16 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
        >
          <div className="border-b border-zinc-200 bg-zinc-50/50 p-6">
            <h2 className="text-center text-sm font-bold uppercase tracking-widest text-zinc-900">
              Comprehensive Variable Alignment
            </h2>
          </div>

          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[780px] border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="w-1/3 p-5 font-bold uppercase tracking-wider text-zinc-400">
                    Feature Parameters
                  </th>
                  <th className="w-1/3 border-l border-zinc-100 p-5 text-center font-black text-zinc-900">
                    {leftTool?.name ?? "Tool A"}
                  </th>
                  <th className="w-1/3 border-l border-zinc-100 p-5 text-center font-black text-zinc-900">
                    {rightTool?.name ?? "Tool B"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {comparison.tableData.map((row, rowIndex) => (
                  <tr
                    key={`desktop-${row.feature}-${rowIndex}`}
                    className="transition-colors hover:bg-zinc-50/40"
                  >
                    <td className="p-5 font-bold text-zinc-900">{row.feature}</td>
                    <td className="border-l border-zinc-100 bg-zinc-50/20 p-5 text-center text-zinc-600">
                      {leftTool ? getComparisonValue(row, leftTool) : "—"}
                    </td>
                    <td className="border-l border-zinc-100 p-5 text-center text-zinc-600">
                      {rightTool ? getComparisonValue(row, rightTool) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block divide-y divide-zinc-200 font-mono md:hidden">
            {comparison.tableData.map((row, rowIndex) => (
              <div key={`mobile-row-${rowIndex}`} className="space-y-3 bg-white p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {row.feature}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold uppercase text-zinc-400">
                      {leftTool?.name}
                    </div>
                    <div className="break-words text-xs font-bold text-zinc-900">
                      {leftTool ? getComparisonValue(row, leftTool) : "—"}
                    </div>
                  </div>

                  <div className="space-y-1 border-l border-zinc-100 pl-4">
                    <div className="text-[9px] font-bold uppercase text-zinc-400">
                      {rightTool?.name}
                    </div>
                    <div className="break-words text-xs font-bold text-zinc-800">
                      {rightTool ? getComparisonValue(row, rightTool) : "—"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20 grid gap-12 md:grid-cols-2">
          {tools.map((tool, index) => {
            const strengths = (comparison.strengths[tool.name] ?? []).slice(0, 4);
            const limitations = (comparison.limitations[tool.name] ?? []).slice(0, 4);

            return (
              <div key={`detail-${tool.id}`} className="space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
                >
                  <h3 className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-2 text-sm font-bold uppercase tracking-wider text-zinc-900">
                    {tool.name} Core Strengths
                  </h3>
                  <ul className="space-y-3 font-mono text-xs text-zinc-600">
                    {strengths.map((strength, strengthIndex) => (
                      <li
                        key={`${tool.id}-strength-full-${strengthIndex}`}
                        className="flex gap-2.5"
                      >
                        <span className="font-bold text-emerald-600">✓</span>
                        <span className="leading-relaxed">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
                >
                  <h3 className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-2 text-sm font-bold uppercase tracking-wider text-zinc-900">
                    {tool.name} Architectural Limitations
                  </h3>
                  <ul className="space-y-3 font-mono text-xs text-zinc-600">
                    {limitations.map((limitation, limitationIndex) => (
                      <li
                        key={`${tool.id}-limitation-full-${limitationIndex}`}
                        className="flex gap-2.5"
                      >
                        <span className="font-bold text-red-500">⚠️</span>
                        <span className="leading-relaxed">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                {index === 0 ? (
                  <motion.section
                    className="rounded-2xl border border-zinc-200 bg-white p-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-4 w-4 text-zinc-400" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                          Executive Summary
                        </h4>
                        <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">
                          {summarize(tool.description || tool.tagline || "", 220)}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ) : null}
              </div>
            );
          })}
        </div>

        <motion.section
          className="rounded-3xl border border-zinc-900 bg-zinc-950 p-8 text-center text-white sm:p-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Final Verdict Note
          </div>
          <h2 className="mb-4 font-mono text-2xl font-bold tracking-tight sm:text-4xl">
            Strategic Synthesis
          </h2>
          <p className="mb-6 font-mono text-sm text-zinc-400 sm:text-xl">
            Deploy{" "}
            <span className="font-bold text-white underline underline-offset-4">
              {headlineTool?.name ?? "Primary Option"}
            </span>{" "}
            for optimal operational velocity.
          </p>
          <p className="mx-auto max-w-2xl px-2 font-mono text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {comparison.recommendation}
          </p>

          <div className="mt-10 flex flex-col flex-wrap justify-center gap-4 font-mono text-xs sm:flex-row">
            {tools.map((tool) => (
              <a
                key={`cta-${tool.id}`}
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full rounded-xl px-6 py-3.5 font-bold uppercase tracking-wider shadow-sm transition sm:w-auto ${
                  tool.slug === headlineToolSlug
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {tool.slug === headlineToolSlug
                  ? `Initialize ${tool.name}`
                  : `Evaluate ${tool.name}`}
              </a>
            ))}
          </div>
        </motion.section>
      </div>

      <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-7xl space-y-1 text-center font-mono text-xs text-zinc-400">
          <p>Built for clarity • Framework verified securely by StackForge System Terminal.</p>
          <p className="text-[10px] text-zinc-400">All analytics are dynamic. Data synthesis pipeline live.</p>
        </div>
      </footer>
    </div>
  );
}
