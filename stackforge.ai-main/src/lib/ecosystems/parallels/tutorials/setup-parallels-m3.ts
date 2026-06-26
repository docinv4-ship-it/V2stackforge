import { parallelsTool } from "../tool";

export const setupParallelsM3 = {
  slug: "setup-parallels-on-m3-mac",
  title: "How to Set Up Parallels on an M3 Mac",
  summary: "Optimize Parallels for Apple silicon performance and daily use.",
  intent: "tutorial",
  steps: [
    "Install Parallels Desktop Pro and finish the first-run setup.",
    "Choose a balanced configuration for RAM and CPU instead of maxing everything out.",
    "Turn on the features you actually need: shared folders, clipboard sync, and app integration.",
    "Use the trial to test your workload before buying.",
    "If you work with developer tools, enable the command-line and monitoring utilities.",
    "Keep the Mac and the VM updated so compatibility stays clean.",
  ],
  tips: [
    "M3 users should favor balance over raw allocation.",
    "Do one real workflow test before declaring it fast or slow.",
    "Close heavy macOS apps when testing a large VM.",
  ],
  cta: {
    label: "Test Parallels on Apple silicon",
    href: parallelsTool.trialUrl,
    className: "bg-zinc-900 text-white hover:bg-black font-mono shadow-sm",
    variant: "primary"
  },
} as const;
