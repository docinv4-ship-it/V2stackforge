import { Tool, ToolCategory } from "@/lib/types";
import "@/lib/ecosystems";
import { getRegisteredTools } from "@/lib/ecosystems/registry";

const baseTools: Tool[] = [
  {
    id: "systeme-io",
    slug: "systeme-io",
    name: "Systeme.io",
    tagline: "All-in-one marketing platform for online entrepreneurs",
    description:
      "Systeme.io is a comprehensive all-in-one marketing platform designed specifically for online entrepreneurs. It combines email marketing, funnel building, course hosting, affiliate management, and membership sites into a single, unified platform. What sets Systeme.io apart is its generous forever-free plan that includes real functionality—up to 2,000 contacts, 3 funnels, and 1 course at no cost. This makes it an ideal starting point for entrepreneurs testing online business ideas without upfront investment. Plus, they offer incredible premium bonuses like free complete business migration and 1-on-1 coaching on their higher-tier and annual plans.",
    logo: "/logos/systemeio.png",
    website: "https://systeme.io/?sa=sa0272560100fb516edfb2699d9826d8aeb8872cd1",
    category: [
      "funnel-builder",
      "email-marketing",
      "marketing-automation",
      "online-business",
    ],
    pricing: [
      {
        name: "Free",
        price: 0,
        period: "forever",
        features: [
          "Up to 2,000 contacts",
          "Unlimited emails",
          "3 sales funnels",
          "1 course",
          "1 membership site",
          "Affiliate program management",
          "No credit card required",
          "24/7 Human support (under 2hr reply)",
        ],
      },
      {
        name: "Startup",
        price: 27,
        period: "/month",
        features: [
          "Up to 5,000 contacts",
          "Unlimited sales funnels",
          "Unlimited courses",
          "Unlimited membership sites",
          "Email automation workflows",
          "Affiliate management",
          "Webinar funnels",
          "Priority email support",
          "Remove Systeme.io branding",
        ],
      },
      {
        name: "Webinar",
        price: 47,
        period: "/month",
        features: [
          "Up to 10,000 contacts",
          "Evergreen webinar funnels",
          "Live webinar hosting",
          "Everything in Startup",
          "Advanced automation triggers",
          "Priority phone support",
          "Custom domains",
          "Advanced analytics",
        ],
        highlighted: true,
      },
      {
        name: "Unlimited",
        price: 97,
        period: "/month",
        features: [
          "Unlimited contacts",
          "Unlimited everything",
          "Priority phone support",
          "Custom domain mapping",
          "Advanced email analytics",
          "API access",
          "Dedicated account manager",
          "White-label options",
          "FREE business migration",
          "FREE 1-on-1 kickstart coaching",
        ],
      },
    ],
    features: [
      "Drag-and-drop funnel builder with templates",
      "Email marketing with automation sequences",
      "Online course creation and hosting",
      "Membership site builder with drip content",
      "Built-in affiliate program management",
      "Webinar funnels (live and evergreen)",
      "A/B split testing for optimization",
      "Blog and content management system",
      "Video hosting without external services",
      "Contact management and segmentation",
      "Visual workflow automation builder",
      "Native payment integration (Stripe, PayPal)",
      "Landing page builder",
      "Order form and checkout pages",
      "Thank you pages with upsells",
      "24/7 Real human customer support (under 2h average reply time)",
      "Free complete business migration (Unlimited or Annual plans)",
      "Free 1-on-1 kickstart coaching (Unlimited or Annual plans)",
    ],
    pros: [
      "Genuinely free plan with real, usable functionality",
      "True all-in-one platform reduces tool stack complexity",
      "Easy learning curve ideal for beginners",
      "Affordable scaling with predictable pricing tiers",
      "Strong email deliverability rates",
      "24/7 real human customer support with under 2-hour average reply time (no bots)",
      "Get 2 months FREE on all annual plans",
      "Free complete business migration and coaching on Unlimited or Annual plans",
      "No transaction fees on sales",
      "French company with GDPR compliance built-in",
    ],
    cons: [
      "Template selection smaller than premium competitors",
      "Advanced customization limited compared to ClickFunnels",
      "Third-party integrations fewer than established platforms",
      "No mobile app for on-the-go management",
      "Reporting could be more detailed for power users",
    ],
    useCases: [
      "Online course creators building and selling digital courses",
      "Coaches selling coaching programs and digital products",
      "Small businesses running professional email marketing",
      "Entrepreneurs launching membership communities",
      "Beginners validating business ideas at zero cost",
      "Consultants building authority with lead magnets",
      "Info-product creators needing sales funnels",
      "Affiliate marketers building funnel-based promotions",
    ],
    rating: 4.7,
    reviewCount: 2847,
    faq: [
      {
        question: "Is Systeme.io really free forever?",
        answer:
          "Yes, the free plan is genuinely free forever with no time limit and no credit card required. You get 2,000 contacts, 3 funnels, 1 course, and full email marketing capabilities. The free plan has helped thousands of entrepreneurs start their online businesses before upgrading.",
      },
      {
        question: "Can I migrate from ClickFunnels or other platforms to Systeme.io?",
        answer:
          "Yes, Systeme.io supports imports from most major email marketing and funnel platforms. You can import contacts, migrate your content, and rebuild your funnels. Plus, if you subscribe to the Unlimited plan or any Annual plan, the Systeme.io team provides FREE migration of your entire business, along with a free 1-on-1 kickstart coaching session!",
      },
      {
        question: "Does Systeme.io handle payments and sales tax?",
        answer:
          "Systeme.io integrates with Stripe and PayPal for payment processing. Tax handling depends on your payment processor configuration. The platform handles the technical side of checkout pages, order forms, and thank you pages seamlessly.",
      },
      {
        question: "How does Systeme.io compare to ClickFunnels?",
        answer:
          "Systeme.io is more affordable and includes email marketing, courses, and memberships at no extra cost. ClickFunnels has more templates and a larger community but starts at $147/month. For beginners, Systeme.io offers better value. For established businesses needing advanced funnel optimization, ClickFunnels may justify its premium.",
      },
      {
        question: "Can I run my affiliate program through Systeme.io?",
        answer:
          "Yes, Systeme.io includes built-in affiliate management on all plans. You can set commission rates, provide affiliate links, and track affiliate performance. This typically costs extra as a separate tool on other platforms.",
      },
      {
        question: "How good is Systeme.io's customer support?",
        answer:
          "Systeme.io boasts exceptional 24/7 customer support with an average reply time of under 2 hours. All replies come from real humans who know the product—there are no automated live chat bots. You can also rate and leave written feedback on their responses.",
      },
    ],
  },
  {
    id: "clickfunnels",
    slug: "clickfunnels",
    name: "ClickFunnels",
    tagline: "The original sales funnel platform for high-converting funnels",
    description:
      "ClickFunnels is the pioneering sales funnel software that popularized and defined the concept of funnel-based marketing. Founded by Russell Brunson in 2014, it has helped over 100,000 entrepreneurs generate billions in sales through its proven funnel methodology. The platform specializes in creating high-converting sales funnels with battle-tested templates, order form optimization, strategic upsells and downsells, and membership site capabilities. ClickFunnels isn't just software—it's a complete methodology backed by extensive training resources and a passionate community of 'Funnel Hackers.'",
    logo: "/logos/clickfunnels.png",
    website:
      "https://www.clickfunnels.com/signup-flow?aff=ff08c6d22c631e5602e1eadc9750aeaa4f5c06bba10720c5f1cb2e8a5b55faae",
    category: ["funnel-builder", "sales-funnel", "online-business"],
    pricing: [
      {
        name: "Starter",
        price: 147,
        period: "/month",
        features: [
          "Up to 1 funnel",
          "Up to 20,000 visitors/month",
          "Basic email integration",
          "Funnel sharing capabilities",
          "Template library access",
          "Payment integration",
          "Follow-up funnels (basic)",
          "Funnel statistics",
        ],
      },
      {
        name: "Pro",
        price: 197,
        period: "/month",
        features: [
          "Up to 100 funnels",
          "Priority support access",
          "Unlimited contacts",
          "Advanced templates",
          "Full follow-up funnels",
          "Affiliate management system",
          "Backpack affiliate platform",
          "Priority support queue",
          "FunnelFlix training library",
        ],
        highlighted: true,
      },
      {
        name: "Funnel Hacker",
        price: 297,
        period: "/month",
        features: [
          "Unlimited funnels",
          "Unlimited visitors",
          "Priority VIP support",
          "Exclusive FunnelFlix content",
          "Advanced analytics dashboard",
          "API access",
          "Priority feature requests",
          "Dedicated success manager",
          "Annual plan discounts available",
        ],
      },
    ],
    features: [
      "Drag-and-drop funnel builder",
      "Hundreds of pre-built funnel templates",
      "Custom order form builder",
      "Strategic one-click upsells and downsells",
      "Order bumps to increase average order value",
      "Membership site area (Follow-up Funnels)",
      "Email follow-up sequences",
      "A/B split testing capabilities",
      "Built-in affiliate management system",
      "Cart abandonment recovery automation",
      "Live and automated webinar funnels",
      "Auto-webinar replay features",
      "Integrated payment processing",
      "Sales page and landing page builders",
      "Funnel sharing and marketplace",
      "Analytics and conversion tracking",
    ],
    pros: [
      "Pioneer in funnel technology with proven methodology",
      "Extensive template library tested for conversions",
      "Large, active community of Funnel Hackers",
      "Comprehensive training resources (FunnelFlix)",
      "One-click upsells proven to increase revenue",
      "Established reputation with extensive case studies",
      "Marketplace for sharing and selling funnel templates",
      "Strong brand recognition and credibility",
    ],
    cons: [
      "Higher price point starting at $147/month",
      "Learning curve steep compared to simpler tools",
      "No free plan available",
      "Email features less robust than dedicated platforms",
      "Annual commitment needed for best pricing",
      "Can feel feature-heavy for simple use cases",
    ],
    useCases: [
      "Digital product creators with proven offers",
      "Ecommerce brands running flash sales",
      "Coaches selling high-ticket coaching programs",
      "Info-product launches with upsell sequences",
      "Affiliate marketers promoting through funnels",
      "Real estate lead generation campaigns",
      "Local businesses seeking appointment funnels",
      "Webinar-based sales presentations",
    ],
    rating: 4.5,
    reviewCount: 5623,
    faq: [
      {
        question: "Does ClickFunnels offer a free trial?",
        answer:
          "ClickFunnels typically offers a 14-day free trial allowing full access to test the platform before committing to a paid plan. This gives you time to build your first funnel and evaluate whether it fits your business needs.",
      },
      {
        question: "How does ClickFunnels compare to Systeme.io?",
        answer:
          "ClickFunnels pioneered sales funnels with proven templates and methodology but starts at $147/month. Systeme.io offers similar core funnel functionality plus email marketing and courses starting free. Choose ClickFunnels for advanced funnel optimization and community. Choose Systeme.io for all-in-one simplicity and affordability.",
      },
      {
        question: "Can ClickFunnels replace my email marketing platform?",
        answer:
          "ClickFunnels includes Follow-up Funnels for basic email sequences, but serious email marketers often pair it with dedicated platforms like ActiveCampaign or ConvertKit for advanced automation, deliverability optimization, and list management.",
      },
      {
        question: "What is the Funnel Hackers community?",
        answer:
          "Funnel Hackers is the active community of ClickFunnels users who share strategies, templates, and successes. The community provides access to training, live events like Funnel Hacking Live, and a supportive network of entrepreneurs using funnel marketing.",
      },
      {
        question: "Does ClickFunnels handle affiliate programs?",
        answer:
          "Yes, the Backpack affiliate system (available on Pro and up) lets you create and manage your own affiliate program. You can set commissions, provide affiliate resources, track performance, and pay affiliates directly through the platform.",
      },
    ],
  },
  {
    id: "highlevel",
    slug: "highlevel",
    name: "HighLevel",
    tagline: "White-label CRM and marketing automation for agencies",
    description:
      "HighLevel (also known as GoHighLevel) is a white-label CRM and marketing automation platform designed for marketing agencies and local businesses. It represents the next evolution in all-in-one platforms by combining sales funnels, website building, reputation management, two-way SMS, phone calling, video calling, appointment scheduling, and comprehensive CRM into one unified solution. What truly sets HighLevel apart is its white-label capability—agencies can brand the entire platform as their own and resell it to clients, creating a recurring revenue stream while consolidating their tech stack.",
    logo: "/logos/highlevel.png",
    website: "https://www.gohighlevel.com/?fp_ref=sheraz65",
    category: [
      "crm",
      "marketing-automation",
      "funnel-builder",
      "online-business",
    ],
    pricing: [
      {
        name: "Starter",
        price: 97,
        period: "/month",
        features: [
          "Unlimited contacts",
          "Marketing funnels and websites",
          "Website builder",
          "Calendar and appointment booking",
          "Two-way SMS messaging",
          "Email marketing automation",
          "Workflow automation builder",
          "Conversation AI bot",
          "Opportunity pipeline CRM",
          "Native integrations",
        ],
      },
      {
        name: "Agency Unlimited",
        price: 297,
        period: "/month",
        features: [
          "Everything in Starter",
          "Unlimited client accounts",
          "White-label branding",
          "Custom domain mapping",
          "Advanced agency features",
          "Full API access",
          "Priority support queue",
          "Reputation management",
          "Custom reporting dashboards",
          "Team permissions",
        ],
        highlighted: true,
      },
      {
        name: "SaaS Pro",
        price: 497,
        period: "/month",
        features: [
          "Everything in Agency Unlimited",
          "SaaS mode for reselling",
          "Resell the platform as your own",
          "Advanced agency training",
          "SaaS website templates",
          "Priority onboarding calls",
          "Dedicated success manager",
          "Rebilling for SMS/calls",
          "Custom mobile app option",
        ],
      },
    ],
    features: [
      "Drag-and-drop funnel and website builder",
      "Full CRM with opportunity pipeline",
      "Email marketing with sequences and automation",
      "Two-way SMS messaging with conversation threads",
      "Native phone calling with recording",
      "Google My Business management",
      "Review and reputation management",
      "Appointment scheduling calendar",
      "Landing page and website builder",
      "Invoicing and payment collection",
      "White-label capability for agencies",
      "Call tracking and analytics",
      "Visual workflow automation builder",
      "Membership and course hosting",
      "Video calling and messaging",
      "Custom reporting and dashboards",
      "Team permissions and roles",
      "Mobile app for account management",
    ],
    pros: [
      "Most comprehensive all-in-one for agencies",
      "White-label capability creates revenue opportunity",
      "Unlimited contacts on all plans",
      "Native SMS and phone calling unique in this space",
      "Excellent value for agencies serving multiple clients",
      "Active development with frequent feature releases",
      "Strong community of agency users",
      "Replaces 10+ separate tools",
    ],
    cons: [
      "Steeper learning curve due to extensive features",
      "Can overwhelm simple use cases",
      "Agency-focused design may not suit all users",
      "Email deliverability needs proper configuration",
      "SMS and calling have usage fees beyond plan cost",
      "More complexity than pure funnel builders",
    ],
    useCases: [
      "Marketing agencies managing multiple client accounts",
      "Local businesses handling leads and communications",
      "Coaches with appointment-based business models",
      "Real estate agents managing pipelines and follow-up",
      "Agencies wanting to white-label a complete platform",
      "Consultants consolidating multiple marketing tools",
      "Service businesses needing appointment booking",
      "Businesses requiring unified SMS, email, and phone",
      "SaaS agencies looking to resell software",
    ],
    rating: 4.6,
    reviewCount: 3892,
    faq: [
      {
        question: "Can I use HighLevel for just my own business?",
        answer:
          "Absolutely. Many single businesses use HighLevel as their complete CRM, marketing automation, and communication hub. The Starter plan at $97/month provides excellent value when you consider it replaces separate CRM, email marketing, SMS, appointment scheduling, and funnel tools.",
      },
      {
        question: "What does white-label mean with HighLevel?",
        answer:
          "White-label means you can completely rebrand HighLevel as your own software. Put your logo, brand colors, and domain on the platform. Your clients never see HighLevel branding—they experience it as YOUR proprietary system. This lets agencies resell the platform under their own brand.",
      },
      {
        question: "Does HighLevel include SMS and phone calling?",
        answer:
          "Yes, HighLevel includes native two-way SMS messaging and built-in phone calling with recording. This is unique among funnel and CRM platforms. Usage fees apply for messages and minutes, which agencies can rebill to clients at markup.",
      },
      {
        question: "How does HighLevel compare to ClickFunnels?",
        answer:
          "ClickFunnels focuses on sales funnels with proven templates. HighLevel is a full CRM, marketing automation, and communication platform. Choose ClickFunnels for dedicated funnel building. Choose HighLevel if you need CRM, SMS, calling, appointments, and comprehensive automation—especially for agencies.",
      },
      {
        question: "What is the SaaS Pro plan for?",
        answer:
          "The SaaS Pro plan enables agencies to resell HighLevel as their own software-as-a-service product. You can charge clients monthly for access to 'your' platform, creating recurring revenue while the infrastructure and updates are handled by HighLevel.",
      },
    ],
  },
];

export const tools: Tool[] = [...baseTools, ...getRegisteredTools()];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) =>
    tool.category.includes(category as ToolCategory)
  );
}

export function getToolsByIds(ids: string[]): Tool[] {
  return tools.filter((tool) => ids.includes(tool.id));
}
