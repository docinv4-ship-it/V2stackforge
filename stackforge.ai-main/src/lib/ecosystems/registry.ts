import type {
  EcosystemBundle,
  EcosystemBlogPost,
  EcosystemComparison,
  EcosystemDeal,
  EcosystemRanking,
  EcosystemReview,
  EcosystemTutorial,
} from "./types";
import type { Comparison, Tool } from "@/lib/types";

const ecosystems: EcosystemBundle[] = [];

export function registerEcosystem(bundle: EcosystemBundle) {
  const existingIndex = ecosystems.findIndex((item) => item.slug === bundle.slug);

  if (existingIndex >= 0) {
    ecosystems[existingIndex] = bundle;
    return bundle;
  }

  ecosystems.push(bundle);
  return bundle;
}

export function registerEcosystems(bundles: EcosystemBundle[]) {
  bundles.forEach(registerEcosystem);
  return ecosystems;
}

export function getRegisteredEcosystems() {
  return [...ecosystems];
}

export function getRegisteredEcosystemBySlug(slug: string) {
  return ecosystems.find((ecosystem) => ecosystem.slug === slug);
}

export function getRegisteredEcosystemByToolSlug(toolSlug: string) {
  return ecosystems.find((ecosystem) => ecosystem.tool.slug === toolSlug);
}

export function getRegisteredTools(): Tool[] {
  return ecosystems.map((ecosystem) => ecosystem.tool as Tool);
}

export function getRegisteredReviews(): EcosystemReview[] {
  return ecosystems.flatMap((ecosystem) =>
    ecosystem.review ? [ecosystem.review] : []
  );
}

export function getRegisteredComparisons(): Comparison[] {
  return ecosystems.flatMap((ecosystem) => ecosystem.comparisons ?? []) as Comparison[];
}

export function getRegisteredRankings(): EcosystemRanking[] {
  return ecosystems.flatMap((ecosystem) => ecosystem.rankings ?? []);
}

export function getRegisteredBlogPosts(): EcosystemBlogPost[] {
  return ecosystems.flatMap((ecosystem) => ecosystem.blogPosts ?? []);
}

export function getRegisteredDeals(): EcosystemDeal[] {
  return ecosystems.flatMap((ecosystem) => ecosystem.deals ?? []);
}

export function getRegisteredTutorials(): EcosystemTutorial[] {
  return ecosystems.flatMap((ecosystem) => ecosystem.tutorials ?? []);
}
