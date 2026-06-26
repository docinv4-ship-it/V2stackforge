import { cn } from "@/lib/utils/cn";

type RankingScoreBadgeProps = {
  score: number;
  className?: string;
};

function getScoreTone(score: number) {
  if (score >= 9.5) {
    return "border-zinc-900 bg-zinc-900 text-white";
  }

  if (score >= 9) {
    return "border-zinc-300 bg-zinc-100 text-zinc-900";
  }

  if (score >= 8.5) {
    return "border-zinc-200 bg-zinc-50 text-zinc-800";
  }

  return "border-zinc-200 bg-white text-zinc-700";
}

export function RankingScoreBadge({ score, className }: RankingScoreBadgeProps) {
  const tone = getScoreTone(score);

  return (
    <div
      className={cn(
        "inline-flex h-9 min-w-[50px] items-center justify-center rounded-xl border px-2.5 text-xs font-bold tracking-tight shadow-sm",
        tone,
        className
      )}
      aria-label={`Ranking score ${score.toFixed(1)}`}
      title={`Score ${score.toFixed(1)}`}
    >
      {score.toFixed(1)}
    </div>
  );
}
