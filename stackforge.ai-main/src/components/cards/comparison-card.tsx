"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ArrowRight, Trophy } from "lucide-react";
import { Comparison, Tool } from "@/lib/types";
import { tools as staticTools } from "@/lib/data/tools";

interface ComparisonCardProps {
  comparison: Comparison;
}

const LOGODEV_TOKEN =
  process.env.NEXT_PUBLIC_LOGODEV_TOKEN || process.env.LOGODEV_TOKEN || "";

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function extractFirstUrlLikeValue(value: unknown): string {
  const input = normalizeText(value);
  if (!input) return "";

  const directUrlMatch = input.match(/https?:\/\/[^\s"'<>]+/i);
  if (directUrlMatch?.[0]) return directUrlMatch[0].replace(/[)\].,;]+$/g, "");

  return input;
}

function getRegistrableDomain(hostname: string): string {
  const host = normalizeText(hostname).toLowerCase().replace(/^www\./, "");
  if (!host) return "";

  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return host;

  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

function extractCleanDomainFromSources(...sources: unknown[]): string {
  for (const source of sources) {
    const url = extractFirstUrlLikeValue(source);
    if (!url) continue;

    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      const domain = getRegistrableDomain(parsed.hostname);
      if (domain) return domain;
    } catch {
      const cleaned = url
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .toLowerCase()
        .replace(/^www\./, "");

      const domain = getRegistrableDomain(cleaned);
      if (domain) return domain;
    }
  }

  return "";
}

function guessWebsiteFromSlug(slug: string): string {
  const normalized = normalizeText(slug).toLowerCase();

  const knownDomains: Record<string, string> = {
    "systeme-io": "https://systeme.io",
    "systeme.io": "https://systeme.io",
    systeme: "https://systeme.io",
    clickfunnels: "https://www.clickfunnels.com",
    highlevel: "https://www.gohighlevel.com",
    "go-highlevel": "https://www.gohighlevel.com",
    "gohighlevel": "https://www.gohighlevel.com",
    parallels: "https://www.parallels.com",
    "parallels-desktop": "https://www.parallels.com",
    "vmware-fusion": "https://www.vmware.com",
    virtualbox: "https://www.virtualbox.org",
    "liquid-web": "https://www.liquidweb.com",
    liquidweb: "https://www.liquidweb.com",
    nexcess: "https://www.nexcess.net",
    chatgpt: "https://openai.com",
    grok: "https://x.ai",
    claude: "https://www.anthropic.com",
    gemini: "https://gemini.google.com",
    "google-ai-studio": "https://aistudio.google.com",
    "aomei-backupper": "https://www.aomeitech.com",
    boardmix: "https://boardmix.com",
    instarem: "https://www.instarem.com",
    coreldraw: "https://www.coreldraw.com",
    winzip: "https://www.winzip.com",
    easeus: "https://www.easeus.com",
  };

  if (knownDomains[normalized]) {
    return knownDomains[normalized];
  }

  const cleanedSlug = normalized
    .replace(/[^a-z0-9]+/g, "")
    .replace(/\s+/g, "");

  if (!cleanedSlug) return "";

  return `https://${cleanedSlug}.com`;
}

function getToolWebsite(tool: Tool | null, fallbackSlug: string): string {
  const website = normalizeText((tool as any)?.website || (tool as any)?.officialUrl || "");
  if (website) return website;

  return guessWebsiteFromSlug(fallbackSlug);
}

function getToolLogo(tool: Tool | null): string {
  return normalizeText((tool as any)?.logo || "");
}

function getLogoCandidates(tool: Tool | null, fallbackSlug: string): string[] {
  const website = getToolWebsite(tool, fallbackSlug);
  const domain = extractCleanDomainFromSources(website);
  const directLogo = getToolLogo(tool);

  const candidates: string[] = [];

  // 1) directLogo
  if (directLogo) {
    candidates.push(directLogo);
  }

  // 2) clearbit
  if (domain) {
    candidates.push(`https://logo.clearbit.com/${domain}`);

    // 3) google
    candidates.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
    );

    // 4) logo.dev
    if (LOGODEV_TOKEN) {
      candidates.push(
        `https://img.logo.dev/${domain}?token=${encodeURIComponent(LOGODEV_TOKEN)}&size=256`
      );
    }
  }

  return [...new Set(candidates)];
}

function LogoBlock({ tool, fallbackSlug, className }: { tool: Tool; fallbackSlug: string; className: string }) {
  const candidates = useMemo(
    () => getLogoCandidates(tool, fallbackSlug),
    [tool, fallbackSlug]
  );

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setFailed(false);
  }, [candidates.join("|"), tool.slug, fallbackSlug]);

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
              return;
            }

            // Successfully loaded, keep image visible.
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

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  const toolASlug = comparison.tools[0] || "tool-a";
  const toolBSlug = comparison.tools[1] || "tool-b";

  const staticToolA = staticTools.find((t) => t.id === toolASlug || t.slug === toolASlug);
  const staticToolB = staticTools.find((t) => t.id === toolBSlug || t.slug === toolBSlug);

  const titleParts = comparison.title
    .replace(/\s*[:—-]\s*/g, " ")
    .split(/\s+vs\s+|\s+versus\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  const toolA = staticToolA || ({
    slug: toolASlug,
    name: titleParts[0] || titleCase(toolASlug),
    logo: "",
    rating: 4.7,
    website: guessWebsiteFromSlug(toolASlug),
  } as Tool);

  const toolB = staticToolB || ({
    slug: toolBSlug,
    name: titleParts[1] || titleCase(toolBSlug),
    logo: "",
    rating: 4.5,
    website: guessWebsiteFromSlug(toolBSlug),
  } as Tool);

  const toolARating = typeof toolA.rating === "number" ? toolA.rating.toFixed(1) : "4.7";
  const toolBRating = typeof toolB.rating === "number" ? toolB.rating.toFixed(1) : "4.5";

  const toolAScore = Math.round(Number(toolARating) * 20);
  const toolBScore = Math.round(Number(toolBRating) * 20);

  const categoryTag = comparison.category || "SOFTWARE COMPARISON";
  const updateDate = "June 2026";

  const isToolAWinner =
    comparison.verdict !== "depends" &&
    (comparison.verdict === toolASlug || comparison.verdict === toolA.name.toLowerCase());

  const winnerName = isToolAWinner ? toolA.name : toolB.name;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group mx-auto flex w-full max-w-[420px] flex-col justify-between rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.04)]"
    >
      <Link href={`/compare/${comparison.slug}`} className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            <span className="rounded-full border border-zinc-200/60 bg-zinc-50 px-2.5 py-1 text-[9px] tracking-widest text-zinc-500">
              {categoryTag}
            </span>

            <div className="text-right">
              <span className="mb-0.5 block text-[8px] font-medium leading-none text-zinc-400 normal-case">
                UPDATED
              </span>
              <span className="font-black text-zinc-800">{updateDate}</span>
            </div>
          </div>

          <h3 className="mb-6 text-xl font-black leading-tight tracking-tight text-zinc-900 font-mono sm:text-2xl">
            {toolA.name}{" "}
            <span className="text-lg font-normal text-zinc-400 font-sans sm:text-xl">vs</span>{" "}
            {toolB.name}
          </h3>

          <div className="relative mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex min-w-0 flex-col items-center text-center">
              <LogoBlock
                tool={toolA}
                fallbackSlug={toolASlug}
                className="mb-2.5 flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-zinc-200 bg-zinc-50 p-2 shadow-xs transition-all duration-200 group-hover:border-zinc-300"
              />
              <span className="mb-0.5 w-full truncate text-xs font-black text-zinc-900">
                {toolA.name}
              </span>
              <span className="mb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                {toolAScore} Score
              </span>
              <div className="flex items-center gap-0.5 text-[10px] font-bold font-mono text-zinc-500">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span>{toolARating}</span>
              </div>
            </div>

            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-mono font-bold text-zinc-400 shadow-3xs">
              VS
            </div>

            <div className="flex min-w-0 flex-col items-center text-center">
              <LogoBlock
                tool={toolB}
                fallbackSlug={toolBSlug}
                className="mb-2.5 flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-zinc-200 bg-zinc-50 p-2 shadow-xs transition-all duration-200 group-hover:border-zinc-300"
              />
              <span className="mb-0.5 w-full truncate text-xs font-black text-zinc-900">
                {toolB.name}
              </span>
              <span className="mb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                {toolBScore} Score
              </span>
              <div className="flex items-center gap-0.5 text-[10px] font-bold font-mono text-zinc-500">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span>{toolBRating}</span>
              </div>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-4 text-xs">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              <Trophy className="h-3 w-3 text-zinc-500" />
              <span>Editorial Verdict</span>
            </div>
            <p className="font-medium leading-relaxed text-zinc-600">
              <strong className="font-black text-zinc-900">Winner:</strong> {winnerName} —{" "}
              {comparison.verdictSummary ||
                "Optimized structural performance analytics built for core operational scalability benchmarks."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] font-medium text-zinc-400">
          <span className="transition-colors duration-200 group-hover:text-zinc-500">
            Open the full editorial matrix
          </span>
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-2 text-xs font-black tracking-tight text-white shadow-md transition-all duration-200 hover:bg-zinc-900">
            View Matrix
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
