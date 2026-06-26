"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "./VerifiedBadge";
import type { ToolOwnershipRow, ToolSnapshot } from "@/lib/tool-owner";

type ClaimButtonProps = {
  toolSlug: string;
  toolName: string;
  website?: string;
  toolId?: string | number;
  className?: string;
};

type OwnershipCheckResponse = {
  ok: boolean;
  tool?: ToolSnapshot | null;
  rows: ToolOwnershipRow[];
  currentUserRow: ToolOwnershipRow | null;
  approvedRow: ToolOwnershipRow | null;
  error?: string;
};

const USER_STORAGE_KEY = "stackforge_tool_owner_user_id";

function createLocalUserId(): string {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(USER_STORAGE_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(USER_STORAGE_KEY, generated);
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

  return (await response.json()) as Record<string, unknown>;
}

function getPrimaryStatusLabel(row?: ToolOwnershipRow | null): string {
  if (!row) return "No claim yet";
  if (row.status === "approved") return row.verified ? "Verified Vendor" : "Approved";
  if (row.status === "rejected") return "Rejected";
  return row.verified ? "Domain Verified" : "Claim Pending";
}

export function ClaimButton({
  toolSlug,
  toolName,
  website = "",
  toolId,
  className = "",
}: ClaimButtonProps) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ownership, setOwnership] = useState<OwnershipCheckResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState(website);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const currentUserRow = ownership?.currentUserRow ?? null;
  const approvedRow = ownership?.approvedRow ?? null;
  const hasApprovedOwner = Boolean(approvedRow);
  const ownedByCurrentUser = Boolean(
    currentUserRow && currentUserRow.status === "approved"
  );
  const currentStatusLabel = getPrimaryStatusLabel(currentUserRow || approvedRow);

  const badgeRow = useMemo(() => {
    if (ownedByCurrentUser) return currentUserRow;
    if (approvedRow) return approvedRow;
    if (currentUserRow) return currentUserRow;
    return null;
  }, [approvedRow, currentUserRow, ownedByCurrentUser]);

  async function refreshOwnership(currentId = userId) {
    if (!currentId) return;
    setLoading(true);

    try {
      const result = (await postOwnershipAction({
        action: "check",
        toolSlug,
        userId: currentId,
      })) as OwnershipCheckResponse;

      if (result.ok) {
        setOwnership(result);
      } else {
        setMessage(result.error || "Failed to load ownership state.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = createLocalUserId();
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    void refreshOwnership(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, toolSlug]);

  async function handleSubmitClaim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    setMessage("");

    try {
      const result = await postOwnershipAction({
        action: "claim",
        toolSlug,
        toolId: toolId ? String(toolId) : undefined,
        userId,
        companyEmail,
        companyWebsite: companyWebsite || website,
        notes,
      });

      if (!result.ok) {
        setMessage((result.error as string) || "Claim could not be created.");
        return;
      }

      const responseRow = result.row as ToolOwnershipRow | undefined;
      setMessage(result.message ? String(result.message) : "Claim submitted.");
      setModalOpen(false);

      if (responseRow?.company_email) {
        setCompanyEmail(responseRow.company_email);
      }

      await refreshOwnership();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={["flex items-center gap-2", className].join(" ")}>
        <span className="h-8 w-28 animate-pulse rounded-full bg-zinc-100" />
        <span className="h-9 w-24 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    );
  }

  if (hasApprovedOwner) {
    return (
      <div className={["flex flex-wrap items-center gap-2", className].join(" ")}>
        <VerifiedBadge
          status={approvedRow?.status}
          verified={approvedRow?.verified}
        />

        {ownedByCurrentUser ? (
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-zinc-900 px-4 text-xs font-medium text-white hover:bg-black"
          >
            <Link href="/dashboard/tools">Manage Tool</Link>
          </Button>
        ) : (
          <span className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-500">
            Claimed by vendor
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2">
        <VerifiedBadge status={currentUserRow?.status} verified={currentUserRow?.verified} />
        <span className="text-xs text-zinc-500">{currentStatusLabel}</span>
      </div>

      {message ? (
        <p className="mb-3 text-xs leading-relaxed text-zinc-500">{message}</p>
      ) : null}

      <Button
        type="button"
        size="sm"
        className="rounded-xl bg-zinc-900 px-4 text-xs font-medium text-white hover:bg-black"
        onClick={() => {
          setCompanyWebsite(website);
          setModalOpen(true);
        }}
      >
        Claim This Tool
      </Button>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">Claim {toolName}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                  Verify the business email and company website before submitting the claim.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Company Email
                </label>
                <input
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="founder@company.com"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Company Website
                </label>
                <input
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional note for moderation"
                  className="min-h-24 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-zinc-900 px-4 text-xs font-medium text-white hover:bg-black"
                >
                  {submitting ? "Submitting..." : "Submit Claim"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border-zinc-200 px-4 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}