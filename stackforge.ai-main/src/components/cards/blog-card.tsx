"use client";

import Link from "next/link";
import { ArrowRight, Clock3, CalendarDays, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getAccent(category: string) {
  switch (category) {
    case "Reviews":
      return {
        ring: "border-violet-500/20",
        bg: "from-violet-500/20 via-indigo-500/10 to-cyan-500/10",
        glow: "bg-violet-500/20",
      };
    case "Comparisons":
      return {
        ring: "border-cyan-500/20",
        bg: "from-cyan-500/20 via-sky-500/10 to-indigo-500/10",
        glow: "bg-cyan-500/20",
      };
    case "Rankings":
      return {
        ring: "border-amber-500/20",
        bg: "from-amber-500/20 via-orange-500/10 to-rose-500/10",
        glow: "bg-amber-500/20",
      };
    case "Guides":
    case "Tutorials":
      return {
        ring: "border-emerald-500/20",
        bg: "from-emerald-500/20 via-teal-500/10 to-cyan-500/10",
        glow: "bg-emerald-500/20",
      };
    case "Alternatives":
      return {
        ring: "border-fuchsia-500/20",
        bg: "from-fuchsia-500/20 via-violet-500/10 to-indigo-500/10",
        glow: "bg-fuchsia-500/20",
      };
    default:
      return {
        ring: "border-white/10",
        bg: "from-white/10 via-white/5 to-transparent",
        glow: "bg-white/10",
      };
  }
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const accent = getAccent(post.category);
  const publishedAt = formatDate(post.publishedAt);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className={[
          "h-full overflow-hidden rounded-[2rem] border bg-white/[0.03] transition-all duration-300",
          "hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.045]",
          featured ? `shadow-[0_10px_40px_rgba(0,0,0,0.28)] ${accent.ring}` : "border-white/10",
        ].join(" ")}
      >
        <div className="p-4">
          <div
            className={[
              "relative overflow-hidden rounded-[1.5rem] border",
              accent.ring,
              "bg-gradient-to-br",
              accent.bg,
            ].join(" ")}
          >
            <div className={`absolute -right-8 top-0 h-24 w-24 rounded-full ${accent.glow} blur-3xl`} />
            <div className="relative aspect-[16/10] p-5">
              <div className="flex items-start justify-between gap-3">
                <Badge
                  variant="outline"
                  className="border-white/15 bg-black/20 text-[11px] text-white/80"
                >
                  {post.category}
                </Badge>

                {post.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[10px] font-medium text-white/70">
                    <Sparkles className="h-3 w-3 text-violet-300" />
                    Featured
                  </span>
                ) : null}
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <h3
                  className={[
                    "tracking-tight text-white transition-colors group-hover:text-violet-200",
                    featured ? "text-2xl font-semibold" : "text-xl font-semibold",
                  ].join(" ")}
                >
                  {post.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-200/80 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-1 pt-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {publishedAt}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {post.readTime} min read
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-white transition group-hover:text-violet-300">
              Read
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
