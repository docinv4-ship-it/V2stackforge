"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Database,
  Cookie,
  BarChart3,
  Link2,
  LockKeyhole,
  FileText,
  ArrowRight,
  Globe2,
  BadgeCheck,
} from "lucide-react";

const policySections = [
  {
    title: "Introduction",
    content: [
      `StackForge AI ("we," "our," or "us") operates the website stackforge.ai (the "Site"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site.`,
      `Please read this policy carefully. If you do not agree with the terms, please do not access the Site.`,
    ],
  },
  {
    title: "Data Collection",
    content: [
      "We collect information that you provide directly to us, including:",
    ],
    list: [
      {
        label: "Personal Information",
        text: "Name, email address, and any other information you voluntarily provide when subscribing to our newsletter or contacting us.",
      },
      {
        label: "Usage Data",
        text: "Information about how you access and use the Site, including your IP address, browser type, operating system, referring URLs, and pages viewed.",
      },
      {
        label: "Device Information",
        text: "Information about the device you use to access our Site, including device type and identifiers.",
      },
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    content: [
      "We use cookies and similar tracking technologies to collect and track information and to improve your experience on our Site. Cookies are files with a small amount of data that may include an anonymous unique identifier.",
    ],
    calloutTitle: "Types of Cookies We Use",
    calloutList: [
      {
        label: "Essential Cookies",
        text: "Required for the Site to function properly.",
      },
      {
        label: "Analytics Cookies",
        text: "Help us understand how visitors interact with our Site.",
      },
      {
        label: "Marketing Cookies",
        text: "Used to measure campaign performance and support advertising-related activity.",
      },
    ],
    footer:
      "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.",
  },
  {
    title: "Analytics and Third-Party Services",
    content: [
      "We use third-party services to collect, monitor, and analyze how visitors use our Site:",
    ],
    list: [
      {
        label: "Google Analytics",
        text: "Used to analyze user behavior and site performance.",
      },
      {
        label: "Heatmap Tools",
        text: "Used to understand how visitors interact with pages and layouts.",
      },
      {
        label: "Advertising Pixels",
        text: "Used for measurement, attribution, and retargeting where applicable.",
      },
    ],
    footer:
      "These third-party services have their own privacy policies and we encourage you to review them.",
  },
  {
    title: "Affiliate Links",
    content: [
      "Our Site contains affiliate links to products and services. When you click on these links and make a purchase, we may earn a commission at no additional cost to you.",
    ],
    calloutTitle: "How Affiliate Links Affect Your Privacy",
    calloutList: [
      {
        label: "Tracking Cookies",
        text: "Clicking affiliate links may result in cookies being placed on your device by the merchant.",
      },
      {
        label: "Referral Attribution",
        text: "These cookies help merchants track referrals and attribute sales.",
      },
      {
        label: "Merchant Data",
        text: "We do not have access to information collected by merchant websites.",
      },
    ],
  },
  {
    title: "Data Sharing and Disclosure",
    content: [
      "We may share your information in the following situations:",
    ],
    list: [
      {
        label: "With Service Providers",
        text: "We share information with third-party vendors who perform services on our behalf.",
      },
      {
        label: "For Legal Purposes",
        text: "We may disclose information if required by law or in response to valid requests by public authorities.",
      },
      {
        label: "Business Transfers",
        text: "Information may be transferred in connection with a merger, acquisition, or sale of assets.",
      },
    ],
  },
  {
    title: "Your Rights and Choices",
    content: [
      "Depending on your location, you may have certain rights regarding your personal information:",
    ],
    list: [
      {
        label: "Access",
        text: "Request access to your personal information.",
      },
      {
        label: "Correction",
        text: "Request correction of inaccurate data.",
      },
      {
        label: "Deletion",
        text: "Request deletion of your personal information.",
      },
      {
        label: "Opt-Out",
        text: "Opt out of marketing communications and certain data processing.",
      },
    ],
  },
  {
    title: "Data Security",
    content: [
      "We implement appropriate technical and organizational security measures to protect your personal information.",
      "However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Policy Updates",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or business operations.",
      "When we do, we will revise the date above and, where appropriate, provide additional notice on the Site.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-20 lg:py-32">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="privacy-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#privacy-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
              <Shield className="h-4 w-4 text-zinc-600" />
              Your Privacy Matters
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We are committed to protecting your privacy and being transparent about
            how we collect, use, and share your information.
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
          {/* Quick Summary */}
          <motion.div
            className="mb-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">Quick Summary</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              This policy explains what data we collect, how we use cookies and
              analytics, how affiliate links work, and what choices you have. The
              design of this page is intentionally clean and readable, with no
              distracting color noise or hidden text.
            </p>
          </motion.div>

          <div className="space-y-8">
            {policySections.map((section) => (
              <motion.div
                key={section.title}
                className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 flex items-center gap-3">
                  {section.title === "Data Collection" && (
                    <Database className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Cookies and Tracking Technologies" && (
                    <Cookie className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Analytics and Third-Party Services" && (
                    <BarChart3 className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Affiliate Links" && (
                    <Link2 className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Data Sharing and Disclosure" && (
                    <Globe2 className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Your Rights and Choices" && (
                    <Shield className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Data Security" && (
                    <LockKeyhole className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Policy Updates" && (
                    <FileText className="h-6 w-6 text-zinc-700" />
                  )}
                  {section.title === "Introduction" && (
                    <FileText className="h-6 w-6 text-zinc-700" />
                  )}
                  <h2 className="text-2xl font-bold text-zinc-900">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.content.map((paragraph) => (
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
                          key={item.label}
                          className="rounded-xl border border-zinc-200 bg-white px-4 py-3"
                        >
                          <p className="font-medium text-zinc-900">{item.label}</p>
                          <p className="mt-1 text-sm leading-6 text-zinc-600">{item.text}</p>
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
                          <li key={item.label} className="flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-zinc-500" />
                            <span className="text-zinc-600">
                              <span className="font-medium text-zinc-900">
                                {item.label}:
                              </span>{" "}
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {"footer" in section && section.footer && (
                  <p className="mt-5 leading-relaxed text-zinc-500">{section.footer}</p>
                )}
              </motion.div>
            ))}
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
              this Privacy Policy. If you do not agree, please discontinue use of the
              Site.
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
                href="/affiliate-disclosure"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Affiliate Disclosure
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
