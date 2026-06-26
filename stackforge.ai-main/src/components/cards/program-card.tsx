"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Percent, Calendar, DollarSign } from "lucide-react";
import { AffiliateProgram } from "@/lib/types";
import { tools } from "@/lib/data/tools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProgramCardProps {
  program: AffiliateProgram;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const tool = tools.find((t) => t.slug === program.toolSlug);

  return (
    <motion.article
      className="glass glass-hover rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge variant="primary" className="mb-3">
              {program.commissionType} Commission
            </Badge>
            <h3 className="text-xl font-bold text-white">{program.name}</h3>
          </div>
          {tool && (
            <Link href={`/tool/${tool.slug}`} className="text-sm text-[#9333ea] hover:underline">
              View Tool
            </Link>
          )}
        </div>

        <p className="text-[#a1a1aa] mb-4 line-clamp-2">{program.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-bg mx-auto mb-2">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-[#a1a1aa]">Rate</p>
            <p className="text-sm font-semibold text-white">{program.commissionRate.split(" ")[0]}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1a1b23] mx-auto mb-2">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-[#a1a1aa]">Cookie</p>
            <p className="text-sm font-semibold text-white">{program.cookieDuration.split(" ")[0]}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1a1b23] mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-[#a1a1aa]">Min Payout</p>
            <p className="text-sm font-semibold text-white">{program.paymentThreshold.split(" ")[0]}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* ADD AFFILIATE LINK HERE */}
          <Button variant="primary" size="sm" className="flex-1" asChild>
            <a href={program.signupUrl} target="_blank" rel="noopener noreferrer">
              Join Program
              <ExternalLink className="ml-2 w-3 h-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/program/${program.slug}`}>Details</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
