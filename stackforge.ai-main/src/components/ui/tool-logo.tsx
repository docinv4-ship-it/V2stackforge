import Image from "next/image";
import React from "react";

type ToolLogoProps = {
  name: string;
  logo?: string;
  slug?: string;
  className?: string;
};

function getFallbackInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ToolLogo({ name, logo, slug, className }: ToolLogoProps) {
  const fallback = getFallbackInitials(name);

  const fallbackStyle =
    slug === "clickfunnels"
      ? "from-orange-500 to-amber-400"
      : slug === "highlevel"
      ? "from-violet-500 to-fuchsia-500"
      : slug === "systeme-io"
      ? "from-cyan-500 to-sky-400"
      : "from-zinc-500 to-zinc-700";

  if (logo?.startsWith("/")) {
    return (
      <div
        className={[
          "relative flex items-center justify-center overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.03]",
          className ?? "h-14 w-14",
        ].join(" ")}
      >
        <Image
          src={logo}
          alt={`${name} logo`}
          width={56}
          height={56}
          className="h-full w-full rounded-full object-contain p-2"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center rounded-full bg-gradient-to-br border border-white/[0.06]",
        fallbackStyle,
        className ?? "h-14 w-14",
      ].join(" ")}
    >
      <span className="text-xs font-black tracking-tight text-white">
        {fallback}
      </span>
    </div>
  );
}