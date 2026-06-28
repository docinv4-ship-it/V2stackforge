import { NextResponse } from "next/server";
import { decideOwnershipClaim } from "@/lib/tool-owner";

export const runtime = "nodejs";

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const decision = url.searchParams.get("decision") || "";

  if (decision !== "approve" && decision !== "reject") {
    const siteUrl = getSiteUrl();
    const redirectUrl = new URL("/company/claim", siteUrl);
    redirectUrl.searchParams.set("error", "Invalid decision");
    return NextResponse.redirect(redirectUrl, 303);
  }

  try {
    const row = await decideOwnershipClaim({
      token,
      decision,
    });

    const siteUrl = getSiteUrl();
    return NextResponse.redirect(
      new URL(`/company/claim/${row.tool_slug}?decision=${decision}`, siteUrl),
      303
    );
  } catch (error) {
    const siteUrl = getSiteUrl();
    const redirectUrl = new URL("/company/claim", siteUrl);
    redirectUrl.searchParams.set(
      "error",
      error instanceof Error ? error.message : "Decision failed"
    );
    return NextResponse.redirect(redirectUrl, 303);
  }
}
