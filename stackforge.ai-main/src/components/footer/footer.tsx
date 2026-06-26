"use client";

import Link from "next/link";
import Image from "next/image";
import { footerNavigation } from "@/lib/data/navigation";

const BLOG_EXTERNAL_URL = "https://stackforge-blog.vercel.app";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const socialLinks = [
  { icon: XIcon, href: "https://twitter.com", label: "Twitter" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
];

function resolveFooterHref(href: string, label?: string) {
  if (label?.toLowerCase() === "blog" || href === "/blog") {
    return BLOG_EXTERNAL_URL;
  }
  return href;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function FooterNavItem({ href, label }: { href: string; label: string }) {
  const resolvedHref = resolveFooterHref(href, label);

  if (isExternalHref(resolvedHref)) {
    return (
      <a
        href={resolvedHref}
        className="text-xs md:text-sm text-zinc-400 hover:text-zinc-100 font-mono transition-colors"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={resolvedHref}
      className="text-xs md:text-sm text-zinc-400 hover:text-zinc-100 font-mono transition-colors"
    >
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="group mb-4 flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40">
                <Image
                  src="/logo.jpg"
                  alt="StackForge Logo"
                  width={36}
                  height={36}
                  className="object-contain grayscale contrast-125 brightness-150"
                  priority
                />
              </div>
              <span className="font-mono text-base font-bold tracking-tight text-zinc-100">
                StackForge AI
              </span>
            </Link>

            <p className="mb-6 max-w-xs font-sans text-xs leading-relaxed text-zinc-400 md:text-sm">
              Your trusted source for SaaS tool reviews, comparisons, and affiliate program guides.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 transition-colors hover:bg-zinc-850"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-zinc-400 transition-colors hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Discover
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.discover.map((link) => (
                <li key={link.href}>
                  <FooterNavItem href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.resources.map((link) => (
                <li key={link.href}>
                  <FooterNavItem href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.company.map((link) => (
                <li key={link.href}>
                  <FooterNavItem href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.legal.map((link) => (
                <li key={link.href}>
                  <FooterNavItem href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 font-mono text-[11px] md:flex-row">
            <p className="text-zinc-600">
              © {new Date().getFullYear()} StackForge AI. All rights reserved.
            </p>
            <p className="text-zinc-600">
              We use affiliate links. Learn more in our{" "}
              <Link href="/affiliate-disclosure" className="text-zinc-400 hover:underline">
                Affiliate Disclosure
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
