import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import "@/lib/ecosystems";
import { getRegisteredEcosystems } from "@/lib/ecosystems/registry";
import type { EcosystemTutorial } from "@/lib/ecosystems/types";
import { ToolDetailContent } from "./content";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/types";
import { getToolBySlug } from "@/lib/tools/get-tool";
import { ClaimButton } from "@/components/tool-owner/ClaimButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getRegisteredEcosystemByToolSlug(slug: string) {
  return getRegisteredEcosystems().find(
    (ecosystem) => ecosystem.tool.slug === slug || ecosystem.slug === slug
  );
}

async function getResolvedTool(slug: string): Promise<Tool | null> {
  void headers();

  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) {
    return null;
  }

  const baseTool = await getToolBySlug(normalizedSlug);
  if (!baseTool) {
    return null;
  }

  const ecosystem = getRegisteredEcosystemByToolSlug(normalizedSlug);

  return {
    ...baseTool,
    faq: baseTool.faq ?? ecosystem?.faq ?? [],
  } as Tool;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getResolvedTool(slug);

  if (!tool) {
    return {
      title: "Tool Not Found | StackForge AI",
    };
  }

  const description =
    (tool as any).tagline?.trim() ||
    (tool as any).short_description?.trim() ||
    (tool as any).description?.trim() ||
    "";

  return {
    title: `${tool.name} Review - Features, Pricing & Verdict | StackForge AI`,
    description,
    openGraph: {
      title: `${tool.name} Review - StackForge AI`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} Review - StackForge AI`,
      description,
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const tool = await getResolvedTool(slug);
  const ecosystem = getRegisteredEcosystemByToolSlug(slug);

  if (!tool) {
    notFound();
  }

  const tutorials: EcosystemTutorial[] = ecosystem?.tutorials ?? [];

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 min-h-screen relative overflow-hidden space-y-0 block clear-both selection:bg-zinc-800">
      {/* Premium Minimalist Mesh Overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950/20 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-0 inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none z-0" />

      {/* Main Core Render - Pulls content wrapper exactly once */}
      <div className="w-full block clear-both m-0 p-0 relative z-10">
        <ToolDetailContent tool={tool} />
      </div>

      {/* Ownership CTA */}
      <section className="relative z-10 w-full border-t border-zinc-900/80 bg-zinc-950/90 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Vendor Ownership
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Own this profile, verify your company, and manage updates from one dashboard.
              </p>
            </div>

            <ClaimButton
              toolSlug={tool.slug}
              toolId={tool.id}
              toolName={tool.name}
              website={tool.website}
            />
          </div>
        </div>
      </section>

      {/* Lower dynamic tutorials segment mapped accurately */}
      {tutorials.length > 0 && (
        <section className="border-t border-zinc-900 bg-zinc-950/80 relative z-10 py-16 lg:py-20 w-full block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-xl text-[11px] font-bold tracking-wide uppercase text-zinc-400 font-mono">
                <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
                <span>Knowledge Base</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
                Learn {tool.name} Step by Step
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                Practical, system-driven deployment blueprints from the verified documentation ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 border-t border-zinc-900 pt-10 lg:grid-cols-2 lg:gap-x-16">
              {tutorials.map((tutorial) => (
                <article
                  key={tutorial.slug}
                  className="flex flex-col justify-between items-start w-full bg-zinc-900/20 border border-zinc-900/50 rounded-2xl p-6 hover:border-zinc-800/80 transition-all duration-200"
                >
                  <div className="w-full">
                    <h3 className="mb-3 text-lg font-bold text-zinc-50 tracking-tight">
                      {tutorial.title}
                    </h3>

                    {tutorial.summary ? (
                      <p className="text-sm leading-relaxed text-zinc-400 font-normal mb-5">
                        {tutorial.summary}
                      </p>
                    ) : null}

                    {tutorial.intent ? (
                      <div className="mb-6 inline-block rounded-md bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400 font-mono">
                        {tutorial.intent}
                      </div>
                    ) : null}

                    {tutorial.steps?.length ? (
                      <div className="mb-6">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          Execution Path
                        </h4>
                        <ol className="space-y-3">
                          {tutorial.steps.map((step, index) => (
                            <li
                              key={`${tutorial.slug}-step-${index}`}
                              className="flex items-start gap-3 text-sm text-zinc-400"
                            >
                              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-[10px] font-bold text-zinc-300 mt-0.5 font-mono">
                                {index + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}

                    {tutorial.tips?.length ? (
                      <div className="mb-6">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          Operational Tips
                        </h4>
                        <ul className="space-y-2">
                          {tutorial.tips.map((tip, index) => (
                            <li
                              key={`${tutorial.slug}-tip-${index}`}
                              className="text-sm leading-relaxed text-zinc-400 pl-2 border-l-2 border-zinc-800"
                            >
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  {tutorial.cta ? (
                    <Button
                      variant="primary"
                      className="h-10 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all px-5 mt-4 text-xs font-mono font-bold tracking-wide uppercase border-transparent shadow-sm inline-flex items-center"
                      asChild
                    >
                      <Link href={tutorial.cta.href}>
                        <span>{tutorial.cta.label}</span>
                        <ArrowRight className="ml-2 h-3.5 w-3.5 text-zinc-700" />
                      </Link>
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}