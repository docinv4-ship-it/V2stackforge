"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools/get-tool";
import type { Tool } from "@/lib/types";
import type { RankingRow as RankingRowType } from "@/lib/rankings/types";

type RankingRowProps = {
  row: RankingRowType;
};

const LOGODEV_TOKEN =
  process.env.NEXT_PUBLIC_LOGODEV_TOKEN || process.env.LOGODEV_TOKEN || "";

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function formatReviewCount(value: number | string | undefined): string {
  if (value === undefined || value === null) return "500+";
  if (typeof value === "number") return value.toLocaleString();
  return value;
}

function getFallbackStats(name: string) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("systeme")) {
    return { rating: 4.8, reviewCount: "748", g2Score: "9.5" };
  }

  if (lowerName.includes("clickfunnel")) {
    return { rating: 4.6, reviewCount: "417", g2Score: "9.3" };
  }

  if (lowerName.includes("highlevel") || lowerName.includes("gohighlevel")) {
    return { rating: 4.6, reviewCount: "638", g2Score: "9.4" };
  }

  return { rating: 4.5, reviewCount: "500+", g2Score: "9.0" };
}

function getCategoryLabel(tool: Tool | null, row: RankingRowType): string {
  const toolCategory = Array.isArray(tool?.category) ? tool.category[0] : tool?.category;

  if (typeof toolCategory === "string" && toolCategory.trim()) {
    return toolCategory.replace(/-/g, " ");
  }

  if (row.category && row.category.trim()) {
    return row.category;
  }

  return "Marketing & Funnels";
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
    const cleaned = input
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .toLowerCase()
      .replace(/^www\./, "");

    return cleaned;
  }
}

function getWebsiteDomain(tool: Tool | null, row: RankingRowType): string {
  const websiteCandidates = [
    tool?.website,
    row.affiliateUrl,
    tool?.slug ? `https://${tool.slug}.com` : "",
    row.toolSlug ? `https://${row.toolSlug}.com` : "",
  ];

  for (const candidate of websiteCandidates) {
    const domain = extractDomainFromUrl(normalizeText(candidate));
    if (domain) return domain;
  }

  return "";
}

function getDirectLogoSrc(tool: Tool | null, row: RankingRowType): string {
  if (tool && typeof tool.logo === "string" && tool.logo.trim()) {
    return tool.logo.trim();
  }

  if (row.logoUrl && row.logoUrl.trim()) {
    return row.logoUrl.trim();
  }

  return "";
}

function getLogoCandidates(tool: Tool | null, row: RankingRowType): string[] {
  const domain = getWebsiteDomain(tool, row);
  const directLogo = getDirectLogoSrc(tool, row);

  const candidates: string[] = [];

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

  if (directLogo) {
    candidates.push(directLogo);
  }

  return [...new Set(candidates)];
}

function LogoImage({
  candidates,
  alt,
}: {
  candidates: string[];
  alt: string;
}) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setFailed(false);
  }, [candidates.join("|"), alt]);

  const activeSrc = candidates[candidateIndex] || "";

  if (!activeSrc || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
        <div className="h-5 w-5 rounded-full border border-zinc-300 bg-zinc-100" />
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
      onError={() => {
        const nextIndex = candidateIndex + 1;

        if (nextIndex < candidates.length) {
          setCandidateIndex(nextIndex);
          return;
        }

        setFailed(true);
      }}
    />
  );
}

export function RankingRow({ row }: RankingRowProps) {
  const [tool, setTool] = useState<Tool | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTool() {
      if (!row.toolSlug) return;
      const fetchedTool = await getToolBySlug(row.toolSlug);
      if (mounted) setTool(fetchedTool);
    }

    loadTool();

    return () => {
      mounted = false;
    };
  }, [row.toolSlug]);

  const resolvedName = tool?.name || row.name;
  const resolvedTagline =
    tool?.tagline || row.tagline || "Powerful all-in-one platform for business automation.";
  const resolvedCategory = getCategoryLabel(tool, row);
  const fallbackStats = useMemo(() => getFallbackStats(resolvedName), [resolvedName]);
  const logoCandidates = useMemo(() => getLogoCandidates(tool, row), [tool, row]);

  return (
    <div className="w-full border-b border-zinc-200 bg-white py-6 first:pt-2 last:border-b-0">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <Link href={`/tool/${row.toolSlug}`} className="block shrink-0">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-1.5">
              <LogoImage candidates={logoCandidates} alt={resolvedName} />
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Link href={`/tool/${row.toolSlug}`}>
                <h3 className="truncate text-lg font-bold tracking-tight text-zinc-950">
                  {resolvedName}
                </h3>
              </Link>

              <div className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                Score {row.score || fallbackStats.g2Score}
              </div>
            </div>

            <p className="mt-0.5 text-xs capitalize text-zinc-400">{resolvedCategory}</p>

            <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-zinc-600">
              {resolvedTagline}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="ml-1 text-xs font-bold text-zinc-800">
                  {tool?.rating || fallbackStats.rating}
                </span>
                <span className="ml-0.5 text-xs text-zinc-400">
                  ({formatReviewCount(tool?.reviewCount || fallbackStats.reviewCount)})
                </span>
              </div>

              <span className="h-3 w-[1px] bg-zinc-200" />

              <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">
                Leader 2026
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-row gap-2 border-t border-zinc-100 pt-2 md:w-auto md:flex-col md:border-none md:pt-0 lg:flex-row">
          <Button
            variant="outline"
            className="h-9 w-full rounded-xl border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 md:w-auto"
            asChild
          >
            <Link href={row.compareUrl || `/compare/${row.toolSlug}`}>Compare</Link>
          </Button>

          <Button
            className="h-9 w-full rounded-xl bg-zinc-900 px-4 text-xs font-medium text-white transition-colors hover:bg-black md:w-auto"
            asChild
          >
            <a href={tool?.website || row.affiliateUrl || "#"} target="_blank" rel="noreferrer">
              Visit Website
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
