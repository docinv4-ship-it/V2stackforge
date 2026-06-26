import type { EcosystemReview } from "../types";
import type { Author } from "@/lib/types";
import { parallelsTool } from "./tool";

const parallelsAuthor: Author = {
  name: "David Parker",
  bio: "Mac virtualization reviewer and systems consultant who writes practical setup guides for users running Windows on Apple silicon Macs.",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
};

export const parallelsReview: EcosystemReview = {
  author: parallelsAuthor,
  slug: "parallels-review-2026",
  title: "Parallels Desktop Review 2026",
  excerpt:
    "A Mac-first virtualization review for users who need Windows without rebooting.",
  verdict: "Best for Mac users who want the smoothest Windows-on-Mac workflow.",
  score: {
    easeOfSetup: 9.7,
    macIntegration: 9.8,
    performance: 9.2,
    value: 8.6,
    overall: 9.3,
  },
  sections: [
    {
      heading: "Overview",
      body: [
        "Parallels Desktop is built for one job: let Mac users run Windows and Linux side by side with minimal friction.",
        "Its strongest selling points are the 14-day Pro trial, Microsoft-authorized Windows 11 support on Apple silicon Macs, and the fact that direct purchases include a 30-day money-back guarantee.",
      ],
    },
    {
      heading: "What it does well",
      body: [
        "It is easy to start, fast to evaluate, and convenient for daily use.",
        "It suits developers, creators, students, and teams that need Windows apps on macOS.",
        "The business edition adds centralized control for IT-managed deployments.",
      ],
    },
    {
      heading: "Where it is strongest",
      body: [
        "Parallels is strongest when convenience matters more than tinkering.",
        "If someone wants a clean Mac workflow and needs Windows apps without rebooting, this is the simplest route.",
      ],
    },
    {
      heading: "Pricing note",
      body: [
        "Parallels offers Standard Subscription, Standard One-time Purchase, Pro, and Business editions. Direct purchases include a 30-day money-back guarantee, and the Pro trial runs for 14 days with full access to Pro features.",
      ],
    },
    {
      heading: "Final verdict",
      body: [
        "Parallels is the safest recommendation for most Mac users who need Windows access and want a polished, low-friction setup.",
      ],
    },
  ],
  pros: [...parallelsTool.pros],
  cons: [...parallelsTool.cons],
  bestFor: [
    "Mac users who need Windows apps",
    "Developers testing across operating systems",
    "People who want to avoid rebooting",
    "Teams that need deployment controls",
    "Users who want to test a real workflow during the free trial",
  ],
  notBestFor: [
    "People who want a free permanent license",
    "Users with very old or underpowered Macs",
    "People who only need a lightweight app compatibility layer",
  ],
  ctaLabel: "Try Parallels Desktop Pro free for 14 days",
  ctaUrl: parallelsTool.trialUrl,
};