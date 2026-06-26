"use client";

import { useEffect, useMemo, useState } from "react";
import type { SyntheticEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tool } from "@/lib/types";

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

const LOGODEV_TOKEN =
  process.env.NEXT_PUBLIC_LOGODEV_TOKEN || process.env.LOGODEV_TOKEN || "YOUR_TOKEN_HERE";

function normalizeCategories(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeCategories(item));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function buildInitials(name: string): string {
  const parts = normalizeText(name)
    .split(" ")
    .filter(Boolean);

  if (parts.length === 0) return "TT";

  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || parts[0]?.[1] || "";
  const initials = `${first}${second}`.toUpperCase();

  return initials || "TT";
}

function safeDecodeURIComponent(value: string): string {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) return current;
      current = next;
    } catch (_) {
      return current;
    }
  }
  return current;
}

function extractFirstUrlLikeValue(value: unknown): string {
  const input = normalizeText(value);
  if (!input) return "";

  const decoded = safeDecodeURIComponent(input);
  const directUrlMatch = decoded.match(/https?:\/\/[^\s"'<>]+/i);
  if (directUrlMatch?.[0]) {
    return directUrlMatch[0].replace(/[)\].,;]+$/g, "");
  }

  try {
    const asUrl = new URL(decoded);
    const nestedKeys = [
      "destination",
      "url",
      "target",
      "target_url",
      "redirect",
      "redirect_url",
      "u",
      "link",
      "affiliate",
      "affurl",
      "ref",
    ];

    for (const key of nestedKeys) {
      const nested = asUrl.searchParams.get(key);
      if (nested) {
        const nestedUrl = extractFirstUrlLikeValue(nested);
        if (nestedUrl) return nestedUrl;
      }
    }

    const pathParts = asUrl.pathname.split("/").filter(Boolean);
    for (const part of pathParts) {
      const nestedUrl = extractFirstUrlLikeValue(part);
      if (nestedUrl) return nestedUrl;
    }

    return asUrl.toString();
  } catch (_) {
    const pathUrlMatch = decoded.match(/(?:destination|url|target|redirect|link)=([^&\s]+)/i);
    if (pathUrlMatch?.[1]) {
      const nested = extractFirstUrlLikeValue(pathUrlMatch[1]);
      if (nested) return nested;
    }
  }

  return "";
}

function getRegistrableDomain(hostname: string): string {
  const host = normalizeText(hostname).toLowerCase().replace(/^www\./, "");
  if (!host) return "";

  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return host;

  const secondLevelTlds = new Set([
    "co.uk",
    "org.uk",
    "ac.uk",
    "gov.uk",
    "ltd.uk",
    "plc.uk",
    "com.au",
    "net.au",
    "org.au",
    "edu.au",
    "gov.au",
    "com.br",
    "com.mx",
    "com.tr",
    "com.sg",
    "com.ar",
    "com.my",
    "com.tw",
    "com.hk",
    "co.in",
    "firm.in",
    "net.in",
    "org.in",
    "gen.in",
    "ind.in",
    "co.jp",
    "ne.jp",
    "or.jp",
    "go.jp",
    "ac.jp",
    "ad.jp",
    "ed.jp",
    "gr.jp",
    "lg.jp",
    "com.cn",
    "net.cn",
    "org.cn",
    "gov.cn",
    "edu.cn",
    "co.nz",
    "org.nz",
    "govt.nz",
    "ac.nz",
    "maori.nz",
    "iwi.nz",
  ]);

  const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  if (secondLevelTlds.has(lastTwo) && parts.length >= 3) {
    return `${parts[parts.length - 3]}.${lastTwo}`;
  }

  return lastTwo;
}

function extractCleanDomainFromSources(...sources: unknown[]): string {
  for (const source of sources) {
    const url = extractFirstUrlLikeValue(source);
    if (!url) continue;

    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      const domain = getRegistrableDomain(parsed.hostname);
      if (domain) return domain;
    } catch (_) {
      const cleaned = normalizeText(url)
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

function getToolWebsite(tool: Tool): string {
  return normalizeText((tool as any).website || "");
}

function getToolAffiliateLink(tool: Tool): string {
  return normalizeText((tool as any).affiliate_link || "");
}

type LogoKind = "local" | "logodev" | "google";

type LogoCandidate = {
  src: string;
  kind: LogoKind;
  domain: string;
};

function normalizeLogoSrc(src: string): string {
  const cleaned = normalizeText(src);
  if (!cleaned) return "";
  if (cleaned.startsWith("//")) return `https:${cleaned}`;
  return cleaned;
}

function buildLogoCandidatesFromSources(
  logoSource: string,
  websiteSource: string,
  affiliateSource: string
): LogoCandidate[] {
  const domain = extractCleanDomainFromSources(websiteSource, affiliateSource);
  const candidates: LogoCandidate[] = [];

  if (logoSource) {
    candidates.push({
      src: logoSource,
      kind: "local",
      domain,
    });
  }

  if (domain) {
    candidates.push({
      src: `https://img.logo.dev/${domain}?token=${encodeURIComponent(
        LOGODEV_TOKEN
      )}&size=256`,
      kind: "logodev",
      domain,
    });
    candidates.push({
      src: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
      kind: "google",
      domain,
    });
  }

  return candidates;
}

type LogoState = {
  candidateIndex: number;
  visible: boolean;
  useMonogram: boolean;
};

function LogoBlock({ tool, className }: { tool: Tool; className: string }) {
  const websiteSource = getToolWebsite(tool);
  const affiliateSource = getToolAffiliateLink(tool);
  const logoSource = normalizeLogoSrc((tool as any).logo || "");

  const candidates = useMemo(
    () => buildLogoCandidatesFromSources(logoSource, websiteSource, affiliateSource),
    [logoSource, websiteSource, affiliateSource]
  );

  const initials = useMemo(() => buildInitials(tool.name), [tool.name]);

  const [state, setState] = useState<LogoState>({
    candidateIndex: 0,
    visible: false,
    useMonogram: candidates.length === 0,
  });

  useEffect(() => {
    setState({
      candidateIndex: 0,
      visible: false,
      useMonogram: candidates.length === 0,
    });
  }, [candidates.length, tool.slug, logoSource, websiteSource, affiliateSource]);

  const activeCandidate = candidates[state.candidateIndex] || null;

  const goToNextCandidate = () => {
    setState((current) => {
      const nextIndex = current.candidateIndex + 1;
      if (nextIndex >= candidates.length) {
        return {
          candidateIndex: current.candidateIndex,
          visible: false,
          useMonogram: true,
        };
      }
      return {
        candidateIndex: nextIndex,
        visible: false,
        useMonogram: false,
      };
    });
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;

    if (activeCandidate?.kind === "google" && img.naturalWidth <= 16) {
      goToNextCandidate();
      return;
    }

    setState((current) => ({
      ...current,
      visible: true,
      useMonogram: false,
    }));
  };

  const handleError = () => {
    goToNextCandidate();
  };

  return (
    <div
      className={className}
      aria-label={`${tool.name} logo`}
      role="img"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {!state.useMonogram && activeCandidate ? (
        <img
          key={activeCandidate.src}
          src={activeCandidate.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: state.visible ? 1 : 0,
            transition: "opacity 150ms ease-in-out",
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center rounded-2xl border border-zinc-900 bg-zinc-950 text-sm font-bold text-white uppercase"
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function getDisplayValue(tool: Tool, keyA: string, keyB: string): string {
  return normalizeText((tool as any)[keyA] || (tool as any)[keyB] || "");
}

export function ToolCard({ tool, featured = false }: ToolCardProps) {
  const rawCategory = (tool as any).category || (tool as any).categories;
  const categories = normalizeCategories(rawCategory);

  const websiteHref = getToolWebsite(tool) || getToolAffiliateLink(tool) || `/tool/${tool.slug}`;

  const displayTagline = getDisplayValue(tool, "tagline", "short_description");
  const displayDescription = getDisplayValue(tool, "description", "overview_text");

  return (
    <motion.article
      className={[
        "overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md",
        featured ? "border-zinc-300" : "border-zinc-200",
      ].join(" ")}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {featured ? (
            <span className="rounded-lg bg-zinc-900 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex items-start gap-4">
          <LogoBlock tool={tool} className="h-14 w-14" />

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold tracking-tight text-zinc-950 font-[family-name:var(--font-playfair)]">
              <Link href={`/tool/${tool.slug}`} className="transition-colors hover:text-zinc-700">
                {tool.name}
              </Link>
            </h3>

            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-400 line-clamp-2">
              {displayTagline}
            </p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-xl border border-zinc-200/60 bg-zinc-100/80 px-3 py-1 text-xs font-medium text-zinc-800 transition-colors"
              >
                {cat.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        ) : null}

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-600">
          {displayDescription}
        </p>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-zinc-100 pt-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <Link href={`/tool/${tool.slug}`}>Learn More</Link>
          </Button>

          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-black"
          >
            Visit
            <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-90" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
