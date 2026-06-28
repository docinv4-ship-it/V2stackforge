import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { getToolBySlug } from "@/lib/tools/get-tool";
import type { Tool } from "@/lib/types";
import { VendorStatusCard } from "@/components/tool-owner/VendorStatusCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getResolvedTool(slug: string): Promise<Tool | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const tool = await getToolBySlug(normalizedSlug);
  return tool ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getResolvedTool(slug);

  if (!tool) {
    return {
      title: "Tool Not Found | StackForge",
    };
  }

  return {
    title: `Claim ${tool.name} | StackForge`,
    description: `Start the verified ownership flow for ${tool.name}.`,
  };
}

export default async function CompanyClaimToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getResolvedTool(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
                Claim this profile
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
                {tool.name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600">
                {tool.tagline || tool.description || "Start the vendor ownership flow for this profile."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/tool/${tool.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
                >
                  View public profile
                </Link>

                <Link
                  href="/company/claim"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Back to claim directory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Company email verification",
                  "Admin approval",
                  "Vendor dashboard access",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-sm font-medium text-zinc-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <VendorStatusCard tool={tool} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">What happens next</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              "Enter your company email inside the claim modal.",
              "Make sure the domain matches the product website.",
              "Wait for approval and the verified badge will appear.",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Step {index + 1}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              asChild
              className="rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-black"
            >
              <Link href={`/tool/${tool.slug}`}>Open public profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
