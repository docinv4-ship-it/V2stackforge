"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Info, ArrowRight, CheckCircle } from "lucide-react";
import { Ranking, Tool } from "@/lib/types";
import { getToolBySlug } from "@/lib/tools/get-tool";
import { RankingCard } from "@/components/cards/ranking-card";
import { Button } from "@/components/ui/button";

interface RankingDetailContentProps {
  ranking: Ranking;
}

export function RankingDetailContent({ ranking }: RankingDetailContentProps) {
  const [topTool, setTopTool] = useState<Tool | null>(null);
  const topToolSlug = ranking.items[0]?.toolSlug?.trim() ?? "";

  useEffect(() => {
    let isMounted = true;
    async function loadTopTool() {
      if (!topToolSlug) {
        if (isMounted) setTopTool(null);
        return;
      }
      const tool = await getToolBySlug(topToolSlug);
      if (isMounted) {
        setTopTool(tool);
      }
    }
    loadTopTool();
    return () => {
      isMounted = false;
    };
  }, [topToolSlug]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 overflow-x-hidden">
      <section className="relative overflow-hidden bg-white border-b border-zinc-200 py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-5 inline-flex items-center gap-x-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide uppercase text-zinc-700">
              <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
              <span>{ranking.category}</span>
            </div>
          </motion.div>

          <motion.h1 className="mb-5 font-[family-name:var(--font-playfair)] text-4xl font-bold tracking-tighter text-zinc-950 md:text-5xl lg:text-6xl leading-none" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
            {ranking.title}
          </motion.h1>

          <motion.p className="max-w-3xl text-base leading-relaxed text-zinc-600 md:text-lg font-normal" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            {ranking.description}
          </motion.p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="mb-8 border-b border-zinc-200 pb-4" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
            <h2 className="mb-2 font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-zinc-900">
              Our Verified Rankings
            </h2>
            <p className="text-sm text-zinc-500">Based on deep structural analysis, testing run-time metrics, and direct user validation profiles.</p>
          </motion.div>

          {/* ✅ FIXED: Dynamic grid mapped with corrected RankingCard pipeline to load logos */}
          <div className="grid grid-cols-1 gap-6">
            {ranking.items.map((item) => (
              <RankingCard key={item.rank} rankingItem={item} category={ranking.category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-10 shadow-sm" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
            <div className="mb-4 flex items-center gap-2.5">
              <Info className="h-5 w-5 text-zinc-800" />
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-zinc-950">Testing Methodology</h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 font-normal">{ranking.methodology}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div className="border border-zinc-200 bg-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between" initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500 fill-amber-500/10" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Top Rated Choice</span>
                </div>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-2xl font-bold text-zinc-950 tracking-tight">
                  Try {topTool?.name || "Our #1 Choice"} Today
                </h3>
                <p className="mb-5 text-sm text-zinc-600 leading-relaxed">{topTool?.tagline || "Get started with our top-ranked independent software solution choice."}</p>
                {topTool?.pros && topTool.pros.length > 0 && (
                  <ul className="mb-6 space-y-2.5">
                    {topTool.pros.slice(0, 3).map((pro, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-600 leading-normal">
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-zinc-800 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="pt-4 border-t border-zinc-100">
                <a href={topTool?.website || "#"} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-xl bg-zinc-900 text-white hover:bg-black transition-colors text-xs font-medium px-5 py-2.5 shadow-sm">
                    Visit {topTool?.name || "Website"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div className="border border-zinc-200 bg-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between" initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
              <div>
                <h3 className="mb-3 font-[family-name:var(--font-playfair)] text-2xl font-bold text-zinc-950 tracking-tight">Compare Core Matrices</h3>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6">Access comprehensive granular structural datasets across all platforms side-by-side to match custom project scales perfectly.</p>
              </div>
              <div className="pt-4 border-t border-zinc-100">
                <Link href="/tools" className="inline-block w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-xs font-medium px-5 py-2.5 shadow-sm">
                    View All Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
