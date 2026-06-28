"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

import type { ToolOwnershipRow } from "@/lib/tool-owner";
import { VerifiedBadge } from "@/components/tool-owner/VerifiedBadge";
import { Button } from "@/components/ui/button";

type OwnershipResponse = {
  ok: boolean;
  rows: ToolOwnershipRow[];
  currentUserRow: ToolOwnershipRow | null;
  approvedRow: ToolOwnershipRow | null;
  error?: string;
};

const STORAGE_KEY = "stackforge_tool_owner_user_id";

function createLocalUserId(): string {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}

async function postOwnershipAction(payload: Record<string, unknown>) {
  const response = await fetch("/api/tool-owner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return (await response.json()) as OwnershipResponse;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function getStatusClass(status: ToolOwnershipRow["status"]) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function CompanyDashboardPage() {
  const [userId, setUserId] = useState("");
  const [rows, setRows] = useState<ToolOwnershipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh(currentUserId: string) {
    if (!currentUserId) return;

    setLoading(true);
    setError("");

    try {
      const result = await postOwnershipAction({
        action: "check",
        includeAll: true,
        userId: currentUserId,
      });

      if (!result.ok) {
        setError(result.error || "Could not load dashboard.");
        setRows([]);
        return;
      }

      const ownedRows = (result.rows || []).filter((row) => row.user_id === currentUserId);
      setRows(ownedRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUserId(createLocalUserId());
  }, []);

  useEffect(() => {
    if (!userId) return;
    void refresh(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((row) => row.status === "pending").length;
    const approved = rows.filter((row) => row.status === "approved").length;
    const verified = rows.filter((row) => row.verified).length;

    return { total, pending, approved, verified };
  }, [rows]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              <Building2 className="h-3.5 w-3.5 text-zinc-400" />
              Company dashboard
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
              Your ownership workspace
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600">
              This dashboard shows the claims connected to this browser identity. After approval, the verified vendor state can be used for future edit and management layers.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StatCard label="Total claims" value={stats.total} />
            <StatCard label="Pending" value={stats.pending} tone="amber" />
            <StatCard label="Approved" value={stats.approved} tone="emerald" />
            <StatCard label="Verified" value={stats.verified} tone="blue" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-sm text-zinc-500 shadow-sm">
            Loading your claims…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-10 text-center shadow-sm">
            <ShieldCheck className="mx-auto h-5 w-5 text-zinc-300" />
            <h2 className="mt-4 text-base font-bold text-zinc-950">No claims in this browser yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Start from the claim directory and open a tool profile to submit ownership.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild className="rounded-xl bg-zinc-950 text-white hover:bg-black">
                <Link href="/company/claim">Claim a tool</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-zinc-200">
                <Link href="/company">Company home</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {rows.map((row) => (
              <article
                key={row.id}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-zinc-950">{row.tool_name}</h2>
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        {row.tool_slug}
                      </span>
                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                          getStatusClass(row.status),
                        ].join(" ")}
                      >
                        {row.status}
                      </span>
                      <VerifiedBadge status={row.status} verified={row.verified} />
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
                      <div>
                        <span className="font-medium text-zinc-800">Company email:</span>{" "}
                        {row.company_email}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-800">Domain:</span>{" "}
                        {row.company_domain}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-800">Created:</span>{" "}
                        {formatDate(row.created_at)}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-800">Verified:</span>{" "}
                        {row.verified ? "Yes" : "No"}
                      </div>
                    </div>

                    {row.notes ? (
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-500">
                        {row.notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" className="rounded-xl border-zinc-200">
                      <Link href={`/company/claim/${row.tool_slug}`}>Open claim</Link>
                    </Button>

                    <Button asChild className="rounded-xl bg-zinc-950 text-white hover:bg-black">
                      <Link href={`/tool/${row.tool_slug}`}>Open public profile</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "amber" | "emerald" | "blue";
}) {
  const toneClass =
    tone === "amber"
      ? "text-amber-600"
      : tone === "emerald"
        ? "text-emerald-600"
        : tone === "blue"
          ? "text-blue-600"
          : "text-zinc-950";

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-black ${toneClass}`}>{value}</div>
    </div>
  );
}
