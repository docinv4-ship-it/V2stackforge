"use client";

type RankingFiltersProps = {
  categories: Array<{ slug: string; title: string }>;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
};

export function RankingFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: RankingFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pb-2 w-full">
      <button
        type="button"
        onClick={() => onSelectCategory("")}
        className={[
          "rounded-xl border px-4 py-2 text-xs font-medium transition duration-150",
          selectedCategory === ""
            ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-50",
        ].join(" ")}
      >
        All Tools
      </button>

      {categories.map((category) => {
        const active = selectedCategory === category.slug;

        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => onSelectCategory(category.slug)}
            className={[
              "rounded-xl border px-4 py-2 text-xs font-medium transition duration-150",
              active
                ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-50",
            ].join(" ")}
          >
            {category.title}
          </button>
        );
      })}
    </div>
  );
}
