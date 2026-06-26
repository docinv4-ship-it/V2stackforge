import { NavItem } from "@/lib/types";

export const mainNavigation: NavItem[] = [
  { label: "Tools", href: "/tools" },
  { label: "Deals", href: "/deals" },
  { label: "Rankings", href: "/rankings" },
  { label: "Comparisons", href: "/comparisons" },
  { label: "Blog", href: "/blog" },
  { label: "Affiliate Programs", href: "/affiliate-programs" },
  { label: "Submit Tool", href: "/submit-tool" },
  { label: "About", href: "/about" },
];

export const sidebarNavigation = {
  discover: [
    { label: "Tools", href: "/tools" },
    { label: "Deals", href: "/deals" },
    { label: "Rankings", href: "/rankings" },
    { label: "Comparisons", href: "/comparisons" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Guides", href: "/blog?category=Guides" },
  ],
  programs: [
    { label: "Affiliate Programs", href: "/affiliate-programs" },
    { label: "Submit Tool", href: "/submit-tool" },
  ],
  settings: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export const mobileDockNavigation: NavItem[] = [
  { label: "Tools", href: "/tools" },
  { label: "Deals", href: "/deals" },
  { label: "Rankings", href: "/rankings" },
  { label: "Search", href: "/tools" },
];

export const footerNavigation = {
  discover: [
    { label: "Tools", href: "/tools" },
    { label: "Comparisons", href: "/comparisons" },
    { label: "Rankings", href: "/rankings" },
    { label: "Deals", href: "/deals" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Guides", href: "/blog?category=Guides" },
    { label: "Newsletter", href: "#newsletter" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Submit Tool", href: "/submit-tool" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Editorial Guidelines", href: "/editorial-guidelines" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy-policy#cookies" },
  ],
};
