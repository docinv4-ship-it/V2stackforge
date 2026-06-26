"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { ComparisonRow } from "@/lib/types";

interface ComparisonTableProps {
  tableData: ComparisonRow[];
  toolNames: string[];
}

const LOGODEV_TOKEN =
  process.env.NEXT_PUBLIC_LOGODEV_TOKEN || process.env.LOGODEV_TOKEN || "";

const DOMAIN_MAP: Record<string, string> = {
  systemeio: "systeme.io",
  "systeme-io": "systeme.io",
  "systeme.io": "systeme.io",
  clickfunnels: "clickfunnels.com",
  highlevel: "gohighlevel.com",
  gohighlevel: "gohighlevel.com",
  "go-highlevel": "gohighlevel.com",
  nexcess: "nexcess.com",
  pabbly: "pabbly.com",
  convertkit: "convertkit.com",
  kajabi: "kajabi.com",
  notion: "notion.so",
  asana: "asana.com",
  monday: "monday.com",
  clickup: "clickup.com",
};

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeKey(value: string): string {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9.-]+/g, "");
}

function extractDomainFromToolName(toolName: string): string {
  const normalized = normalizeText(toolName).toLowerCase();
  if (!normalized) return "";

  const key = normalizeKey(normalized);

  if (DOMAIN_MAP[key]) {
    return DOMAIN_MAP[key];
  }

  if (normalized.includes(".")) {
    const directDomain = normalized.replace(/^https?:\/\//i, "").split("/")[0];
    if (directDomain.includes(".")) {
      return directDomain.replace(/^www\./, "");
    }
  }

  const compact = key.replace(/[^a-z0-9]/g, "");
  if (!compact) return "";

  return `${compact}.com`;
}

function buildLogoCandidates(toolName: string): string[] {
  const domain = extractDomainFromToolName(toolName);
  if (!domain) return [];

  const candidates = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    `https://img.logo.dev/${domain}?token=${encodeURIComponent(LOGODEV_TOKEN)}&size=256`,
  ];

  return [...new Set(candidates)];
}

function LogoImage({ toolName }: { toolName: string }) {
  const candidates = useMemo(() => buildLogoCandidates(toolName), [toolName]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setFailed(false);
  }, [candidates.join("|"), toolName]);

  const activeSrc = candidates[candidateIndex] || "";

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
      alt={`${toolName} logo`}
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
      onLoad={(event) => {
        const img = event.currentTarget;

        if (activeSrc.includes("google.com/s2/favicons") && img.naturalWidth <= 16) {
          goToNextCandidate();
        }
      }}
      onError={goToNextCandidate}
    />
  );
}

function isBooleanLike(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "yes" || normalized === "no" || normalized === "true" || normalized === "false";
}

export function ComparisonTable({ tableData, toolNames }: ComparisonTableProps) {
  return (
    <motion.div
      className="glass overflow-hidden overflow-x-auto rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <table className="min-w-[600px] w-full">
        <thead>
          <tr className="border-b border-[#27272a]">
            <th className="px-6 py-4 text-left font-medium text-[#a1a1aa]">
              Feature
            </th>

            {toolNames.map((name) => (
              <th key={name} className="px-6 py-4 text-center font-semibold text-white">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 p-1.5">
                    <LogoImage toolName={name} />
                  </div>
                  <span className="max-w-[140px] truncate text-sm font-semibold text-white">
                    {name}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={index}
              className="border-b border-[#27272a] transition-colors hover:bg-[#1a1b23]/30 last:border-b-0"
            >
              <td className="px-6 py-4 font-medium text-white">
                {row.feature}
              </td>

              {toolNames.map((toolName) => {
                const value = String(row.values[toolName] ?? "");
                const isYes = value === "Yes" || value === "yes" || value === "true";
                const isNo = value === "No" || value === "no" || value === "false";

                return (
                  <td key={toolName} className="px-6 py-4 text-center">
                    {isBooleanLike(value) ? (
                      isYes ? (
                        <Check className="inline-block h-5 w-5 text-green-500" />
                      ) : (
                        <X className="inline-block h-5 w-5 text-red-500" />
                      )
                    ) : (
                      <span className="text-[#a1a1aa]">{value}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
