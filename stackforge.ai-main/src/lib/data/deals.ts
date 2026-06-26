import { getDealStatus, type PromoWindow } from "@/lib/utils/deal-status";
import "@/lib/ecosystems";
import { getRegisteredDeals } from "@/lib/ecosystems/registry";
import { supabase } from "@/lib/supabase/client";

export type DealItem = {
  slug: string;
  tool: string;
  title: string;
  summary: string;
  discount: string;
  bonus: string;
  promoWindows: PromoWindow[];
  promoUrl: string;
  upgradeUrl: string;
  angles: string[];
  resources: string[];
  featured?: boolean;
};

type DatabaseDealRow = {
  id?: string | number;
  slug?: string | null;
  tool_slug?: string | null;
  title?: string | null;
  description?: string | null;
  discount_text?: string | null;
  coupon_code?: string | null;
  affiliate_url?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  is_active?: boolean | null;
  featured?: boolean | null;
  badge?: string | null;
  deal_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const baseDeals: DealItem[] = [
  {
    slug: "highlevel-summer-of-ai",
    tool: "HighLevel",
    title: "Summer of AI",
    summary: "Limited-time AI offer for agencies and SMBs.",
    discount: "50% OFF first 3 months",
    bonus: "30 days free of Conversation AI and Voice AI",
    promoWindows: [
      { start: "2026-06-01", end: "2026-06-07" },
      { start: "2026-06-22", end: "2026-06-28" },
    ],
    promoUrl: "https://www.gohighlevel.com/ai?fp_ref=sheraz65",
    upgradeUrl:
      "https://app.gohighlevel.com/offers/affiliate-upgrade?fp_ref=sheraz65",
    angles: [
      "Businesses are losing leads because they respond too slowly",
      "What happens when every missed call gets answered?",
      "Simple urgency posts around the 50% OFF promo",
      "Quick demo videos showing AI features in action",
    ],
    resources: [
      "Graphics + Promo Assets",
      "Talking points / content scripts",
      "Summer of AI Affiliate Prep Guide",
      "June Promo Snapshot",
    ],
    featured: false,
  },
  {
    slug: "easeus-summer-splash-sale",
    tool: "EaseUS",
    title: "Summer Splash Sale",
    summary:
      "Save up to 70% on EaseUS tools for data recovery, backup, cloning, and system protection.",
    discount: "Up to 70% OFF",
    bonus: "Promo code SUMMER70 + separate referral program available",
    promoWindows: [{ start: "2026-05-15", end: "2026-06-30" }],
    promoUrl: "https://prf.hn/click/camref:1011l5JMpo",
    upgradeUrl: "https://ssqt.co/mzUN9Ug",
    angles: [
      "Users need a fast way to recover deleted files before data is lost permanently",
      "The 70% off offer creates a strong urgency angle for backup and recovery buyers",
      "EaseUS is a practical fit for Windows and Mac users who want recovery plus backup tools",
      "The separate referral program gives existing users a strong extra value hook",
    ],
    resources: [
      "EaseUS Summer Splash Sale assets",
      "Promo code SUMMER70",
      "Affiliate tracking link",
      "Referral program link",
    ],
    featured: true,
  },
];

function normalizeDeal(raw: unknown): DealItem | null {
  if (!raw || typeof raw !== "object") return null;

  const deal = raw as Partial<DealItem> & {
    cta?: { label?: string; href?: string };
  };

  if (!deal.slug || !deal.title) return null;

  const rawWindows = Array.isArray(deal.promoWindows) ? deal.promoWindows : [];
  const safeWindows = rawWindows.filter(
    (w: unknown): w is PromoWindow =>
      w !== null &&
      typeof w === "object" &&
      "start" in w &&
      "end" in w &&
      typeof (w as Record<string, unknown>).start === "string" &&
      typeof (w as Record<string, unknown>).end === "string"
  );

  let toolName = deal.tool ?? "Unknown";
  if (deal.title && deal.title.toLowerCase().includes("parallels")) {
    toolName = "Parallels";
  } else if (toolName === "Unknown" && deal.title) {
    toolName = deal.title.split(" ")[0] || "Platform";
  }

  return {
    slug: deal.slug,
    tool: toolName,
    title: deal.title,
    summary: deal.summary ?? "",
    discount: deal.discount ?? "",
    bonus: deal.bonus ?? "",
    promoWindows: safeWindows,
    promoUrl: deal.promoUrl ?? deal.cta?.href ?? "",
    upgradeUrl: deal.upgradeUrl ?? deal.cta?.href ?? "",
    angles: Array.isArray(deal.angles) ? deal.angles : [],
    resources: Array.isArray(deal.resources) ? deal.resources : [],
    featured: deal.featured ?? false,
  };
}

function normalizeDatabaseDeal(row: DatabaseDealRow): DealItem | null {
  const slug = (row.slug ?? "").trim();
  const title = (row.title ?? "").trim();

  if (!slug || !title) return null;

  const promoUrl = (row.affiliate_url ?? "").trim();
  const promoWindows: PromoWindow[] = [];

  const start = (row.starts_at ?? "").trim().split(" ")[0] || "";
  const end = (row.expires_at ?? "").trim().split(" ")[0] || "";

  if (start && end) {
    promoWindows.push({ start, end });
  }

  const tool = (row.tool_slug ?? "").trim() || title.split(" ")[0] || "Platform";

  return {
    slug,
    tool,
    title,
    summary: (row.description ?? "").trim(),
    discount: (row.discount_text ?? "").trim(),
    bonus: (row.badge ?? row.deal_type ?? row.coupon_code ?? "").trim(),
    promoWindows,
    promoUrl,
    upgradeUrl: promoUrl,
    angles: [],
    resources: [],
    featured: row.featured ?? false,
  };
}

function mergeDeals(primary: DealItem[], secondary: DealItem[]): DealItem[] {
  const map = new Map<string, DealItem>();

  for (const deal of [...primary, ...secondary]) {
    if (!map.has(deal.slug)) {
      map.set(deal.slug, deal);
      continue;
    }

    const existing = map.get(deal.slug)!;
    map.set(deal.slug, {
      ...existing,
      ...deal,
      promoWindows: deal.promoWindows.length ? deal.promoWindows : existing.promoWindows,
      angles: deal.angles.length ? deal.angles : existing.angles,
      resources: deal.resources.length ? deal.resources : existing.resources,
      featured: deal.featured !== undefined ? deal.featured : existing.featured,
    });
  }

  return [...map.values()];
}

const ecosystemDeals = getRegisteredDeals()
  .map(normalizeDeal)
  .filter((deal): deal is DealItem => deal !== null);

const staticDeals = mergeDeals(baseDeals, ecosystemDeals);

async function getDatabaseDeals(): Promise<DealItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from("deals").select("*");

  if (error || !data) return [];

  return (data as DatabaseDealRow[])
    .map(normalizeDatabaseDeal)
    .filter((deal): deal is DealItem => deal !== null);
}

const databaseDeals = await getDatabaseDeals();

export const deals: DealItem[] = mergeDeals(staticDeals, databaseDeals);

async function getAllDeals(now: Date = new Date()): Promise<DealItem[]> {
  const liveDatabaseDeals = await getDatabaseDeals();
  return mergeDeals(staticDeals, liveDatabaseDeals).map((deal) => ({
    ...deal,
    promoWindows: Array.isArray(deal.promoWindows) ? deal.promoWindows : [],
  }));
}

export function getDealBySlug(slug: string) {
  return deals.find((deal) => deal.slug === slug);
}

export async function getDealBySlugAsync(slug: string, now: Date = new Date()) {
  const allDeals = await getAllDeals(now);
  return allDeals.find((deal) => deal.slug === slug);
}

export async function getPublicDeals(now: Date = new Date()) {
  const allDeals = await getAllDeals(now);

  // FORCE BYPASS FILTER: Database ki sab deals ko bypass karke direct status inject karo
  return allDeals.map((deal) => {
    let rawStatus = getDealStatus(deal.promoWindows, now);
    
    // Agar status expired ho rahi hai, toh use bypass karke force "active" karo
    const finalStatus = rawStatus === "expired" ? "active" : rawStatus;

    return {
      ...deal,
      status: finalStatus as "active" | "upcoming",
    };
  });
}

export async function getFeaturedDeal(now: Date = new Date()) {
  const publicDeals = await getPublicDeals(now);
  return (
    publicDeals.find((deal) => deal.featured === true) ||
    publicDeals.find((deal) => deal.slug === "highlevel-summer-of-ai") ||
    publicDeals[0]
  );
}
