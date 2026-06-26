"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Check,
  ArrowRight,
  Users,
  DollarSign,
  Clock,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AffiliateProgram } from "@/lib/types";

interface ProgramDetailContentProps {
  program: AffiliateProgram;
}

export function ProgramDetailContent({ program }: ProgramDetailContentProps) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-16 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_35%,transparent_65%,rgba(255,255,255,0.02))]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <span className="text-zinc-600">/</span>
              <Link
                href="/affiliate-programs"
                className="transition-colors hover:text-white"
              >
                Affiliate Programs
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-100">{program.name}</span>
            </nav>

            <div className="flex flex-col items-start gap-8 lg:flex-row">
              {/* Program Info */}
              <div className="flex-1">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm font-medium text-zinc-100">
                  <Award className="h-4 w-4 text-zinc-100" />
                  Affiliate Program
                </div>

                {/* Main Hero Title */}
                <h1 
                  className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" 
                  style={{ color: "#ffffff" }}
                >
                  {program.name}
                </h1>

                <p className="mb-8 max-w-3xl text-xl leading-8 text-zinc-300">
                  {program.description}
                </p>

                {/* CTA Button */}
                <Button variant="primary" size="lg" asChild>
                  <a
                    href={program.signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Join Program
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Program Stats Card */}
              <div className="w-full lg:w-80">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                  <h3 className="mb-4 text-base font-semibold text-zinc-100">
                    Commission Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                        <DollarSign className="h-5 w-5 text-zinc-100" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Commission Rate</p>
                        <p className="font-medium text-zinc-100">
                          {program.commissionRate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                        <Clock className="h-5 w-5 text-zinc-100" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Cookie Duration</p>
                        <p className="font-medium text-zinc-100">
                          {program.cookieDuration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                        <Users className="h-5 w-5 text-zinc-100" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">
                          Payment Threshold
                        </p>
                        <p className="font-medium text-zinc-100">
                          {program.paymentThreshold}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="border-b border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-950 shadow-sm">
              Overview
            </span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              About This Affiliate Program
            </h2>
            <p className="max-w-4xl text-lg leading-relaxed text-zinc-700">
              {program.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commission Details Section */}
      <section className="border-b border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-semibold text-zinc-950 shadow-sm">
              Commission Structure
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              How You Get Paid
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-700">
              Understand the earning potential with this affiliate program.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white">
                <DollarSign className="h-6 w-6 text-zinc-950" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-zinc-600">
                Commission Type
              </h3>
              <p className="text-xl font-bold text-zinc-950">
                {program.commissionType}
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white">
                <Award className="h-6 w-6 text-zinc-950" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-zinc-600">
                Commission Rate
              </h3>
              <p className="text-xl font-bold text-zinc-950">
                {program.commissionRate}
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white">
                <Clock className="h-6 w-6 text-zinc-950" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-zinc-600">
                Cookie Duration
              </h3>
              <p className="text-xl font-bold text-zinc-950">
                {program.cookieDuration}
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white">
                <Users className="h-6 w-6 text-zinc-950" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-zinc-600">
                Payment Threshold
              </h3>
              <p className="text-xl font-bold text-zinc-950">
                {program.paymentThreshold}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="border-b border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-950 shadow-sm">
              Highlights
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Program Highlights
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-700">
              Key benefits and features of this affiliate program.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {program.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                  <Check className="h-3 w-3 text-zinc-950" />
                </div>
                <span className="text-zinc-900">{highlight}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best For Section */}
      <section className="border-b border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-semibold text-zinc-950 shadow-sm">
              Best For
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Who Is This Program Best For?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-700">
              This affiliate program is ideal for the following audiences.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {program.bestFor.map((audience, index) => (
              <motion.div
                key={index}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white">
                  <ArrowRight className="h-5 w-5 text-zinc-950" />
                </div>
                <p className="text-zinc-900">{audience}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA Section */}
      <section className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-sm md:p-12">
            <div className="relative text-center">
              
              {/* Banner Heading */}
              <h2 
                className="mb-4 text-3xl font-bold tracking-tight md:text-4xl" 
                style={{ color: "#ffffff" }}
              >
                Ready to Join {program.name}?
              </h2>
              
              <p className="mx-auto mb-8 max-w-xl text-lg text-zinc-300">
                Start earning commissions today by promoting this product to your
                audience.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <a href={program.signupUrl} target="_blank" rel="noopener noreferrer">
                    Join Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                
                {/* FIX: Forced explicit white color and border structure for the "Browse All Programs" button inside dark banner */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-zinc-700 bg-transparent hover:bg-zinc-800 text-white transition-colors"
                  asChild
                >
                  <Link href="/affiliate-programs" style={{ color: "#ffffff" }} className="inline-flex items-center">
                    Browse All Programs
                    <ArrowRight className="ml-2 h-4 w-4" style={{ color: "#ffffff" }} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
