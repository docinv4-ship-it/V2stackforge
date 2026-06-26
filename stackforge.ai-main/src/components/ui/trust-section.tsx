"use client";

import { motion } from "framer-motion";
import { Shield, FileCheck, Search, Award } from "lucide-react";

const trustItems = [
  {
    icon: FileCheck,
    title: "Editorial Integrity",
    description: "We maintain strict editorial guidelines and never accept payment for reviews.",
  },
  {
    icon: Search,
    title: "Thorough Research",
    description: "Every review is based on hands-on testing and in-depth analysis.",
  },
  {
    icon: Shield,
    title: "Affiliate Disclosure",
    description: "We clearly disclose affiliate relationships and how they impact our content.",
  },
  {
    icon: Award,
    title: "Expert Analysis",
    description: "Our team has years of experience with marketing tools and online business.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustItems.map((item, index) => (
          <motion.div
            key={index}
            className="glass glass-hover rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-bg mb-4">
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-[#a1a1aa]">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
