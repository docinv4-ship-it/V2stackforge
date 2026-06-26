import { AffiliateProgram } from "@/lib/types";

const baseAffiliatePrograms: AffiliateProgram[] = [
  {
    id: "systeme-io-affiliate",
    slug: "systeme-io-affiliate",
    toolSlug: "systeme-io",
    name: "Systeme.io Affiliate Program",
    description:
      "Earn recurring commissions by promoting Systeme.io's all-in-one marketing platform. The program offers competitive recurring commissions and is accessible to affiliates at all levels.",
    commissionType: "Recurring",
    commissionRate: "40% recurring commission",
    cookieDuration: "30 days",
    paymentThreshold: "$100 minimum",
    highlights: [
      "40% recurring commission on all plans",
      "30-day cookie duration",
      "Free to join with no approval required",
      "Recurring commissions for customer lifetime",
      "Promotion materials and affiliate dashboard provided",
      "Payments via PayPal",
    ],
    bestFor: [
      "Bloggers in marketing and business niches",
      "Course creators teaching online business",
      "YouTubers creating funnel tutorials",
      "Email marketers with entrepreneur audiences",
    ],
    signupUrl: "https://systeme.io/affiliates",
  },
  {
    id: "clickfunnels-affiliate",
    slug: "clickfunnels-affiliate",
    toolSlug: "clickfunnels",
    name: "ClickFunnels Affiliate Program",
    description:
      "Promote the leading sales funnel platform and earn substantial commissions. The ClickFunnels affiliate program is known for high payouts and strong brand recognition.",
    commissionType: "Recurring + Bounties",
    commissionRate: "40% recurring, bounties on certain products",
    cookieDuration: "45 days",
    paymentThreshold: "$100 minimum",
    highlights: [
      "40% recurring commission on subscriptions",
      "Bounty payments on certain products",
      "45-day cookie duration",
      "Strong brand recognition and high conversion rates",
      "Comprehensive affiliate training provided",
      "Dedicated affiliate management for top performers",
    ],
    bestFor: [
      "Marketing educators and course creators",
      "Influencers in the entrepreneur space",
      "Agencies recommending tools to clients",
      "Content creators with business audiences",
    ],
    signupUrl: "https://clickfunnels.com/affiliates",
  },
  {
    id: "highlevel-affiliate",
    slug: "highlevel-affiliate",
    toolSlug: "highlevel",
    name: "HighLevel Affiliate Program",
    description:
      "Promote HighLevel's comprehensive CRM and marketing platform. The program offers competitive recurring commissions for affiliates targeting agencies and businesses.",
    commissionType: "Recurring",
    commissionRate: "40% recurring commission",
    cookieDuration: "30 days",
    paymentThreshold: "$100 minimum",
    highlights: [
      "40% recurring commission on all plans",
      "30-day cookie duration",
      "High customer retention supports recurring earnings",
      "Strong product for agency audiences",
      "Growing platform with ongoing development",
      "Affiliate dashboard with tracking tools",
    ],
    bestFor: [
      "Marketing agencies recommending solutions",
      "Consultants serving local businesses",
      "Bloggers in the agency space",
      "Coaches teaching marketing agency business",
    ],
    signupUrl: "https://www.gohighlevel.com/affiliates",
  },
  {
    id: "parallels-affiliate",
    slug: "parallels-affiliate",
    toolSlug: "parallels",
    name: "Parallels Affiliate Program",
    description:
      "Promote Parallels Desktop to Mac users who need Windows on Mac. This program is a strong fit for virtualization, developer, productivity, and Apple silicon audiences.",
    commissionType: "Recurring",
    commissionRate: "Up to 25% commission",
    cookieDuration: "90 days",
    paymentThreshold: "Varies by partner terms",
    highlights: [
      "Up to 25% commission",
      "90-day cookie window",
      "Strong fit for Mac and developer audiences",
      "Great for Windows-on-Mac tutorials and comparisons",
      "Official Parallels partner portal",
      "Good conversion potential for Apple silicon content",
    ],
    bestFor: [
      "Mac and virtualization bloggers",
      "Developer content creators",
      "Windows-on-Mac tutorial sites",
      "Productivity and software reviewers",
    ],
    signupUrl: "https://www.parallels.com/affiliate/",
  },
];

export const affiliatePrograms: AffiliateProgram[] = [...baseAffiliatePrograms];

export function getAffiliateProgramBySlug(
  slug: string
): AffiliateProgram | undefined {
  return affiliatePrograms.find((program) => program.slug === slug);
}

export function getAffiliateProgramForTool(
  toolSlug: string
): AffiliateProgram | undefined {
  return affiliatePrograms.find((program) => program.toolSlug === toolSlug);
}
