import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  affiliatePrograms,
  getAffiliateProgramBySlug,
} from "@/lib/data/affiliate-programs";
import { ProgramDetailContent } from "./content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return affiliatePrograms.map((program) => ({
    slug: program.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getAffiliateProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Not Found | StackForge AI",
    };
  }

  return {
    title: `${program.name} - Affiliate Program Details | StackForge AI`,
    description: program.description,
    openGraph: {
      title: `${program.name} - StackForge AI`,
      description: program.description,
      type: "article",
    },
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = getAffiliateProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return <ProgramDetailContent program={program} />;
}
