import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
  company_email: string;
  company_domain: string;
  verification_method: string;
  verified: boolean;
  verified_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type OwnershipSortWeight = Record<ToolOwnerStatus, number>;

const STATUS_WEIGHT: OwnershipSortWeight = {
  approved: 0,
  pending: 1,
  rejected: 2,
};

let cachedAdminClient: SupabaseClient | null = null;

function getRequiredEnv(value: string | undefined, name: string): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export function getAdminSupabaseClient(): SupabaseClient {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const supabaseUrl = getRequiredEnv(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
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
    },
  });

  return cachedAdminClient;
}

export function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
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
    const statusDiff = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
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
}> {
  const db = getAdminSupabaseClient();

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

  return {
    tool,
    rows,
    currentUserRow,
    approvedRow,
  };
}

function buildClaimPayload(input: {
  tool: ToolSnapshot;
  userId: string;
  companyEmail: string;
  companyWebsite?: string;
  notes?: string;
}) {
  const companyEmail = normalizeText(input.companyEmail).toLowerCase();
  const companyDomain = normalizeDomain(companyEmail);
  const companyWebsite = normalizeText(input.companyWebsite || input.tool.website);
  const websiteDomain = normalizeDomain(companyWebsite || input.tool.website);

  return {
    tool_id: input.tool.id,
    tool_slug: input.tool.slug,
    tool_name: input.tool.name,
    tool_website: input.tool.website || null,
    user_id: normalizeText(input.userId),
    role: "owner" as const,
    status: "pending" as const,
    company_email: companyEmail,
    company_domain: companyDomain,
    verification_method: "email_domain",
    verified: false,
    verified_at: null,
    approved_by: null,
    approved_at: null,
    notes: normalizeText(input.notes || "") || null,
    __companyWebsiteDomain: websiteDomain,
  };
}

async function getExistingRowsForTool(toolSlug: string): Promise<ToolOwnershipRow[]> {
  const rows = await getToolOwnershipRowsBySlug(toolSlug);
  return rows;
}

export async function claimToolOwnership(input: {
  toolSlug: string;
  userId: string;
  companyEmail: string;
  companyWebsite?: string;
  notes?: string;
}): Promise<{
  tool: ToolSnapshot;
  row: ToolOwnershipRow;
  conflict: boolean;
  conflictRow: ToolOwnershipRow | null;
}> {
  const db = getAdminSupabaseClient();
  const tool = await getToolSnapshotBySlug(input.toolSlug);
  const normalizedUserId = normalizeText(input.userId);
  const normalizedEmail = normalizeText(input.companyEmail).toLowerCase();

  if (!normalizedUserId) {
    throw new Error("userId is required");
  }

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("A valid company email is required");
  }

  const existingRows = await getExistingRowsForTool(tool.slug);
  const approvedRow = existingRows.find((row) => row.status === "approved") ?? null;

  if (approvedRow && approvedRow.user_id !== normalizedUserId) {
    return {
      tool,
      row: approvedRow,
      conflict: true,
      conflictRow: approvedRow,
    };
  }

  const currentUserRow = existingRows.find((row) => row.user_id === normalizedUserId) ?? null;
  if (currentUserRow?.status === "approved") {
    return {
      tool,
      row: currentUserRow,
      conflict: false,
      conflictRow: null,
    };
  }

  const payload = buildClaimPayload({
    tool,
    userId: normalizedUserId,
    companyEmail: normalizedEmail,
    companyWebsite: input.companyWebsite,
    notes: input.notes,
  });

  const upsertRow = {
    tool_id: payload.tool_id,
    tool_slug: payload.tool_slug,
    tool_name: payload.tool_name,
    tool_website: payload.tool_website,
    user_id: payload.user_id,
    role: payload.role,
    status: payload.status,
    company_email: payload.company_email,
    company_domain: payload.company_domain,
    verification_method: payload.verification_method,
    verified: payload.verified,
    verified_at: payload.verified_at,
    approved_by: payload.approved_by,
    approved_at: payload.approved_at,
    notes: payload.notes,
  };

  const { data, error } = await db
    .from("tool_owners")
    .upsert(upsertRow, {
      onConflict: "tool_slug,user_id",
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create claim");
  }

  return {
    tool,
    row: data as ToolOwnershipRow,
    conflict: false,
    conflictRow: null,
  };
}

export async function verifyToolOwnership(input: {
  claimId?: string;
  toolSlug?: string;
  userId?: string;
}): Promise<ToolOwnershipRow> {
  const db = getAdminSupabaseClient();

  let row: ToolOwnershipRow | null = null;

  if (input.claimId) {
    const { data, error } = await db
      .from("tool_owners")
      .select("*")
      .eq("id", input.claimId)
      .maybeSingle();

    if (error || !data) {
      throw new Error("Claim not found");
    }

    row = data as ToolOwnershipRow;
  } else if (input.toolSlug && input.userId) {
    const { data, error } = await db
      .from("tool_owners")
      .select("*")
      .eq("tool_slug", normalizeText(input.toolSlug).toLowerCase())
      .eq("user_id", normalizeText(input.userId))
      .maybeSingle();

    if (error || !data) {
      throw new Error("Claim not found");
    }

    row = data as ToolOwnershipRow;
  } else {
    throw new Error("claimId or toolSlug + userId is required");
  }

  const websiteDomain = normalizeDomain(row.tool_website || row.company_domain);
  const companyDomain = normalizeDomain(row.company_domain);

  if (!domainsMatch(companyDomain, websiteDomain)) {
    throw new Error(
      `Domain mismatch: ${companyDomain || "(empty)"} does not match ${websiteDomain || "(empty)"}`
    );
  }

  const verifiedAt = new Date().toISOString();

  const { data, error } = await db
    .from("tool_owners")
    .update({
      verified: true,
      verified_at: verifiedAt,
      notes: row.notes,
    })
    .eq("id", row.id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to verify claim");
  }

  return data as ToolOwnershipRow;
}

export async function approveToolOwnership(input: {
  claimId: string;
  approvedBy?: string;
}): Promise<ToolOwnershipRow> {
  const db = getAdminSupabaseClient();

  const { data, error } = await db
    .from("tool_owners")
    .update({
      status: "approved",
      approved_by: normalizeText(input.approvedBy || "admin") || "admin",
      approved_at: new Date().toISOString(),
    })
    .eq("id", input.claimId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to approve claim");
  }

  return data as ToolOwnershipRow;
}

export async function rejectToolOwnership(input: {
  claimId: string;
  rejectedBy?: string;
  notes?: string;
}): Promise<ToolOwnershipRow> {
  const db = getAdminSupabaseClient();

  const { data, error } = await db
    .from("tool_owners")
    .update({
      status: "rejected",
      approved_by: normalizeText(input.rejectedBy || "admin") || "admin",
      notes: normalizeText(input.notes || "") || null,
    })
    .eq("id", input.claimId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to reject claim");
  }

  return data as ToolOwnershipRow;
}