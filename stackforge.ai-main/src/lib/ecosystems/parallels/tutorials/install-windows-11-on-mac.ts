import { parallelsTool } from "../tool";

export const installWindows11OnMac = {
  slug: "install-windows-11-on-mac-with-parallels",
  title: "How to Install Windows 11 on a Mac with Parallels",
  summary: "A clean setup guide for Mac users who need Windows without rebooting.",
  intent: "tutorial",
  steps: [
    "Install the 14-day Parallels Desktop Pro trial from the official trial page.",
    "Open Parallels and choose the Windows 11 option during VM setup.",
    "Let Parallels create the virtual machine automatically.",
    "Install Windows updates and then install Parallels Tools inside the VM.",
    "Move your files, pin the apps you need, and test your daily workflow.",
    "If you are on Apple silicon, use the Windows 11 path supported by Parallels on those Macs.",
  ],
  tips: [
    "Start with default settings, then tune RAM and CPU later.",
    "Keep a short app list for the first test run.",
    "Use the trial to verify the exact app you care about.",
  ],
  cta: {
    label: "Start the 14-day Pro trial",
    href: parallelsTool.trialUrl,
  },
} as const;