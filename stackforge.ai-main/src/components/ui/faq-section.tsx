"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FAQ } from "@/lib/types";

interface FAQSectionProps {
  faqs: FAQ[];
  className?: string;
}

export function FAQSection({ faqs, className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-4", className)}>
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors"
          >
            {/* White color forced back to high-contrast dark zinc */}
            <span className="font-semibold text-zinc-900 pr-8 text-sm sm:text-base">
              {faq.question}
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-zinc-500 transition-transform duration-200 flex-shrink-0",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Answer text adjusted to perfectly readable tone against light background */}
                <div className="px-6 pb-5 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
