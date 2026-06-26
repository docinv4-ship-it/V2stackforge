import type { Metadata } from "next";
import { getAllTools } from "@/lib/tools/get-tool";
import ToolsListClient from "./tools-list-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "All Tools | StackForge AI",
  description: "Browse only the approved tools. No rankings, no comparisons, no guides on this page.",
};

export default async function ToolsPage() {
  // 🎯 SERVER SIDE DATABASE HIT: Live pools load directly
  const allTools = await getAllTools();

  return (
    <div className="space-y-6 pt-4">
      {/* 🚀 CLIENT CONTROLLER INTERFACE: Top card removed completely, straight to the interface */}
      <ToolsListClient initialTools={allTools} />
    </div>
  );
}
