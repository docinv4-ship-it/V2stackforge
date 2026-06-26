import Link from "next/link";
import { Scale } from "lucide-react";

export function ComparisonNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent">
            CompareHub
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/comparisons" className="transition hover:text-violet-400">
            All Comparisons
          </Link>
          <Link href="/rankings" className="transition hover:text-violet-400">
            Rankings
          </Link>
          <Link href="/blog" className="transition hover:text-violet-400">
            Blog
          </Link>
        </div>

        <Link
          href="/comparisons"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-2.5 font-medium text-black transition hover:bg-gray-200"
        >
          <Scale className="h-4 w-4" />
          Browse Comparisons
        </Link>
      </div>
    </nav>
  );
}
