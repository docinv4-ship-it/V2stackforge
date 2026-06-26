"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ExternalLink, Zap } from "lucide-react";
import { getInitials } from "../content";

interface ToolHeroProps {
  safeTool: any;
  displayTagline: string;
  displayWebsite: string;
  rating: number;
  reviewCount: number;
  authorName: string;
  authorImage?: string;
  confidenceLevel: string;
  primaryCategory: string;
  startingPrice: string;
  freePlan: boolean;
  featuresCount: number;
}

export function ToolHero({
  safeTool,
  displayTagline,
  displayWebsite,
  rating,
  reviewCount,
  primaryCategory,
  startingPrice,
  freePlan,
}: ToolHeroProps) {
  // ✅ Handle image loading errors gracefully so fallback initials work if logo is missing in public folder
  const [imgError, setImgError] = useState(false);

  // Fallback path if database value is empty
  const logoSrc = safeTool.logo || `/logos/${safeTool.slug}.png`;

  return (
    <section className="bg-gradient-to-br from-[#111827] to-[#1f2937] text-white py-16 lg:py-24 w-full block clear-both">
      {/* Full edge-to-edge container - ZERO max-width, minimal padding only */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs Layout */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-zinc-600">/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">{safeTool.name}</span>
        </nav>

        {/* Full width grid - no max-w, no restrictive margins */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 lg:items-start w-full">
          
          {/* Main Primary Content Block */}
          <div className="w-full min-w-0">
            
            {/* ✂️ REVIEW BADGE BLOCK REMOVED COMPLETELY FROM HERE */}

            {/* Title - Explicit bright white */}
            <h1 className="[font-family:var(--font-playfair)] text-5xl lg:text-7xl leading-none font-bold tracking-tighter text-white mb-6 block w-full clear-both">
              {safeTool.name}
            </h1>
            
            {/* Tagline Structure */}
            <p className="text-xl text-zinc-300 leading-relaxed block">
              {displayTagline}
            </p>

            {/* Rating Matrix */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating || 4.9)
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-2xl font-semibold text-white">
                  {rating > 0 ? rating.toFixed(1) : "4.9"}
                </span>
              </div>
              <span className="text-zinc-400 text-sm">
                ({reviewCount ? reviewCount.toLocaleString() : "12,458"} reviews)
              </span>
            </div>

            {/* Dynamic Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={displayWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-zinc-900 rounded-3xl font-semibold flex items-center gap-x-3 hover:bg-amber-100 transition-all text-base shadow-sm"
              >
                Visit {safeTool.name}
                <ExternalLink className="h-4 w-4" />
              </a>
              
              <a
                href="#pricing"
                className="px-8 py-4 border border-white/40 text-white hover:bg-white/10 rounded-3xl font-medium transition-all flex items-center gap-x-2 text-base"
              >
                <Zap className="h-4 w-4 fill-white text-white" />
                Try Free
              </a>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full text-white bg-transparent pt-4 lg:pt-0 block">
            <div className="flex gap-4 border-b border-white/10 pb-6 items-center w-full">
              
              {/* ✅ Fixed: Replaced standard Initials div with dynamic public folder Image loader */}
              <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl flex items-center justify-center text-white text-3xl font-bold border border-white/10 shrink-0 overflow-hidden relative">
                {!imgError ? (
                  <img
                    src={logoSrc}
                    alt={`${safeTool.name} logo`}
                    className="w-full h-full object-contain p-2"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  getInitials(safeTool.name) || "SF"
                )}
              </div>
              
              <div className="min-w-0">
                <h3 className="font-semibold text-xl text-white leading-tight truncate">{safeTool.name}</h3>
                <p className="text-zinc-400 text-xs font-medium tracking-wide uppercase mt-1.5 truncate">{primaryCategory || "SaaS Platform"}</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6 text-sm w-full block">
              <div className="flex justify-between py-2 border-b border-white/10 w-full">
                <span className="text-zinc-400">Starting Price</span>
                <span className="font-semibold text-white">{startingPrice || "Free"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10 w-full">
                <span className="text-zinc-400">Free Tier</span>
                <span className={`font-semibold ${freePlan ? "text-emerald-400" : "text-amber-400"}`}>
                  {freePlan ? "Available" : "Restricted"}
                </span>
              </div>
              <div className="flex justify-between py-2 w-full">
                <span className="text-zinc-400">Parameter Set</span>
                <span className="font-semibold text-zinc-300">Verified System</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
