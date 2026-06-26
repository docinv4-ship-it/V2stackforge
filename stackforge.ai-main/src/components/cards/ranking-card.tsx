"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Award, Medal, ExternalLink, Globe } from "lucide-react";
import { tools } from "@/lib/data/tools";
import { Badge } from "@/components/ui/badge";

const PUBLIC_LOGO_MAP: Record<string, string> = {
  "systeme-io": "/logos/systemeio.png",
  "systeme.io": "/logos/systemeio.png",
  systeme: "/logos/systemeio.png",
  highlevel: "/logos/highlevel.png",
  "go-highlevel": "/logos/highlevel.png",
  "gohighlevel": "/logos/highlevel.png",
  nexcess: "/logos/nexcess.png",
};

function normalizeText(value: unknown): string {
  if (!value) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeSlug(value: unknown): string {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
}

function getPublicLogoSrc(tool: any, rankingItem: any): string {
  const toolSlug = normalizeSlug(tool?.slug || rankingItem?.toolSlug || rankingItem?.slug);
  const toolName = normalizeText(tool?.name || rankingItem?.name || "").toLowerCase();

  if (toolSlug && PUBLIC_LOGO_MAP[toolSlug]) return PUBLIC_LOGO_MAP[toolSlug];

  const normalizedNameKey = toolName.replace(/\s+/g, "").replace(/[^\w.-]/g, "");
  if (normalizedNameKey && PUBLIC_LOGO_MAP[normalizedNameKey]) return PUBLIC_LOGO_MAP[normalizedNameKey];

  return "";
}

function getSecondaryLogoSrc(tool: any, rankingItem: any): string {
  if (tool?.logo && String(tool.logo).trim()) return String(tool.logo).trim();
  if (rankingItem?.logoUrl && String(rankingItem.logoUrl).trim()) return String(rankingItem.logoUrl).trim();
  return "";
}

function formatScore(score: unknown): string {
  if (typeof score === "number") return score.toFixed(1);
  if (typeof score === "string" && score.trim()) return score;
  return "0.0";
}

function getName(tool: any, rankingItem: any): string {
  return normalizeText(tool?.name || rankingItem?.name || rankingItem?.toolSlug || "Tool");
}

function getTagline(tool: any, rankingItem: any): string {
  return normalizeText(
    tool?.tagline ||
      rankingItem?.tagline ||
      tool?.description ||
      rankingItem?.reasoning ||
      "Trusted software ranking entry."
  );
}

function getCategory(tool: any, rankingItem: any): string {
  const toolCategory = Array.isArray(tool?.category) ? tool.category[0] : tool?.category;
  if (typeof toolCategory === "string" && toolCategory.trim()) return toolCategory.replace(/-/g, " ");
  if (rankingItem?.category && String(rankingItem.category).trim()) return String(rankingItem.category);
  return "Marketing & Funnels";
}

function LogoBlock({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
        <Globe className="h-5 w-5 text-zinc-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}

export function RankingCard({ rankingItem, category }: any) {
  const staticTool = tools.find((t) => t.slug === rankingItem.toolSlug);
  const tool = staticTool || rankingItem;

  const name = getName(tool, rankingItem);
  const score = rankingItem.score || tool.rating || rankingItem.rank || 0;
  const reasoning = normalizeText(
    rankingItem.reasoning || tool.description || tool.tagline || ""
  );

  const publicLogo = useMemo(() => getPublicLogoSrc(tool, rankingItem), [tool, rankingItem]);
  const secondaryLogo = useMemo(() => getSecondaryLogoSrc(tool, rankingItem), [tool, rankingItem]);
  const logoSrc = publicLogo || secondaryLogo;

  const rankIcons: Record<number, typeof Trophy> = {
    1: Trophy,
    2: Award,
    3: Medal,
  };

  const RankIcon = rankIcons[rankingItem.rank] || Medal;

  return (
    <motion.article
      className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (rankingItem.rank || 1) * 0.1 }}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
            <LogoBlock src={logoSrc} alt={name} />

            <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-white shadow-sm">
              <RankIcon className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-zinc-900">
                #{rankingItem.rank}
              </span>
              <span className="truncate text-lg font-bold text-zinc-800">{name}</span>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
                {category || "Category"}
              </Badge>

              <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                Score: {formatScore(score)}/10
              </span>
            </div>

            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-600">
              {reasoning}
            </p>

            <Link
              href={`/tool/${rankingItem.toolSlug}`}
              className="inline-flex items-center text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-600"
            >
              View full review
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
