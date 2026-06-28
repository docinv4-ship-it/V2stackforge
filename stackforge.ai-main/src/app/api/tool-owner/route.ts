import { NextResponse } from "next/server";
import { claimToolOwnership } from "@/lib/tool-owner";

export const runtime = "nodejs";

async function readPayload(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>;
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (!raw || !/^https?:\/\//i.test(raw)) {
    throw new Error("NEXT_PUBLIC_SITE_URL is missing or invalid");
  }

  return raw.replace(/\/+$/, "");
}

export async function POST(request: Request) {
  try {
    const payload = await readPayload(request);

    const toolSlug = normalizeString(payload.toolSlug);
    const fullName = normalizeString(payload.fullName);
    const jobTitle = normalizeString(payload.jobTitle);
    const companyEmail = normalizeString(payload.companyEmail);
    const linkedinUrl = normalizeString(payload.linkedinUrl);
    const notes = normalizeString(payload.notes);

    if (!toolSlug || !fullName || !jobTitle || !companyEmail) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await claimToolOwnership({
      toolSlug,
      fullName,
      jobTitle,
      companyEmail,
      linkedinUrl,
      notes,
    });

    const isFormSubmit = !String(request.headers.get("content-type") || "").includes("application/json");
    if (isFormSubmit) {
      const siteUrl = getSiteUrl();
      return NextResponse.redirect(
        new URL(`/company/claim/${result.tool.slug}?submitted=1`, siteUrl),
        303
      );
    }

    return NextResponse.json({ ok: true, row: result.row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit claim";

    const isFormSubmit = !String(request.headers.get("content-type") || "").includes("application/json");
    if (isFormSubmit) {
      const siteUrl = getSiteUrl();
      const redirectUrl = new URL("/company/claim", siteUrl);
      redirectUrl.searchParams.set("error", message);
      return NextResponse.redirect(redirectUrl, 303);
    }

    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
