import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparisonPageContent } from "./ComparisonPageContent";
import { getLiveComparisonBySlug } from "@/lib/data/comparisons-live";
import { getToolsBySlugs } from "@/lib/tools/get-tool";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getLiveComparisonBySlug(slug);

  if (!comparison) {
    return {
      title: "Audit Matrix Not Found | StackForge",
    };
  }

  return {
    title: `${comparison.title} | Technical Intel StackForge`,
    description: comparison.description,
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.title,
      description: comparison.description,
    },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = await getLiveComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const tools = await getToolsBySlugs(comparison.tools);

  return <ComparisonPageContent comparison={comparison} tools={tools} />;
}
