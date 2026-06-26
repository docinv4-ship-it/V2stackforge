import Link from "next/link";
import type { Comparison } from "@/lib/types";

interface ComparisonFooterProps {
  comparison: Comparison;
}

function formatUpdatedLabel(comparison: Comparison): string | null {
  if (!comparison.updatedAt) return null;

  const date = new Date(comparison.updatedAt);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ComparisonFooter({ comparison }: ComparisonFooterProps) {
  const updatedLabel = formatUpdatedLabel(comparison);

  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
        <p>
          Built for people who want clarity
          {updatedLabel ? ` • Data updated ${updatedLabel}` : ""}
        </p>
        <p className="mt-2">
          <Link href="/comparisons" className="transition hover:text-violet-400">
            CompareHub
          </Link>{" "}
          — Making hard decisions easy.
        </p>
      </div>
    </footer>
  );
}
