import { parallelsTool } from "../tool";

export const gamingOnMacGuide = {
  slug: "gaming-on-mac-with-parallels",
  title: "How to Test Windows Games on a Mac with Parallels",
  summary: "A practical workflow for users who want to see what runs before they commit.",
  intent: "tutorial",
  steps: [
    "Use the Pro trial to install the game you actually care about.",
    "Start with modest graphics settings and let the game benchmark itself.",
    "Watch memory usage and temperature while the game is running.",
    "Try full-screen and windowed modes to compare stability.",
    "Adjust VM resources only after you see the first test result.",
    "Decide based on the exact game, not on a generic spec sheet.",
  ],
  tips: [
    "Keep expectations realistic: some games run better than others.",
    "Use the trial to validate your own title, not just a random benchmark.",
    "If the game is mission-critical, test it twice before buying.",
  ],
  cta: {
    label: "Try the gaming test on the 14-day trial",
    href: parallelsTool.trialUrl,
  },
} as const;