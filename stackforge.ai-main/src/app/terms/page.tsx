"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Scale,
  AlertTriangle,
  Shield,
  Copyright,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe2,
  LockKeyhole,
} from "lucide-react";

const termsSections = [
  {
    title: "Acceptance of Terms",
    icon: CheckCircle2,
    body: [
      `By accessing and using StackForge AI (the "Site"), you accept and agree to be bound by these Terms of Service.`,
      `If you do not agree with these terms, you should not use this Site. We may update these terms from time to time, and continued use of the Site means you accept the revised version.`,
    ],
  },
  {
    title: "Terms of Use",
    icon: Scale,
    body: [
      `You agree to use StackForge AI only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use of the Site.`,
    ],
    list: [
      "Attempting to gain unauthorized access to any part of the Site",
      "Using automated systems or software to extract data from the Site",
      "Interfering with or disrupting the Site's servers or networks",
      "Transmitting any viruses, malware, or harmful code",
      "Engaging in activity that violates applicable laws or regulations",
    ],
  },
  {
    title: "Intellectual Property Rights",
    icon: Copyright,
    body: [
      `The content, features, and functionality of StackForge AI, including text, graphics, logos, and software, are the property of StackForge AI or its licensors and are protected by copyright, trademark, and other intellectual property laws.`,
    ],
    list: [
      "You may not reproduce, distribute, or create derivative works without our express written permission.",
      "You may not use our trademarks or branding without prior authorization.",
      "User-generated content, if any, remains your property, but you grant us a license to use it on our Site.",
    ],
  },
  {
    title: "Disclaimers",
    icon: AlertTriangle,
    body: [
      `The information on StackForge AI is provided "as is" without any warranties, express or implied.`,
      `We do not guarantee the accuracy, completeness, or usefulness of any content.`,
    ],
    calloutTitle: "Important Notices",
    calloutList: [
      "Product reviews and comparisons reflect our opinions and may not represent typical experiences.",
      "We are not responsible for third-party products or services linked from our Site.",
      "Pricing and availability information may change without notice.",
      "We do not provide professional, legal, or financial advice.",
    ],
  },
  {
    title: "Limitation of Liability",
    icon: Shield,
    body: [
      `To the fullest extent permitted by law, StackForge AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Site.`,
    ],
    list: [
      "We are not liable for any loss of data, profits, or business opportunities.",
      "We do not guarantee uninterrupted or error-free access to the Site.",
      "Our maximum aggregate liability shall not exceed the amount you paid us, if any, for access to the Site.",
    ],
  },
  {
    title: "Affiliate Relationships",
    icon: Sparkles,
    body: [
      `StackForge AI participates in affiliate marketing programs. This means we may receive compensation for products purchased through links on our Site.`,
      `This compensation does not influence our editorial content or reviews.`,
    ],
    cta: {
      label: "Read Affiliate Disclosure",
      href: "/affiliate-disclosure",
    },
  },
  {
    title: "Third-Party Links",
    icon: Globe2,
    body: [
      `Our Site may contain links to third-party websites that are not owned or controlled by StackForge AI.`,
      `We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.`,
    ],
  },
  {
    title: "Governing Law",
    icon: LockKeyhole,
    body: [
      `These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.`,
      `Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in your applicable jurisdiction.`,
    ],
  },
  {
    title: "Changes to Terms",
    icon: FileText,
    body: [
      `We reserve the right to modify these Terms of Service at any time.`,
      `Changes will be posted on this page with an updated revision date. Your continued use of the Site after such changes constitutes your acceptance of the new terms.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-20 lg:py-32">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="terms-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#terms-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
              <FileText className="h-4 w-4 text-zinc-600" />
              Legal Agreement
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Terms of Service
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-zinc-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Please read these terms carefully before using our website. By accessing
            StackForge AI, you agree to be bound by these terms.
          </motion.p>

          <motion.p
            className="mt-4 text-sm text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Last updated: May 26, 2026
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Acceptance Summary
              </h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              These Terms of Service define how you may use the Site, what you may
              not do, and the limits of our responsibility. The layout is intentionally
              clean and high-contrast so every heading and paragraph stays readable.
            </p>
          </motion.div>

          <div className="space-y-8">
            {termsSections.map((section) => {
              const Icon = section.icon;

              return (
                <motion.div
                  key={section.title}
                  className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Icon className="h-6 w-6 text-zinc-700" />
                    <h2 className="text-2xl font-bold text-zinc-900">{section.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="leading-relaxed text-zinc-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {"list" in section && section.list && section.list.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <ul className="space-y-3">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
                          >
                            <span className="mt-2 h-2 w-2 rounded-full bg-zinc-500" />
                            <span className="text-zinc-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {"calloutTitle" in section && section.calloutTitle && (
                    <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="mb-3 font-semibold text-zinc-900">
                        {section.calloutTitle}
                      </h3>
                      {"calloutList" in section && section.calloutList && (
                        <ul className="space-y-2">
                          {section.calloutList.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-2 h-2 w-2 rounded-full bg-zinc-500" />
                              <span className="text-zinc-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {"cta" in section && section.cta && (
                    <div className="mt-5">
                      <Link
                        href={section.cta.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                      >
                        {section.cta.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Final Note */}
          <motion.div
            className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">Final Note</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              By using our Site, you acknowledge that you have read and understood
              these Terms of Service. If you do not agree, please discontinue use of
              the Site.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Return Home
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/privacy-policy"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
