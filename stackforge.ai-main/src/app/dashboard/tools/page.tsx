"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/tool-owner/VerifiedBadge";
import type { ToolOwnershipRow } from "@/lib/tool-owner";
import { Button } from "@/components/ui/button";

type OwnershipResponse = {
  ok: boolean;
  rows: ToolOwnershipRow[];
  currentUserRow: ToolOwnershipRow | null;
  approvedRow: ToolOwnershipRow | null;
  error?: string;
};

const ADMIN_STORAGE_KEY = "stackforge_admin_user_id";

function createLocalAdminId(): string {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(ADMIN_STORAGE_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `admin_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(ADMIN_STORAGE_KEY, generated);
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

  return (await response.json()) as OwnershipResponse & Record<string, unknown>;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function getStatusTone(status: ToolOwnershipRow["status"]) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (status === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function ToolsDashboardPage() {
  const [adminId, setAdminId] = useState("");
  const [rows, setRows] = useState<ToolOwnershipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string>("");
  const [error, setError] = useState("");

  async function refresh() {
    if (!adminId) return;

    setLoading(true);
    setError("");

    try {
      const result = await postOwnershipAction({
        action: "check",
        includeAll: true,
        userId: adminId,
      });

      if (!result.ok) {
        setError(result.error || "Could not load claims.");
        setRows([]);
        return;
      }

      setRows((result.rows as ToolOwnershipRow[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load claims.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAdminId(createLocalAdminId());
  }, []);

  useEffect(() => {
    if (!adminId) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((row) => row.status === "pending").length;
    const approved = rows.filter((row) => row.status === "approved").length;
    const verified = rows.filter((row) => row.verified).length;
    return { total, pending, approved, verified };
  }, [rows]);

  async function runAction(action: "verify" | "approve" | "reject", claimId: string) {
    if (!claimId) return;

    setActionLoading(claimId);

    try {
      const payload =
        action === "reject"
          ? { action, claimId, rejectedBy: "admin" }
          : action === "approve"
            ? { action, claimId, approvedBy: "admin" }
            : { action, claimId };

      const result = await postOwnershipAction(payload);

      if (!result.ok) {
        setError(result.error || "Action failed.");
        return;
      }

      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionLoading("");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              StackForge Ownership Center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
              Tool Claims
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Claim requests, domain verification, and approval workflow for vendor ownership.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Total
              </div>
              <div className="text-xl font-bold text-zinc-950">{stats.total}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Pending
              </div>
              <div className="text-xl font-bold text-amber-600">{stats.pending}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Approved
              </div>
              <div className="text-xl font-bold text-emerald-600">{stats.approved}</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Verified
              </div>
              <div className="text-xl font-bold text-blue-600">{stats.verified}</div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-sm text-zinc-500 shadow-sm">
            Loading claims…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-10 text-sm text-zinc-500 shadow-sm">
            No ownership requests yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="divide-y divide-zinc-200">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-zinc-950">
                        {row.tool_name}
                      </h2>
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                        {row.tool_slug}
                      </span>
                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          getStatusTone(row.status),
                        ].join(" ")}
                      >
                        {row.status}
                      </span>
                      <VerifiedBadge status={row.status} verified={row.verified} />
                    </div>

                    <div className="mt-2 grid gap-2 text-sm text-zinc-500 md:grid-cols-2">
                      <div>
                        <span className="font-medium text-zinc-700">Company:</span>{" "}
                        {row.company_email}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-700">Domain:</span>{" "}
                        {row.company_domain}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-700">Role:</span> {row.role}
                      </div>
                      <div>
                        <span className="font-medium text-zinc-700">Created:</span>{" "}
                        {formatDate(row.created_at)}
                      </div>
                    </div>

                    {row.notes ? (
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                        {row.notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                      onClick={() => runAction("verify", row.id)}
                      disabled={actionLoading === row.id}
                    >
                      {actionLoading === row.id ? "Working..." : "Verify"}
                    </Button>

                    <Button
                      type="button"
                      className="rounded-xl bg-zinc-900 text-xs font-medium text-white hover:bg-black"
                      onClick={() => runAction("approve", row.id)}
                      disabled={actionLoading === row.id}
                    >
                      Approve
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-red-200 text-xs font-medium text-red-700 hover:bg-red-50"
                      onClick={() => runAction("reject", row.id)}
                      disabled={actionLoading === row.id}
                    >
                      Reject
                    </Button>

                    <Button
                      type="button"
                      asChild
                      variant="outline"
                      className="rounded-xl border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                    >
                      <Link href={`/tool/${row.tool_slug}`}>Open Tool</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}