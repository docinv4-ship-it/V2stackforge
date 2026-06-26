"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Scale,
  Star,
  Shield,
  Users,
  FileSearch,
  ArrowRight,
  Mail,
} from "lucide-react";

export default function EditorialGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.04),transparent_40%),radial-gradient(circle_at_bottom,rgba(24,24,27,0.03),transparent_45%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
              <BookOpen className="h-4 w-4 text-zinc-600" />
              Editorial Standards
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold text-zinc-900 md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Editorial Guidelines
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our commitment to honest, thorough, and unbiased reviews. Learn how we
            evaluate products and maintain editorial independence.
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
          {/* Mission Statement */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              Our Editorial Mission
            </h2>
            <p className="leading-relaxed text-zinc-600">
              At StackForge AI, we are dedicated to providing accurate, honest,
              and valuable information to help online entrepreneurs make informed
              decisions about the tools they use. Our editorial team follows
              strict guidelines to ensure every piece of content meets the highest
              standards of quality and integrity.
            </p>
          </motion.div>

          {/* Review Methodology */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <FileSearch className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Review Methodology
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              Every product review on StackForge AI follows a rigorous methodology
              to ensure comprehensive and fair evaluations:
            </p>
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="mb-3 font-semibold text-zinc-900">Our Review Process:</h3>
              <ol className="list-inside list-decimal space-y-3 text-zinc-600">
                <li>
                  <span className="font-medium text-zinc-900">Product Selection:</span>{" "}
                  We identify products based on market popularity, user requests,
                  and industry trends.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">Hands-On Testing:</span>{" "}
                  Our team personally tests each product using real-world
                  scenarios.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">Feature Analysis:</span>{" "}
                  We evaluate each feature systematically against stated
                  capabilities.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">Comparison Research:</span>{" "}
                  We compare similar products to provide context.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">User Feedback:</span>{" "}
                  We consider verified user reviews and testimonials.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">Expert Input:</span>{" "}
                  Industry experts contribute specialized insights when relevant.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">Final Evaluation:</span>{" "}
                  All findings are compiled into a comprehensive review.
                </li>
              </ol>
            </div>
          </motion.div>

          {/* Scoring System */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Star className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">Scoring System</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              Our ratings are based on a 5-star scale derived from multiple weighted
              categories:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">
                    Features & Functionality
                  </h3>
                  <span className="font-bold text-zinc-700">25%</span>
                </div>
                <p className="text-sm text-zinc-600">
                  Breadth and depth of features, innovation, and utility.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">Ease of Use</h3>
                  <span className="font-bold text-zinc-700">20%</span>
                </div>
                <p className="text-sm text-zinc-600">
                  User interface, onboarding, and learning curve.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">Value for Money</h3>
                  <span className="font-bold text-zinc-700">20%</span>
                </div>
                <p className="text-sm text-zinc-600">
                  Pricing relative to features and market alternatives.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">Customer Support</h3>
                  <span className="font-bold text-zinc-700">15%</span>
                </div>
                <p className="text-sm text-zinc-600">
                  Response time, quality of assistance, and availability.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">
                    Performance & Reliability
                  </h3>
                  <span className="font-bold text-zinc-700">10%</span>
                </div>
                <p className="text-sm text-zinc-600">
                  Speed, uptime, and technical stability.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">Integrations</h3>
                  <span className="font-bold text-zinc-700">10%</span>
                </div>
                <p className="text-sm text-zinc-600">
                  Third-party integrations and API availability.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="mb-2 font-semibold text-zinc-900">
                Rating Scale Interpretation:
              </h3>
              <ul className="space-y-2 text-zinc-600">
                <li>
                  <span className="font-semibold text-zinc-900">5.0</span> - Exceptional,
                  industry-leading
                </li>
                <li>
                  <span className="font-semibold text-zinc-900">4.0-4.9</span> - Excellent,
                  highly recommended
                </li>
                <li>
                  <span className="font-semibold text-zinc-900">3.0-3.9</span> - Good,
                  solid choice
                </li>
                <li>
                  <span className="font-semibold text-zinc-900">2.0-2.9</span> - Fair, has
                  notable limitations
                </li>
                <li>
                  <span className="font-semibold text-zinc-900">1.0-1.9</span> - Poor,
                  significant issues
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Independence Statement */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Editorial Independence
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              Our editorial team operates independently from our commercial
              interests. Here is how we maintain this separation:
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-600">
              <li>
                <span className="font-medium text-zinc-900">Separation of Teams:</span>{" "}
                Our editorial and business development teams operate independently.
              </li>
              <li>
                <span className="font-medium text-zinc-900">No Review Influence:</span>{" "}
                Affiliate partnerships or advertising relationships never
                influence our review scores or recommendations.
              </li>
              <li>
                <span className="font-medium text-zinc-900">No Payment for Reviews:</span>{" "}
                We do not accept payment for positive reviews or coverage.
              </li>
              <li>
                <span className="font-medium text-zinc-900">Transparent Corrections:</span>{" "}
                If we make errors, we correct them promptly and transparently.
              </li>
              <li>
                <span className="font-medium text-zinc-900">Updated Reviews:</span>{" "}
                We update reviews when products change significantly or new
                information becomes available.
              </li>
            </ul>
          </motion.div>

          {/* Content Standards */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Scale className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Content Standards
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              All content published on StackForge AI must meet these standards:
            </p>
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <ul className="space-y-3 text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-zinc-400" />
                  <span>
                    <span className="font-medium text-zinc-900">Accuracy:</span>{" "}
                    All facts, claims, and specifications must be verified and
                    accurate.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-zinc-400" />
                  <span>
                    <span className="font-medium text-zinc-900">Completeness:</span>{" "}
                    Reviews must cover all relevant aspects, including limitations
                    and drawbacks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-zinc-400" />
                  <span>
                    <span className="font-medium text-zinc-900">Balance:</span>{" "}
                    Content must present both pros and cons fairly.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-zinc-400" />
                  <span>
                    <span className="font-medium text-zinc-900">Currency:</span>{" "}
                    Information must be current and regularly updated.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-zinc-400" />
                  <span>
                    <span className="font-medium text-zinc-900">Clarity:</span>{" "}
                    Technical terms must be explained for our target audience.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-zinc-400" />
                  <span>
                    <span className="font-medium text-zinc-900">Disclosure:</span>{" "}
                    All affiliate relationships must be clearly disclosed.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Comparison Guidelines */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              Comparison Guidelines
            </h2>
            <p className="mb-4 leading-relaxed text-zinc-600">
              When comparing products, we follow these principles:
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-600">
              <li>Compare apples to apples using equivalent tiers and features</li>
              <li>Consider total cost of ownership, not just upfront pricing</li>
              <li>Evaluate based on specific use cases and user needs</li>
              <li>Acknowledge when one product is objectively better</li>
              <li>Highlight scenarios where each product excels</li>
              <li>Use consistent criteria across all comparisons in a category</li>
            </ul>
          </motion.div>

          {/* User Trust */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Building User Trust
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              Our readers trust us because we prioritize their interests above
              all else. We maintain this trust by:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <h3 className="mb-2 font-semibold text-zinc-900">Honest Reviews</h3>
                <p className="text-sm text-zinc-600">
                  We rate products based on actual performance, not partnerships.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <h3 className="mb-2 font-semibold text-zinc-900">Regular Updates</h3>
                <p className="text-sm text-zinc-600">
                  We revisit and update reviews when products change.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <h3 className="mb-2 font-semibold text-zinc-900">Reader Feedback</h3>
                <p className="text-sm text-zinc-600">
                  We listen to reader experiences and incorporate their feedback.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <h3 className="mb-2 font-semibold text-zinc-900">Full Disclosure</h3>
                <p className="text-sm text-zinc-600">
                  We are transparent about our methods and relationships.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Corrections Policy */}
          <motion.div
            className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              Corrections Policy
            </h2>
            <p className="leading-relaxed text-zinc-600">
              When we identify errors in our content, we correct them promptly.
              Corrections are noted at the bottom of articles with the date and
              nature of the correction. If you spot an error, please contact us
              so we can address it immediately.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-zinc-700" />
              <h2 className="text-2xl font-bold text-zinc-900">
                Questions or Concerns?
              </h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              If you have questions about our editorial process or believe we
              have not met these standards, please contact us:
            </p>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-zinc-900">Email: editorial@stackforge.ai</p>
              <p className="mt-2 text-zinc-600">
                We take all feedback seriously and will respond promptly.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/affiliate-disclosure"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Affiliate Disclosure
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
