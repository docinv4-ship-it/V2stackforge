import { cn } from "@/lib/utils/cn";

type RankingBadgeProps = {
  label: string;
  className?: string;
};

function getBadgeStyle(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("leader")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized.includes("value")) {
    return "border-zinc-200 bg-zinc-100 text-zinc-800";
  }

  if (normalized.includes("beginner")) {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  if (normalized.includes("agency")) {
    return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }

  if (normalized.includes("fast")) {
    return "border-amber-200 bg-amber-50/60 text-amber-800";
  }

  return "border-zinc-200 bg-zinc-50 text-zinc-600";
}

export function RankingBadge({ label, className }: RankingBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl border px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide uppercase",
        getBadgeStyle(label),
        className
      )}
    >
      {label}
    </span>
  );
}
