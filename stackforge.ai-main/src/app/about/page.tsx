"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Layers3,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Scale,
  Globe2,
  Grid3x3,
  MessageSquareMore,
  RefreshCw,
  Wand2,
  CheckCircle2,
} from "lucide-react";

const whatWeDo = [
  {
    title: "AI Tools Directory",
    description:
      "A clean, structured directory built to help people discover useful tools fast without clutter or noise.",
    icon: Grid3x3,
  },
  {
    title: "Rankings",
    description:
      "Editorial ranking lists that help readers compare strong options based on practical usefulness.",
    icon: LineChart,
  },
  {
    title: "Side-by-side Comparisons",
    description:
      "Clear comparison pages that make it easier to understand where one tool is stronger than another.",
    icon: Scale,
  },
  {
    title: "Reviews",
    description:
      "Focused reviews that explain what a tool does well, where it falls short, and who it fits best.",
    icon: BookOpen,
  },
  {
    title: "Categories",
    description:
      "Useful category structure that keeps the directory easy to browse across different use cases.",
    icon: Layers3,
  },
  {
    title: "Search & Filters",
    description:
      "Fast search and simple filters that help users get to the right tools without wasting time.",
    icon: Search,
  },
];

const rankingFactors = [
  "Performance",
  "Features",
  "Pricing",
  "Ease of Use",
  "Community Feedback",
  "Regular Updates",
];

const principles = [
  {
    title: "Independent Research",
    description:
      "We evaluate tools through our own editorial process instead of copying promotional claims.",
    icon: ShieldCheck,
  },
  {
    title: "No Pay-to-Rank",
    description:
      "Rankings are built to stay useful and trustworthy, not to reward the biggest advertiser.",
    icon: Sparkles,
  },
  {
    title: "Transparent Reviews",
    description:
      "We explain strengths and trade-offs clearly so readers can make informed choices.",
    icon: BadgeCheck,
  },
  {
    title: "Continuously Updated Database",
    description:
      "The catalog is meant to stay current as tools change, improve, or ship new features.",
    icon: RefreshCw,
  },
];

const trustSignals = [
  {
    title: "Live updates",
    description:
      "The platform is designed to stay current as tools, pricing, and features evolve.",
    icon: RefreshCw,
  },
  {
    title: "Clean comparison engine",
    description:
      "Comparison views are built for clarity so users can evaluate tools side by side quickly.",
    icon: Scale,
  },
  {
    title: "Fast search",
    description:
      "Search is meant to be direct and efficient, helping users jump to relevant tools in seconds.",
    icon: Search,
  },
  {
    title: "Verified information",
    description:
      "We prioritize structured, readable, and checked information over hype or filler.",
    icon: CheckCircle2,
  },
];

const coverage = [
  "Writing AI",
  "Image AI",
  "Video AI",
  "Coding AI",
  "Marketing AI",
  "Productivity AI",
  "Design AI",
  "Business AI",
  "Education AI",
  "Voice AI",
  "Automation AI",
];

const faqs = [
  {
    question: "How are rankings created?",
    answer:
      "Rankings are based on a structured editorial process that reviews a tool’s practical usefulness, feature depth, pricing, ease of use, and real-world fit for specific users.",
  },
  {
    question: "Are rankings sponsored?",
    answer:
      "No. The goal is to keep rankings useful and trustworthy, with editorial decisions focused on quality and relevance instead of paid placement.",
  },
  {
    question: "How often is data updated?",
    answer:
      "The directory is built to be maintained over time, so tools, rankings, and comparisons can be refreshed as products change.",
  },
  {
    question: "Can I suggest a tool?",
    answer:
      "Yes. New tools can be added to the directory workflow when they fit the platform’s editorial standards and category structure.",
  },
  {
    question: "How do comparisons work?",
    answer:
      "Comparison pages line up tools side by side so readers can quickly see differences in features, pricing, performance, and overall fit.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="about-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm">
                <BookOpen className="h-4 w-4 text-zinc-500" />
                About StackForge AI
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              Helping professionals discover the right AI tools with unbiased rankings,
              comparisons, and reviews.
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
            >
              StackForge AI is built to make AI tool discovery clearer, faster, and more
              trustworthy through structured editorial content and a clean browsing
              experience.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Browse Tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/rankings"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                View Rankings
              </Link>
              <Link
                href="/comparisons"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Compare Tools
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                <Wand2 className="h-6 w-6 text-zinc-700" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Our Mission
                </h2>
              </div>
              <p className="leading-8 text-zinc-600">
                Our mission is simple: make AI tool discovery easy without turning it
                into marketing noise. We want people to find the right tools through
                real research, structured data, and clear editorial judgment.
              </p>
              <p className="mt-4 leading-8 text-zinc-600">
                StackForge AI is designed for readers who care about practical value,
                not hype.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                <BrainCircuit className="h-6 w-6 text-zinc-700" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  What Guides the Platform
                </h2>
              </div>
              <div className="space-y-4 text-zinc-600">
                <p>
                  We structure information so readers can move from discovery to
                  decision with less friction.
                </p>
                <p>
                  Every page is built around clarity, usefulness, and a calm reading
                  flow that stays easy to scan.
                </p>
                <p>
                  The long-term focus is simple: keep the directory dependable as the
                  AI landscape keeps changing.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              What We Do
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              A clean system for discovering, comparing, and reviewing AI tools
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {whatWeDo.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                    <Icon className="h-6 w-6 text-zinc-700" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-zinc-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Rankings Work */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                <LineChart className="h-6 w-6 text-zinc-700" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  How Rankings Work
                </h2>
              </div>
              <p className="leading-8 text-zinc-600">
                Rankings are meant to reflect practical value, not empty popularity. We
                look at a tool through a structured editorial lens and keep the criteria
                focused on what matters most to real users.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {rankingFactors.map((factor) => (
                  <span
                    key={factor}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                <Scale className="h-6 w-6 text-zinc-700" />
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Ranking Principles
                </h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Clear feature analysis",
                  "Pricing context that helps real decision-making",
                  "Ease-of-use checks for different user levels",
                  "Community feedback where it adds useful signal",
                  "Regular review updates when tools change",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-800" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Our Principles
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Editorial standards that keep the platform trustworthy
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                    <Icon className="h-6 w-6 text-zinc-700" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-zinc-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Trust */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Why Trust StackForge
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Built for clarity, speed, and dependable information
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustSignals.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white">
                    <Icon className="h-6 w-6 text-zinc-700" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-zinc-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Our Coverage
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Coverage across the AI ecosystem
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {coverage.map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Frequently Asked Questions
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Common questions about the platform
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="text-base font-semibold tracking-tight text-zinc-900">
                    {faq.question}
                  </span>
                  <span className="rounded-full border border-zinc-200 bg-white p-1.5 text-zinc-500 transition group-open:rotate-45">
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 leading-7 text-zinc-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Next Step
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Explore the directory, rankings, or comparisons
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-600">
              StackForge AI is built to stay clean, useful, and easy to navigate as the
              platform grows.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Browse Tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/rankings"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                View Rankings
              </Link>
              <Link
                href="/comparisons"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Compare Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
