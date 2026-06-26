"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  BookOpen,
  FileText,
  Home,
  Info,
  LayoutGrid,
  Mail,
  Menu,
  Percent,
  ShieldCheck,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const navigationGroups: NavGroup[] = [
  {
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Tools", href: "/tools", icon: LayoutGrid },
      { label: "Deals", href: "/deals", icon: Percent },
      { label: "Rankings", href: "/rankings", icon: Trophy },
      { label: "Compare", href: "/comparisons", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blog", href: "https://stackforge-blog.vercel.app", icon: BookOpen },
    ],
  },
  {
    title: "Programs",
    items: [
      { label: "Submit", href: "/submit-tool", icon: FileText },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about", icon: Info },
      { label: "Contact", href: "/contact", icon: Mail },
      { label: "Editorial", href: "/editorial-guidelines", icon: ShieldCheck },
    ],
  },
];

// Exact Image Logo implementation with grayscale filter
function StackForgeLogo() {
  return (
    <Image
      src="/logo.jpg" // Please ensure the uploaded logo image is named logo.jpg and placed in the /public folder
      alt="StackForge Logo"
      width={32}
      height={32}
      className="object-contain grayscale contrast-125 brightness-150 rounded-lg"
      priority
    />
  );
} 

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#121212] border-b border-zinc-800">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <StackForgeLogo />
              <span className="text-base font-bold tracking-tight text-zinc-100 font-mono">
                StackForge
              </span>
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="absolute left-0 top-0 bottom-0 flex h-full w-[290px] flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-400"
              initial={{ x: -290, opacity: 0.98 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -290, opacity: 0.98 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
            >
              <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <StackForgeLogo />
                  <span className="text-sm font-bold tracking-tight text-zinc-100 font-mono">
                    StackForge
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
                {navigationGroups.map((group, index) => (
                  <div key={`${group.title ?? "group"}-${index}`}>
                    {group.title ? (
                      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 font-mono">
                        {group.title}
                      </p>
                    ) : null}
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-zinc-400 transition-all duration-150 hover:bg-zinc-900/60 hover:text-zinc-100"
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/30">
                              <Icon className="h-3.5 w-3.5 text-zinc-500" />
                            </span>
                            <span className="font-medium font-mono">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-900 bg-zinc-950 p-4 text-[10px] text-zinc-600 font-mono tracking-tight">
                © 2026 StackForge.
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
