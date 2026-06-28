import "server-only";

import { randomBytes } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getToolBySlug } from "@/lib/tools/get-tool";

export type ToolOwnerRole = "owner" | "admin" | "editor";
export type ToolOwnerStatus = "pending" | "approved" | "rejected";

export type ToolSnapshot = {
  id: string | null;
  slug: string;
  name: string;
  website: string;
};

export type ToolOwnershipRow = {
  id: string;
  tool_id: string | null;
  tool_slug: string;
  tool_name: string;
  tool_website: string | null;

  user_id: string;
  role: ToolOwnerRole;
  status: ToolOwnerStatus;

  full_name: string | null;
  job_title: string | null;
  linkedin_url: string | null;

  company_email: string;
  company_domain: string;
  verification_method: string;

  email_verified: boolean;
  email_verified_at: string | null;
  verification_token: string | null;
  verification_token_expires_at: string | null;

  admin_action_token: string | null;
  admin_notified_at: string | null;

  verified: boolean;
  verified_at: string | null;

  approved_by: string | null;
  approved_at: string | null;
  decision_at: string | null;
  decision_note: string | null;

  notes: string | null;

  created_at: string;
  updated_at: string;
};

let cachedAdminClient: SupabaseClient | null = null;

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function ensureHttpUrl(value: string, name: string): string {
  const trimmed = normalizeText(value);
  if (!trimmed) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error(`${name} must be a valid HTTP or HTTPS URL`);
  }

  return trimmed.replace(/\/+$/, "");
}

function getRequiredEnv(value: string | undefined, name: string): string {
  const resolved = normalizeText(value);
  if (!resolved) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return resolved;
}

function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return ensureHttpUrl(raw, "NEXT_PUBLIC_SITE_URL");
}

function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function getAdminSupabaseClient(): SupabaseClient {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const supabaseUrl = ensureHttpUrl(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    "SUPABASE_URL"
  );

  const serviceRoleKey = getRequiredEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    "SUPABASE_SERVICE_ROLE_KEY"
  );

  cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cachedAdminClient;
}

export function normalizeDomain(value: unknown): string {
  const input = normalizeText(value).toLowerCase();
  if (!input) return "";

  if (input.includes("@")) {
    const emailDomain = input.split("@").pop() || "";
    return emailDomain.replace(/^www\./, "").replace(/\/.*$/, "").trim();
  }

  try {
    const url = input.startsWith("http://") || input.startsWith("https://")
      ? input
      : `https://${input}`;
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase().replace(/^www\./, "").trim();
  } catch {
    return input.replace(/^www\./, "").split("/")[0].trim();
  }
}

export function domainsMatch(a: unknown, b: unknown): boolean {
  const left = normalizeDomain(a);
  const right = normalizeDomain(b);
  if (!left || !right) return false;
  return left === right;
}

async function getToolSnapshotBySlug(slug: string): Promise<ToolSnapshot> {
  const db = getAdminSupabaseClient();
  const normalizedSlug = normalizeText(slug).toLowerCase();

  if (!normalizedSlug) {
    throw new Error("toolSlug is required");
  }

  const { data, error } = await db
    .from("tools")
    .select("id, slug, name, website, affiliate_link, affiliate_url")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (error || !data) {
    throw new Error(`Tool not found for slug: ${normalizedSlug}`);
  }

  const raw = data as {
    id?: string | number | null;
    slug?: string | null;
    name?: string | null;
    website?: string | null;
    affiliate_link?: string | null;
    affiliate_url?: string | null;
  };

  return {
    id: raw.id === null || raw.id === undefined ? null : String(raw.id),
    slug: normalizeText(raw.slug || normalizedSlug).toLowerCase(),
    name: normalizeText(raw.name || normalizedSlug),
    website: normalizeText(raw.website || raw.affiliate_link || raw.affiliate_url || ""),
  };
}

function sortOwnershipRows(rows: ToolOwnershipRow[]): ToolOwnershipRow[] {
  return [...rows].sort((a, b) => {
    const statusWeight = (status: ToolOwnerStatus) =>
      status === "approved" ? 0 : status === "pending" ? 1 : 2;

    const statusDiff = statusWeight(a.status) - statusWeight(b.status);
    if (statusDiff !== 0) return statusDiff;

    if (a.verified !== b.verified) {
      return Number(b.verified) - Number(a.verified);
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function listToolOwnershipRows(): Promise<ToolOwnershipRow[]> {
  const db = getAdminSupabaseClient();
  const { data, error } = await db
    .from("tool_owners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return sortOwnershipRows(data as ToolOwnershipRow[]);
}

export async function getToolOwnershipRowsBySlug(
  toolSlug: string
): Promise<ToolOwnershipRow[]> {
  const db = getAdminSupabaseClient();
  const normalizedSlug = normalizeText(toolSlug).toLowerCase();
  if (!normalizedSlug) return [];

  const { data, error } = await db
    .from("tool_owners")
    .select("*")
    .eq("tool_slug", normalizedSlug)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return sortOwnershipRows(data as ToolOwnershipRow[]);
}

export async function checkToolOwnership(input: {
  toolSlug?: string;
  userId?: string;
  includeAll?: boolean;
}): Promise<{
  tool?: ToolSnapshot | null;
  rows: ToolOwnershipRow[];
  currentUserRow: ToolOwnershipRow | null;
  approvedRow: ToolOwnershipRow | null;
  latestRow: ToolOwnershipRow | null;
}> {
  const rows = input.includeAll
    ? await listToolOwnershipRows()
    : input.toolSlug
      ? await getToolOwnershipRowsBySlug(input.toolSlug)
      : [];

  let tool: ToolSnapshot | null = null;

  if (input.toolSlug) {
    try {
      tool = await getToolSnapshotBySlug(input.toolSlug);
    } catch {
      tool = null;
    }
  }

  const currentUserRow = input.userId
    ? rows.find((row) => row.user_id === input.userId) ?? null
    : null;

  const approvedRow = rows.find((row) => row.status === "approved") ?? null;
  const latestRow = rows[0] ?? null;

  return {
    tool,
    rows,
    currentUserRow,
    approvedRow,
    latestRow,
  };
}

function escapeHtml(value: string): string {
  return normalizeText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = getRequiredEnv(process.env.RESEND_API_KEY, "RESEND_API_KEY");
  const from = getRequiredEnv(process.env.RESEND_FROM_EMAIL, "RESEND_FROM_EMAIL");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Email send failed: ${detail || response.statusText}`);
  }
}

function buildClaimVerificationEmail(args: {
  tool: ToolSnapshot;
  row: ToolOwnershipRow;
}) {
  const siteUrl = getSiteUrl();
  const verifyUrl = new URL("/api/tool-owner/verify", siteUrl);
  verifyUrl.searchParams.set("token", args.row.verification_token || "");

  const companyName = escapeHtml(args.row.full_name || "there");
  const toolName = escapeHtml(args.tool.name);
  const subject = `Verify your ownership claim for ${args.tool.name}`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 12px">Verify your StackForge ownership claim</h2>
      <p style="margin:0 0 12px">Hi ${companyName},</p>
      <p style="margin:0 0 12px">We received an ownership request for <strong>${toolName}</strong>.</p>
      <p style="margin:0 0 20px">Click the button below to verify that you can access this company email.</p>
      <p style="margin:0 0 20px">
        <a href="${verifyUrl.toString()}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">
          Verify Email
        </a>
      </p>
      <p style="margin:0;color:#6b7280;font-size:12px">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  const text =
    `Verify your StackForge ownership claim\n\n` +
    `Tool: ${args.tool.name}\n` +
    `Company email: ${args.row.company_email}\n\n` +
    `Open this link to verify your email:\n${verifyUrl.toString()}\n`;

  return { subject, html, text };
}

function buildAdminEmail(args: { tool: ToolSnapshot; row: ToolOwnershipRow }) {
  const siteUrl = getSiteUrl();

  const approveUrl = new URL("/api/tool-owner/decision", siteUrl);
  approveUrl.searchParams.set("token", args.row.admin_action_token || "");
  approveUrl.searchParams.set("decision", "approve");

  const rejectUrl = new URL("/api/tool-owner/decision", siteUrl);
  rejectUrl.searchParams.set("token", args.row.admin_action_token || "");
  rejectUrl.searchParams.set("decision", "reject");

  const subject = `New verified ownership claim: ${args.tool.name}`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 12px">New verified ownership claim</h2>
      <p style="margin:0 0 12px"><strong>Tool:</strong> ${escapeHtml(args.tool.name)}</p>
      <p style="margin:0 0 12px"><strong>Company email:</strong> ${escapeHtml(args.row.company_email)}</p>
      <p style="margin:0 0 12px"><strong>Full name:</strong> ${escapeHtml(args.row.full_name || "")}</p>
      <p style="margin:0 0 12px"><strong>Job title:</strong> ${escapeHtml(args.row.job_title || "")}</p>
      <p style="margin:0 0 12px"><strong>LinkedIn:</strong> ${escapeHtml(args.row.linkedin_url || "")}</p>
      <p style="margin:0 0 12px"><strong>Website:</strong> ${escapeHtml(args.row.tool_website || args.tool.website)}</p>
      <p style="margin:0 0 20px"><strong>Notes:</strong> ${escapeHtml(args.row.notes || "")}</p>
      <p style="margin:0 0 12px">
        <a href="${approveUrl.toString()}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;margin-right:8px">
          Accept
        </a>
        <a href="${rejectUrl.toString()}" style="display:inline-block;background:#ffffff;color:#111827;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;border:1px solid #d4d4d8">
          Reject
        </a>
      </p>
    </div>
  `;

  const text =
    `New verified ownership claim\n\n` +
    `Tool: ${args.tool.name}\n` +
    `Company email: ${args.row.company_email}\n` +
    `Full name: ${args.row.full_name || ""}\n` +
    `Job title: ${args.row.job_title || ""}\n` +
    `LinkedIn: ${args.row.linkedin_url || ""}\n` +
    `Website: ${args.row.tool_website || args.tool.website}\n` +
    `Notes: ${args.row.notes || ""}\n\n` +
    `Accept: ${approveUrl.toString()}\n` +
    `Reject: ${rejectUrl.toString()}\n`;

  return { subject, html, text };
}

function buildDecisionEmail(args: {
  tool: ToolSnapshot;
  row: ToolOwnershipRow;
  decision: "approve" | "reject";
}) {
  const approved = args.decision === "approve";
  const subject = approved
    ? `Ownership approved for ${args.tool.name}`
    : `Ownership rejected for ${args.tool.name}`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 12px">${approved ? "Ownership approved" : "Ownership rejected"}</h2>
      <p style="margin:0 0 12px">Tool: <strong>${escapeHtml(args.tool.name)}</strong></p>
      <p style="margin:0 0 12px">${approved
        ? "Your ownership claim has been approved."
        : "Your ownership claim has been rejected."}</p>
    </div>
  `;

  const text =
    `${approved ? "Ownership approved" : "Ownership rejected"}\n\n` +
    `Tool: ${args.tool.name}\n` +
    `${approved ? "Your ownership claim has been approved." : "Your ownership claim has been rejected."}\n`;

  return { subject, html, text };
}

async function getExistingApprovedClaim(toolSlug: string): Promise<ToolOwnershipRow | null> {
  const rows = await getToolOwnershipRowsBySlug(toolSlug);
  return rows.find((row) => row.status === "approved") ?? null;
}

export async function claimToolOwnership(input: {
  toolSlug: string;
  fullName: string;
  jobTitle: string;
  companyEmail: string;
  linkedinUrl?: string;
  companyWebsite?: string;
  notes?: string;
}): Promise<{
  tool: ToolSnapshot;
  row: ToolOwnershipRow;
}> {
  const db = getAdminSupabaseClient();
  const tool = await getToolSnapshotBySlug(input.toolSlug);

  const companyEmail = normalizeText(input.companyEmail).toLowerCase();
  const fullName = normalizeText(input.fullName);
  const jobTitle = normalizeText(input.jobTitle);
  const linkedinUrl = normalizeText(input.linkedinUrl || "");
  const notes = normalizeText(input.notes || "") || null;

  if (!fullName) {
    throw new Error("Full name is required");
  }

  if (!jobTitle) {
    throw new Error("Job title is required");
  }

  if (!companyEmail || !companyEmail.includes("@")) {
    throw new Error("A valid company email is required");
  }

  const approvedClaim = await getExistingApprovedClaim(tool.slug);
  if (approvedClaim) {
    throw new Error("This profile is already owned");
  }

  const now = new Date();
  const verificationToken = generateToken(32);
  const adminActionToken = generateToken(32);
  const verificationTokenExpiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 48).toISOString();

  const payload = {
    tool_id: tool.id,
    tool_slug: tool.slug,
    tool_name: tool.name,
    tool_website: tool.website || null,

    user_id: companyEmail,
    role: "owner" as const,
    status: "pending" as const,

    full_name: fullName,
    job_title: jobTitle,
    linkedin_url: linkedinUrl || null,

    company_email: companyEmail,
    company_domain: normalizeDomain(companyEmail),
    verification_method: "email_domain",

    email_verified: false,
    email_verified_at: null,
    verification_token: verificationToken,
    verification_token_expires_at: verificationTokenExpiresAt,

    admin_action_token: adminActionToken,
    admin_notified_at: null,

    verified: false,
    verified_at: null,

    approved_by: null,
    approved_at: null,
    decision_at: null,
    decision_note: null,

    notes,
  };

  const { data, error } = await db
    .from("tool_owners")
    .upsert(payload, {
      onConflict: "tool_slug,user_id",
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to submit ownership claim");
  }

  const row = data as ToolOwnershipRow;

  const email = buildClaimVerificationEmail({ tool, row });
  await sendEmail({
    to: row.company_email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  return { tool, row };
}

export async function verifyOwnershipEmail(token: string): Promise<ToolOwnershipRow> {
  const db = getAdminSupabaseClient();
  const normalizedToken = normalizeText(token);

  if (!normalizedToken) {
    throw new Error("Verification token is required");
  }

  const { data: row, error } = await db
    .from("tool_owners")
    .select("*")
    .eq("verification_token", normalizedToken)
    .maybeSingle();

  if (error || !row) {
    throw new Error("Verification link is invalid");
  }

  let claim = row as ToolOwnershipRow;

  if (claim.verification_token_expires_at) {
    const expiry = new Date(claim.verification_token_expires_at).getTime();
    if (!Number.isNaN(expiry) && expiry < Date.now()) {
      throw new Error("Verification link has expired");
    }
  }

  if (!claim.email_verified) {
    const { data: updated, error: updateError } = await db
      .from("tool_owners")
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        verification_token: null,
        verification_token_expires_at: null,
      })
      .eq("id", claim.id)
      .select("*")
      .single();

    if (updateError || !updated) {
      throw new Error(updateError?.message || "Failed to verify email");
    }

    claim = updated as ToolOwnershipRow;
  }

  if (!claim.admin_notified_at) {
    const tool = await getToolSnapshotBySlug(claim.tool_slug);
    const adminEmail = getRequiredEnv(
      process.env.STACKFORGE_ADMIN_EMAIL,
      "STACKFORGE_ADMIN_EMAIL"
    );
    const email = buildAdminEmail({ tool, row: claim });

    await sendEmail({
      to: adminEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    const { error: notifyError } = await db
      .from("tool_owners")
      .update({
        admin_notified_at: new Date().toISOString(),
      })
      .eq("id", claim.id);

    if (notifyError) {
      throw new Error(notifyError.message || "Failed to mark admin notification");
    }
  }

  return claim;
}

export async function decideOwnershipClaim(input: {
  token: string;
  decision: "approve" | "reject";
}): Promise<ToolOwnershipRow> {
  const db = getAdminSupabaseClient();
  const normalizedToken = normalizeText(input.token);
  if (!normalizedToken) {
    throw new Error("Decision token is required");
  }

  const { data: row, error } = await db
    .from("tool_owners")
    .select("*")
    .eq("admin_action_token", normalizedToken)
    .maybeSingle();

  if (error || !row) {
    throw new Error("Decision link is invalid");
  }

  const claim = row as ToolOwnershipRow;
  const nowIso = new Date().toISOString();

  const status: ToolOwnerStatus = input.decision === "approve" ? "approved" : "rejected";

  const updatePayload =
    input.decision === "approve"
      ? {
          status,
          verified: true,
          verified_at: claim.verified_at || nowIso,
          approved_by: "admin",
          approved_at: nowIso,
          decision_at: nowIso,
          decision_note: null,
          admin_action_token: null,
        }
      : {
          status,
          verified: false,
          approved_by: "admin",
          approved_at: null,
          decision_at: nowIso,
          decision_note: null,
          admin_action_token: null,
        };

  const { data: updated, error: updateError } = await db
    .from("tool_owners")
    .update(updatePayload)
    .eq("id", claim.id)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(updateError?.message || "Failed to update ownership decision");
  }

  const updatedRow = updated as ToolOwnershipRow;
  const tool = await getToolSnapshotBySlug(updatedRow.tool_slug);
  const email = buildDecisionEmail({
    tool,
    row: updatedRow,
    decision: input.decision,
  });

  await sendEmail({
    to: updatedRow.company_email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  return updatedRow;
}
