import { NextRequest, NextResponse } from "next/server";
import {
  approveToolOwnership,
  checkToolOwnership,
  claimToolOwnership,
  rejectToolOwnership,
  verifyToolOwnership,
} from "@/lib/tool-owner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type OwnershipAction = "claim" | "verify" | "approve" | "reject" | "check";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const action = asString(body.action).toLowerCase() as OwnershipAction;

    if (!action) {
      return NextResponse.json({ ok: false, error: "Missing action" }, { status: 400 });
    }

    if (action === "check") {
      const toolSlug = asString(body.toolSlug);
      const userId = asString(body.userId);
      const includeAll = asBoolean(body.includeAll);

      const result = await checkToolOwnership({
        toolSlug: toolSlug || undefined,
        userId: userId || undefined,
        includeAll,
      });

      return NextResponse.json({ ok: true, ...result });
    }

    if (action === "claim") {
      const toolSlug = asString(body.toolSlug);
      const userId = asString(body.userId);
      const companyEmail = asString(body.companyEmail);
      const companyWebsite = asString(body.companyWebsite);
      const notes = asString(body.notes);

      if (!toolSlug || !userId || !companyEmail) {
        return NextResponse.json(
          { ok: false, error: "toolSlug, userId and companyEmail are required" },
          { status: 400 }
        );
      }

      const result = await claimToolOwnership({
        toolSlug,
        userId,
        companyEmail,
        companyWebsite: companyWebsite || undefined,
        notes: notes || undefined,
      });

      if (result.conflict) {
        return NextResponse.json(
          {
            ok: false,
            error: "This tool is already claimed by another owner",
            conflict: true,
            tool: result.tool,
            row: result.row,
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        ok: true,
        tool: result.tool,
        row: result.row,
        message: "Claim submitted. Verification is pending.",
      });
    }

    if (action === "verify") {
      const claimId = asString(body.claimId);
      const toolSlug = asString(body.toolSlug);
      const userId = asString(body.userId);

      const row = await verifyToolOwnership({
        claimId: claimId || undefined,
        toolSlug: toolSlug || undefined,
        userId: userId || undefined,
      });

      return NextResponse.json({
        ok: true,
        row,
        message: "Claim verified successfully.",
      });
    }

    if (action === "approve") {
      const claimId = asString(body.claimId);
      const approvedBy = asString(body.approvedBy);

      if (!claimId) {
        return NextResponse.json(
          { ok: false, error: "claimId is required" },
          { status: 400 }
        );
      }

      const row = await approveToolOwnership({
        claimId,
        approvedBy: approvedBy || "admin",
      });

      return NextResponse.json({
        ok: true,
        row,
        message: "Claim approved successfully.",
      });
    }

    if (action === "reject") {
      const claimId = asString(body.claimId);
      const rejectedBy = asString(body.rejectedBy);
      const notes = asString(body.notes);

      if (!claimId) {
        return NextResponse.json(
          { ok: false, error: "claimId is required" },
          { status: 400 }
        );
      }

      const row = await rejectToolOwnership({
        claimId,
        rejectedBy: rejectedBy || "admin",
        notes: notes || undefined,
      });

      return NextResponse.json({
        ok: true,
        row,
        message: "Claim rejected successfully.",
      });
    }

    return NextResponse.json(
      { ok: false, error: `Unsupported action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST for ownership actions" },
    { status: 405 }
  );
}