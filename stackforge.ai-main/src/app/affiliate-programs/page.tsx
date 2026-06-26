"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Users, Award, Info } from "lucide-react";
import { ProgramCard } from "@/components/cards/program-card";
import { affiliatePrograms } from "@/lib/data/affiliate-programs";

export default function AffiliateProgramsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* FIX 1: REMOVED ABSTRACT GRID BACKGROUND LINES 
         The background grid overlay from previous version has been permanently removed for a cleaner card surface.
      */}

      {/* FIX 2: UPDATED HEADER BACKGROUND TO MATCH REVIEW DETAILS PAGE 
         Removed gradients; background is now direct pure #ffffff white with consistent zinc text structure.
      */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 bg-white border-b border-zinc-200">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Strict Monochromatic Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" />
            <span>Partner Programs</span>
          </motion.div>

          {/* Luxury System Header Typography */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Affiliate <span className="text-zinc-500 font-medium font-serif italic">Programs</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg font-medium text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Monetize your audience by promoting trusted tools. We&apos;ve partnered with the best enterprise platforms to bring you competitive commission rates.
          </motion.p>

          {/* Social Proof Intelligence Rail */}
          <motion.div
            className="flex items-center justify-center gap-6 text-[11px] font-bold tracking-wider uppercase text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/60 px-3 py-1.5 rounded-xl">
              <Award className="w-4 h-4 text-zinc-950" />
              <span>Verified Programs</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/60 px-3 py-1.5 rounded-xl">
              <Users className="w-4 h-4 text-zinc-950" />
              <span>Trusted Partners</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid Section - Ensuring Pure White Background Area */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-400 mb-3">
              Available Directory
            </h2>
            <p className="text-2xl font-bold tracking-tight text-zinc-950">
              Curated Asset Distribution Matrix
            </p>
          </motion.div>

          {/* Three-Column Flat Structural Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliatePrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-all duration-200"
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Intelligence Layer (How It Works) */}
      <section className="py-20 border-t border-zinc-200/80 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-400 mb-3">
              Operational Framework
            </h2>
            <p className="text-2xl font-bold tracking-tight text-zinc-950">
              How Allocation Pipelines Deploy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Join a Program", desc: "Sign up for an affiliate program through our verified onboarding routes. Most networks are entirely free to initialize." },
              { num: "02", title: "Share Content", desc: "Promote core platform utilities to your active business streams using unique referral tracking nodes." },
              { num: "03", title: "Collect Yield", desc: "When assets optimize conversions and execute standard license activations, your dashboard updates instantly." }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                {/* FIX 3: REMOVED // PREFEX */}
                <div className="font-mono text-xs font-bold text-zinc-400 tracking-wider mb-4">
                  NODE {step.num}
                </div>
                <h3 className="text-sm font-bold text-zinc-950 mb-2">{step.title}</h3>
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Transparency Ledger (Disclosure) - Strict White Bg Container */}
      <section className="py-20 border-t border-zinc-200/80 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-zinc-950 tracking-tight mb-3">Affiliate Disclosure</h3>
                <div className="space-y-4 text-xs font-medium text-zinc-600 leading-relaxed">
                  <p>
                    StackForge AI participates in institutional affiliate marketing workflows. This implies our infrastructure may acquire data-driven compensation allocations when specific outbound target links generate software license acquisition transactions. This system runs transparently with zero added cost adjustments applied to your active billing layer.
                  </p>
                  <p>
                    Strategic alignment protocols safeguard our core nodes: editorial integrity is strictly independent. Rankings, benchmarks, and research evaluations are compiled via transparent matrix testing models unaffected by partner configurations.
                  </p>
                  <p>
                    For detailed auditing regarding how our data validation layers interact with partner nodes, review our comprehensive{" "}
                    <Link href="/affiliate-disclosure" className="text-zinc-950 font-bold underline underline-offset-2 hover:text-zinc-700 transition-colors">
                      Affiliate Disclosure Terminal
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
