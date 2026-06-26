"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Link2,
  Shield,
  DollarSign,
  Eye,
  Heart,
  Mail,
  ArrowRight,
  Phone,
  BadgeCheck,
  Sparkles,
  Globe2,
  CheckCircle2,
  Users,
} from "lucide-react";

const PHONE_NUMBER = "+923441995788";

const partnerTools = [
  "Systeme.io",
  "ClickFunnels",
  "HighLevel",
  "Kajabi",
  "ConvertKit",
  "Other trusted SaaS platforms",
];

const commitmentPoints = [
  {
    title: "Transparency",
    description:
      "We clearly disclose when a page or link may generate commission for StackForge AI.",
  },
  {
    title: "Quality",
    description:
      "We only recommend tools that provide real-world value, not just commercial upside.",
  },
  {
    title: "Independence",
    description:
      "Editorial judgment stays separate from commercial relationships and partnerships.",
  },
  {
    title: "Honesty",
    description:
      "We cover strengths and weaknesses equally so users can make better decisions.",
  },
];

const affiliateFlow = [
  "You click an affiliate link on StackForge AI.",
  "A tracking cookie may be placed in your browser for the merchant’s attribution window.",
  "If you purchase within that period, we may earn a commission.",
  "The commission is paid by the merchant, not by you.",
  "Your purchase price usually stays the same.",
];

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 py-20 text-white lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/5 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-[128px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 shadow-sm backdrop-blur-sm">
              <Link2 className="h-4 w-4 text-zinc-200" />
              Full Transparency
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Affiliate Disclosure
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-zinc-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We believe in full transparency about how we make money. This disclosure
            explains our affiliate relationships and how they impact our content.
          </motion.p>

          <motion.p
            className="mt-4 text-sm text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Last updated: May 26, 2026
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Summary */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">Summary</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              StackForge AI earns commissions when you purchase products through
              affiliate links on our website. This is how we fund our research,
              content creation, and ongoing operations. Our editorial opinions are
              never influenced by affiliate relationships, and we only recommend
              products we genuinely believe provide value.
            </p>
          </motion.div>

          {/* FTC Compliance */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">FTC Compliance</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              In accordance with the Federal Trade Commission&apos;s 16 CFR Part 255:
              &quot;Guides Concerning the Use of Endorsements and Testimonials in
              Advertising,&quot; we disclose our affiliate relationships to ensure
              full transparency with our readers.
            </p>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="mb-2 font-semibold text-zinc-900">What This Means for You:</h3>
              <ul className="space-y-2 text-zinc-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-zinc-700" />
                  <span>When you click an affiliate link on our site, we may receive compensation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-zinc-700" />
                  <span>We clearly identify affiliate links throughout our content.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-zinc-700" />
                  <span>Our reviews and recommendations are based on genuine research and analysis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-zinc-700" />
                  <span>Affiliate compensation does not affect our editorial integrity.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* How Affiliate Links Work */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                How Affiliate Links Work
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              Understanding affiliate marketing helps you make informed decisions
              about the products you purchase.
            </p>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="mb-3 font-semibold text-zinc-900">The Process:</h3>
              <ol className="list-inside list-decimal space-y-3 text-zinc-600">
                {affiliateFlow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
            <p className="mt-4 leading-relaxed text-zinc-600">
              Importantly, using our affiliate links does not cost you anything extra.
              In some cases, we may even have negotiated exclusive discounts for our
              readers.
            </p>
          </motion.div>

          {/* Impact on Our Content */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Eye className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Impact on Our Content
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              Our editorial integrity is the foundation of our business. Here&apos;s
              how we maintain it:
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-600">
              <li>
                <span className="font-medium text-zinc-900">Unbiased Reviews:</span>{" "}
                Our product reviews are based on thorough testing, research, and
                analysis. Affiliate partnerships never influence our ratings or
                recommendations.
              </li>
              <li>
                <span className="font-medium text-zinc-900">Transparent Comparisons:</span>{" "}
                We present objective comparisons that highlight both pros and cons
                of each product.
              </li>
              <li>
                <span className="font-medium text-zinc-900">Honest Opinions:</span>{" "}
                If a product has issues, we report them regardless of affiliate status.
              </li>
              <li>
                <span className="font-medium text-zinc-900">Equal Opportunity:</span>{" "}
                We may review products that do not have affiliate programs if they
                offer genuine value.
              </li>
            </ul>
          </motion.div>

          {/* Our Commitment */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Heart className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Our Commitment to You
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              We value your trust above all else. Our commitment includes:
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {commitmentPoints.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-zinc-700" />
                    <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-zinc-600">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Affiliate Partners */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Globe2 className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Our Affiliate Partners
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              We participate in affiliate programs from various companies including
              but not limited to:
            </p>
            <ul className="grid gap-3 text-zinc-600 sm:grid-cols-2">
              {partnerTools.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                >
                  <span className="h-2 w-2 rounded-full bg-zinc-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              This list may change as we add or remove affiliate partnerships. For
              specific product affiliations, please contact us.
            </p>
          </motion.div>

          {/* Your Support */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              How Your Support Helps
            </h2>
            <p className="leading-relaxed text-zinc-600">
              When you use our affiliate links, you help support our work. The
              commissions we earn allow us to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-600">
              <li>Conduct in-depth product testing and research</li>
              <li>Create free educational content and tutorials</li>
              <li>Maintain and improve our website</li>
              <li>Continue providing honest, unbiased reviews</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">Questions?</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              If you have any questions about our affiliate relationships or
              disclosure policies, please contact us directly.
            </p>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-medium text-zinc-900">Phone: {PHONE_NUMBER}</p>
              <p className="mt-2 text-zinc-600">
                Tap the button below to open a direct dial screen on your device.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>

              <Link
                href="/editorial-guidelines"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Read Editorial Guidelines
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
