"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

import { BlogCard } from "@/components/cards/blog-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/data/blog-posts";

const categories = [
  "All",
  "Reviews",
  "Comparisons",
  "Rankings",
  "Guides",
  "Tutorials",
  "Alternatives",
  "Industry Insights",
] as const;

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
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

function makeSearchBlob(post: (typeof blogPosts)[number]): string {
  return normalize(
    [
      post.title,
      post.excerpt,
      post.content,
      post.category,
      post.slug,
    ].join(" ")
  );
}

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All");

  const filteredPosts = useMemo(() => {
    const needle = normalize(query);

    return blogPosts
      .filter((post) => {
        if (activeCategory !== "All" && post.category !== activeCategory) {
          return false;
        }

        if (!needle) return true;

        return makeSearchBlob(post).includes(needle);
      })
      .sort((a, b) => {
        const aTime = new Date(a.publishedAt ?? "1970-01-01").getTime();
        const bTime = new Date(b.publishedAt ?? "1970-01-01").getTime();
        return bTime - aTime;
      });
  }, [query, activeCategory]);

  const featuredPost =
    filteredPosts.find((post) => post.featured) ?? filteredPosts[0] ?? null;

  const spotlightPosts = filteredPosts.filter(
    (post) => post.slug !== featuredPost?.slug
  );

  const reviewCount = filteredPosts.filter((post) => post.category === "Reviews").length;
  const comparisonCount = filteredPosts.filter((post) => post.category === "Comparisons").length;
  const rankingCount = filteredPosts.filter((post) => post.category === "Rankings").length;
  const guideCount =
    filteredPosts.filter((post) => post.category === "Guides" || post.category === "Tutorials").length;

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased selection:bg-violet-500/30">
      <section className="border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_45%),linear-gradient(180deg,#09090b_0%,#0b0c10_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
                <Sparkles className="h-4 w-4" />
                StackForge blog
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Latest insights, reviews, comparisons, and buying guides.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
                Clean, evergreen content for software buyers who want real product
                breakdowns, not filler. Browse reviews, compare tools, and move
                straight to the page that helps you decide faster.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs text-zinc-400">Reviews</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {reviewCount || "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs text-zinc-400">Comparisons</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {comparisonCount || "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs text-zinc-400">Rankings</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {rankingCount || "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs text-zinc-400">Guides</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {guideCount || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-zinc-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search reviews, comparisons, rankings, guides..."
                      className="h-12 w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = category === activeCategory;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm transition",
                        active
                          ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
                          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/5",
                      ].join(" ")}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4"
            >
              {featuredPost ? (
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-cyan-500/10">
                    <div className="relative aspect-[16/10] p-6">
                      <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-medium text-zinc-200">
                        Featured
                      </div>

                      <div className="flex h-full items-end">
                        <div>
                          <Badge
                            variant="outline"
                            className="border-violet-500/30 bg-violet-500/10 text-violet-200"
                          >
                            {featuredPost.category}
                          </Badge>
                          <h2 className="mt-4 max-w-md text-2xl font-semibold tracking-tight text-white md:text-3xl">
                            {featuredPost.title}
                          </h2>
                          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-300">
                            {featuredPost.excerpt}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
                      <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {featuredPost.readTime} min read
                        </span>
                        <span>{formatDate(featuredPost.publishedAt)}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-white transition group-hover:text-violet-300">
                        Open article
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-black/20 p-8 text-center">
                  <BookOpenText className="mx-auto h-9 w-9 text-zinc-500" />
                  <p className="mt-4 text-sm text-zinc-400">No featured post found.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0b0c10]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Editorial reviews",
                description: "Deep product breakdowns with practical pros and cons.",
              },
              {
                title: "Comparison pages",
                description: "Side-by-side analysis that helps readers choose faster.",
              },
              {
                title: "Rankings and lists",
                description: "Clean lists for best-of pages and buying intent.",
              },
              {
                title: "Guides and tutorials",
                description: "How-to content that supports organic search growth.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldCheck className="h-4 w-4 text-violet-300" />
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Latest articles</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Fresh content, filtered by what your readers actually want.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 lg:flex">
              <TrendingUp className="h-4 w-4 text-violet-300" />
              Built for evergreen SEO
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                >
                  <BlogCard post={post} featured={post.featured} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-lg font-semibold text-white">No articles matched your search.</p>
              <p className="mt-2 text-sm text-zinc-400">
                Try a broader keyword or switch the category filter.
              </p>
            </div>
          )}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {["Reviews", "Comparisons", "Rankings", "Guides", "Tutorials", "Alternatives"].map(
              (section) => {
                const items = filteredPosts.filter((post) => post.category === section);

                if (items.length === 0) return null;

                return (
                  <div key={section}>
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{section}</h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          Curated posts for this content lane.
                        </p>
                      </div>
                      <Link
                        href="/blog"
                        className="text-sm text-violet-300 transition hover:text-violet-200"
                      >
                        View all
                      </Link>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {items.slice(0, 3).map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <ShieldCheck className="h-4 w-4 text-violet-300" />
                Editorial standards
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Keep the blog focused on reviews, comparisons, rankings, tutorials,
                and buying guides. That makes the site easier to scale and stronger
                for search intent.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-cyan-500/10 p-6">
              <div className="text-sm font-medium text-white">Newsletter</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Capture recurring readers with a simple weekly update on new reviews
                and tool recommendations.
              </p>
              <form
                className="mt-5 flex flex-col gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Email address"
                  className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-zinc-500"
                />
                <Button variant="primary" size="lg" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-sm font-medium text-white">Affiliate disclosure</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                StackForge may earn commissions from qualifying purchases. Editorial
                direction stays focused on clarity and usefulness.
              </p>
              <Link
                href="/affiliate-disclosure"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition hover:text-violet-200"
              >
                Read disclosure
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
