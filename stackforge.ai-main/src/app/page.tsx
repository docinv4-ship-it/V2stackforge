import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Hexagon,
  Layers,
  Box,
  Triangle,
  Sparkles,
  ShieldCheck,
  Globe2,
  TrendingUp,
} from "lucide-react";

type ToolCard = {
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  href: string;
  logoPath: string;
  rankScore: number;
};

type FeatureBlock = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  imageUrl: string;
  imageAlt: string;
  reverse?: boolean;
};

const topRankedTools: ToolCard[] = [
  {
    name: "systeme.io",
    tagline: "All-in-one funnel system",
    description:
      "Built for creators and lean teams that want funnels, email automation, courses, and memberships without stacking extra tools.",
    category: "Marketing Automation",
    tags: ["Funnels", "Email", "Courses"],
    href: "/tools/systeme-io",
    logoPath: "/logos/systemeio.png",
    rankScore: 98,
  },
  {
    name: "HighLevel",
    tagline: "Agency CRM and automation engine",
    description:
      "A serious client workflow platform for agencies that need pipeline control, follow-up automation, and scalable lead management.",
    category: "CRM & Automation",
    tags: ["CRM", "Automation", "Agencies"],
    href: "/tools/highlevel",
    logoPath: "/logos/highlevel.png",
    rankScore: 97,
  },
  {
    name: "Nexcess",
    tagline: "Managed hosting built for growth",
    description:
      "A performance-focused hosting layer for teams that want speed, support, and infrastructure stability without the maintenance drag.",
    category: "Managed Hosting",
    tags: ["Hosting", "Performance", "Support"],
    href: "/tools/nexcess",
    logoPath: "/logos/nexcess.png",
    rankScore: 96,
  },
];

const featureBlocks: FeatureBlock[] = [
  {
    eyebrow: "SaaS Directory",
    title: "Curated software discovery that feels editorial, not cluttered.",
    description:
      "This layout is built to showcase a premium SaaS directory with clear structure, quiet spacing, and strong visual hierarchy. It helps visitors scan the value fast, compare tools cleanly, and move deeper without friction.",
    points: [
      "Clean typography and controlled spacing for a Linear-style reading flow.",
      "Right-side imagery keeps the page visually balanced on desktop.",
      "Responsive stacking preserves readability on mobile without crowding.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    imageAlt: "Professional software dashboard on a laptop screen",
  },
  {
    eyebrow: "Software Review",
    title: "Editorial review blocks designed to feel premium and trustworthy.",
    description:
      "Use this block for content reviews, feature breakdowns, and tool comparisons. The composition keeps the narrative on the left and the supporting visual on the right, which makes the section feel polished and easy to digest.",
    points: [
      "Ideal for review articles, scorecards, and product analysis content.",
      "Strong border treatment gives the section a high-end product feel.",
      "The visual language stays calm, modern, and conversion-friendly.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1768293336571-c48f8765a82d?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    imageAlt: "Clean laptop workspace showing a software interface",
    reverse: true,
  },
  {
    eyebrow: "Tool Evaluation",
    title: "A future-proof evaluation section for comparing digital tools.",
    description:
      "This block is tuned for product evaluation, ranking systems, and decision-making content. It gives the page a confident, structured rhythm while keeping the visuals premium and modern.",
    points: [
      "Works well for score-based ranking and feature-led comparisons.",
      "The image style fits SaaS, analytics, and digital product content.",
      "The layout keeps text and imagery separate for effortless scanning.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1759752394755-1241472b589d?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    imageAlt: "Developer working on a laptop with a dark dashboard interface",
  },
];

const categoryCards = [
  {
    title: "DevTools",
    description: "CI/CD, version control, testing frameworks",
    count: "148 tools",
    icon: Box,
  },
  {
    title: "Productivity",
    description: "Project management, collaboration, automation",
    count: "203 tools",
    icon: Layers,
  },
  {
    title: "System Utilities",
    description: "Monitoring, logging, infrastructure management",
    count: "89 tools",
    icon: Hexagon,
  },
  {
    title: "API Platforms",
    description: "Integration, webhooks, data connectors",
    count: "124 tools",
    icon: Triangle,
  },
];

function BrandLogo({ logoPath, name }: { logoPath: string; name: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <Image
        src={logoPath}
        alt={`${name} logo`}
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
      />
    </div>
  );
}

function ToolRow({ tool }: { tool: ToolCard }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-400 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-4 sm:w-1/4">
        <BrandLogo logoPath={tool.logoPath} name={tool.name} />
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-zinc-900">
            {tool.name}
          </h3>
          <p className="truncate font-mono text-xs tracking-tight text-zinc-500">
            {tool.tagline}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-sm leading-relaxed text-zinc-600">{tool.description}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 sm:items-end">
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-medium text-zinc-700">
          Score {tool.rankScore}
        </span>
        <Link
          href={tool.href}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black font-mono"
        >
          Open Tool
        </Link>
      </div>
    </div>
  );
}

function FeatureSection({
  eyebrow,
  title,
  description,
  points,
  imageUrl,
  imageAlt,
  reverse = false,
}: FeatureBlock) {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={[
            "grid items-center gap-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-2 lg:gap-12",
            reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : "",
          ].join(" ")}
        >
          <div className={reverse ? "lg:pl-2" : ""}>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
              {eyebrow}
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
              {description}
            </p>

            <div className="mt-6 space-y-3">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-900" />
                  </div>
                  <p className="text-sm leading-6 text-zinc-600">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={reverse ? "lg:pr-2" : ""}>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-zinc-50 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100/60 via-transparent to-white/30" />
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-white">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="hero-grid"
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
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="max-w-xl lg:col-span-6">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm font-mono">
                <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
                VERIFIED SOFTWARE MATRIX SYSTEM
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Discover software that actually scales.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-lg">
                Get verified operational paths, engineering-grade reviews, and
                exclusive trial offers for modern software. No guesswork. Just
                tools that work.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-black font-mono"
                >
                  Browse Tools
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#top-ranked"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 font-mono"
                >
                  View Top Ranked
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:col-span-6">
              <div className="relative flex aspect-square w-full max-w-[480px] items-center justify-center overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-4 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-white opacity-50" />
                <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&fm=jpg&q=80&w=1600"
                    alt="Premium software dashboard interface"
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="bg-zinc-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
              Product story
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Built for a SaaS directory, review, and evaluation workflow.
            </h2>
          </div>
        </div>

        {featureBlocks.map((block) => (
          <FeatureSection key={block.title} {...block} />
        ))}
      </div>

      {/* Exclusive Offers */}
      <section id="offers-panel" className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                EXCLUSIVE ACCESS CODES
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Verified Partner Offers
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-100">
                Curated tools highlighted with maximum contrast and clear
                presentation so the section stays readable inside the dark panel.
              </p>
            </div>

            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 font-mono"
            >
              Browse All Core Tools
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {topRankedTools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <BrandLogo logoPath={tool.logoPath} name={tool.name} />
                    <CheckCircle2 className="h-5 w-5 text-zinc-100" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-zinc-300 font-mono">
                    {tool.tagline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-100">
                    {tool.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-mono font-medium text-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={tool.href}
                  className="mt-6 block w-full rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 font-mono shadow"
                >
                  Claim Offer Access
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Matrix */}
      <section className="border-b border-zinc-200/60 bg-zinc-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Browse by Domain
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-900 sm:text-4xl">
              Software Categories
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-400 hover:shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                    <Icon className="h-6 w-6 text-zinc-800" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {card.description}
                  </p>
                  <p className="mt-4 font-mono text-xs text-zinc-400">
                    {card.count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Ranked Matrix */}
      <section id="top-ranked" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
                <TrendingUp className="h-3.5 w-3.5 text-zinc-800" />
                SYSTEM REAL-TIME RANKING INDEX
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-900 sm:text-4xl">
                Top Ranked Tools
              </h2>
            </div>

            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 font-mono shadow-sm"
            >
              Browse Full Live Directory
            </Link>
          </div>

          <div className="space-y-4">
            {topRankedTools.map((tool) => (
              <ToolRow key={tool.name} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Manifesto */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Our Standard
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Why Trust StackForge?
          </h2>
          <div className="mt-8 space-y-6 text-base leading-relaxed text-zinc-600 sm:text-lg">
            <p>
              We do not just list tools. We test them. Every entry in our
              directory passes through an independent verification pipeline
              that checks API stability, uptime SLAs, and real-world performance.
            </p>
            <p>
              No paid placements. No sponsored rankings. Our editorial team
              conducts hands-on testing with the same scrutiny we would apply to
              our own stack. If a tool does not meet our bar, it does not make
              the cut.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-zinc-900" />
              <span className="text-sm font-medium text-zinc-800">
                Independent Testing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-zinc-900" />
              <span className="text-sm font-medium text-zinc-800">
                API Verification
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
                <Hexagon className="h-4 w-4 text-white" />
              </div>
              <span className="font-mono text-sm font-semibold tracking-tight text-zinc-900">
                StackForge AI
              </span>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <Link
                href="/tools"
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Tools
              </Link>
              <Link
                href="/tools"
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Offers
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Submission
              </a>
            </nav>

            <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
              <span>SECURITY CERTIFIED</span>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-6 text-center">
            <p className="font-mono text-xs text-zinc-400">
              © 2026 StackForge AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
