import { Trophy } from "lucide-react";

type RankingHeroProps = {
  title: string;
  description: string;
  rankingCount?: number;
  toolCount?: number;
};

export function RankingHero({
  title,
  description,
}: RankingHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-x-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide uppercase text-zinc-700">
            <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
            <span>Independent SaaS Intelligence</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tighter text-zinc-950 md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] leading-none">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-600 md:text-lg font-normal">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
