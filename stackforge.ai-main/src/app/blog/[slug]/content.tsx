"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import { BlogCard } from "@/components/cards/blog-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/types";

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      items.push({
        id: slugify(trimmed.replace("## ", "")),
        title: trimmed.replace("## ", ""),
        level: 2,
      });
    } else if (trimmed.startsWith("### ")) {
      items.push({
        id: slugify(trimmed.replace("### ", "")),
        title: trimmed.replace("### ", ""),
        level: 3,
      });
    }
  }

  return items;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderContent(content: string): ReactNode[] {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;

    elements.push(
      <p key={`p-${elements.length}`} className="mb-6 text-lg leading-8 text-zinc-300">
        {paragraph.join(" ")}
      </p>
    );
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;

    elements.push(
      <ul key={`ul-${elements.length}`} className="mb-6 space-y-3 pl-5">
        {listItems.map((item, index) => (
          <li key={`${elements.length}-${index}`} className="list-disc text-lg leading-8 text-zinc-300">
            {item}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      const title = trimmed.replace("## ", "");
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          id={slugify(title)}
          className="mb-4 mt-12 border-b border-white/10 pb-3 text-2xl font-semibold tracking-tight text-white"
        >
          {title}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      const title = trimmed.replace("### ", "");
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          id={slugify(title)}
          className="mb-3 mt-8 text-xl font-semibold tracking-tight text-white"
        >
          {title}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      listItems.push(trimmed.replace("- ", ""));
      continue;
    }

    if (trimmed === "") {
      flushParagraph();
      flushList();
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return elements;
}

export function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const toc = extractToc(post.content ?? "");
  const formattedDate = formatDate(post.publishedAt);

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-violet-500/30">
      <section className="border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_40%),linear-gradient(180deg,#09090b_0%,#0b0c10_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-violet-500/30 bg-violet-500/10 text-violet-200"
                >
                  {post.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-zinc-300"
                >
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  {formattedDate}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-zinc-300"
                >
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {post.readTime} min read
                </Badge>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
                {post.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/rankings">
                  <Button variant="primary" size="lg">
                    View rankings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/comparisons">
                  <Button variant="outline" size="lg">
                    Compare tools
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="rounded-[1.6rem] border border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-cyan-500/10 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-widest text-violet-200">
                    Reading guide
                  </span>
                  <BookOpenText className="h-5 w-5 text-violet-200" />
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-200/90">
                  This article is structured for fast scanning, clean SEO, and easy
                  future expansion into deeper review and comparison layers.
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    Quick note
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    StackForge keeps blog content focused on decision-making content:
                    reviews, comparisons, rankings, guides, and tutorials.
                  </p>
                </div>
              </div>

              {toc.length > 0 ? (
                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                    On this page
                  </div>
                  <div className="space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={[
                          "block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 transition hover:border-violet-500/30 hover:bg-white/[0.05]",
                          item.level === 3 ? "ml-4" : "",
                        ].join(" ")}
                      >
                        <span className="inline-flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-violet-300" />
                          {item.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Editorial note
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  No author block on the listing flow. The article page stays brand-led
                  and easy to maintain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="prose prose-invert max-w-none prose-headings:tracking-tight prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-a:text-violet-300">
                {renderContent(post.content ?? "")}
              </div>
            </div>

            {relatedPosts.length > 0 ? (
              <section className="mt-10">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      Related articles
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      Continue into the next decision path.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                    >
                      <BlogCard post={relatedPost} />
                    </motion.div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-sm font-medium text-white">Article summary</div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Clean, readable article structure with no noisy author block and no
                heavy research UI. Easy to extend later with screenshots, custom CTA
                blocks, and TOC updates.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-cyan-500/10 p-6">
              <div className="text-sm font-medium text-white">Primary CTA</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Push readers into the next decision page after they finish the article.
              </p>
              <div className="mt-5 grid gap-3">
                <Link href="/rankings">
                  <Button variant="primary" size="lg" className="w-full">
                    Rankings
                  </Button>
                </Link>
                <Link href="/comparisons">
                  <Button variant="outline" size="lg" className="w-full">
                    Comparisons
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#0b0c10] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Need a faster decision?</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  Use the rankings page for best-of lists and the comparisons page for
                  direct side-by-side decisions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/rankings">
                  <Button variant="primary" size="lg">
                    View rankings
                  </Button>
                </Link>
                <Link href="/comparisons">
                  <Button variant="outline" size="lg">
                    View comparisons
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
