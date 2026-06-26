"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { getInitials } from "../content";

interface ToolOverviewProps {
  safeTool: any;
  displayDescription: string;
  evaluationDate: string;
  authorName: string;
  authorRole: string;
  authorStars: number;
  authorBio: string;
  authorImage?: string;
}

export function ToolOverview({
  safeTool,
  displayDescription,
  evaluationDate,
  authorName,
  authorRole,
  authorStars,
  authorBio,
  authorImage,
}: ToolOverviewProps) {
  return (
    <section className="border-b border-zinc-200 bg-white py-12 lg:py-16 w-full overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-10 lg:grid-cols-3 w-full">
          <div className="lg:col-span-2 space-y-4">
            <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-600 uppercase">
              System Overview
            </span>
            <h2 className="[font-family:var(--font-playfair)] text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
              What is {safeTool.name}?
            </h2>
            <div className="text-sm leading-7 text-zinc-600 whitespace-pre-line">
              {displayDescription}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm self-start">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Review Profile
              </span>
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-600">
                {evaluationDate}
              </span>
            </div>

            <div className="mb-4 flex items-center gap-3.5">
              {authorImage ? (
                <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200">
                  <Image src={authorImage} alt={authorName} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-xs font-bold text-zinc-900">
                  {getInitials(authorName)}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold tracking-tight text-zinc-900">{authorName}</h4>
                <p className="mt-0.5 text-[11px] text-zinc-500">{authorRole}</p>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-1.5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < authorStars ? "fill-current text-amber-500" : "text-zinc-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Editorial Standard
              </span>
            </div>

            <p className="border-l-2 border-zinc-200 pl-3 text-xs leading-relaxed text-zinc-600 italic">
              "{authorBio}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
