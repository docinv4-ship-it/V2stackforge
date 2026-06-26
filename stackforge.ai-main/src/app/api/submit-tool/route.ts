import { NextResponse } from "next/server";
import { Resend } from "resend";

type MediaAsset = {
  name: string;
  type: string;
  dataUrl: string;
};

type SubmitToolPayload = {
  toolName?: string;
  website?: string;
  category?: string;
  oneLineDescription?: string;
  whyShouldWeFeature?: string;
  contactEmail?: string;
  yourRole?: string;
  freePlanAvailable?: "yes" | "no" | "";
  startingPrice?: string;
  affiliateProgramAvailable?: "yes" | "no" | "not_sure" | "";
  affiliatePartnerUrl?: string;
  mainCompetitors?: string;
  bestFor?: string[];
  logoUpload?: MediaAsset | null;
  productScreenshots?: MediaAsset[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      return "";
    }
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function extractBase64Content(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid uploaded file format.");
  }

  return {
    mimeType: match[1],
    base64: match[2],
  };
}

function splitTags(value?: string) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: RESEND_API_KEY is missing." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    let body: SubmitToolPayload;

    try {
      body = (await request.json()) as SubmitToolPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const toolName = body.toolName?.trim() || "";
    const websiteInput = body.website?.trim() || "";
    const category = body.category?.trim() || "";
    const oneLineDescription = body.oneLineDescription?.trim() || "";
    const whyShouldWeFeature = body.whyShouldWeFeature?.trim() || "";
    const contactEmail = body.contactEmail?.trim() || "";
    const yourRole = body.yourRole?.trim() || "";
    const freePlanAvailable = body.freePlanAvailable || "";
    const startingPrice = body.startingPrice?.trim() || "";
    const affiliateProgramAvailable = body.affiliateProgramAvailable || "";
    const affiliatePartnerUrlInput = body.affiliatePartnerUrl?.trim() || "";
    const mainCompetitors = body.mainCompetitors?.trim() || "";
    const bestFor = Array.isArray(body.bestFor) ? body.bestFor.filter(Boolean) : [];
    const logoUpload = body.logoUpload ?? null;
    const productScreenshots = Array.isArray(body.productScreenshots)
      ? body.productScreenshots
      : [];

    const requiredFields = [
      toolName,
      websiteInput,
      category,
      oneLineDescription,
      whyShouldWeFeature,
      contactEmail,
    ];

    if (requiredFields.some((value) => !value)) {
      return NextResponse.json(
        { error: "Please fill out all required fields before submitting." },
        { status: 400 }
      );
    }

    if (!isValidEmail(contactEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid contact email address." },
        { status: 400 }
      );
    }

    const website = normalizeUrl(websiteInput);
    if (!website) {
      return NextResponse.json(
        { error: "Please enter a valid official website URL." },
        { status: 400 }
      );
    }

    let affiliatePartnerUrl = "";
    if (affiliateProgramAvailable === "yes") {
      affiliatePartnerUrl = normalizeUrl(affiliatePartnerUrlInput);
      if (!affiliatePartnerUrl) {
        return NextResponse.json(
          { error: "Please provide a valid affiliate or partner URL." },
          { status: 400 }
        );
      }
    }

    const attachments: Array<{
      filename: string;
      content: string;
      content_id?: string;
    }> = [];

    let logoHtml = "";
    if (logoUpload?.dataUrl) {
      const { mimeType, base64 } = extractBase64Content(logoUpload.dataUrl);
      const logoExtension = mimeType.includes("svg") ? "svg" : "png";

      attachments.push({
        filename: `logo.${logoExtension}`,
        content: base64,
        content_id: "tool-logo",
      });

      logoHtml = `
        <div style="margin-top: 20px; padding: 16px; border: 1px solid #e4e4e7; border-radius: 16px; background: #fafafa;">
          <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #18181b; letter-spacing: 0.04em; text-transform: uppercase;">Uploaded Logo</p>
          <img src="cid:tool-logo" alt="Tool logo" style="max-width: 160px; width: auto; height: auto; display: block; border: 1px solid #e4e4e7; border-radius: 12px; background: #ffffff; padding: 12px;" />
        </div>
      `;
    }

    const screenshotHtmlParts: string[] = [];

    productScreenshots.slice(0, 3).forEach((asset, index) => {
      if (!asset?.dataUrl) return;

      const { mimeType, base64 } = extractBase64Content(asset.dataUrl);
      const extension = mimeType.split("/")[1]?.split("+")[0] || "png";
      const contentId = `screenshot-${index + 1}`;

      attachments.push({
        filename: `screenshot-${index + 1}.${extension}`,
        content: base64,
        content_id: contentId,
      });

      screenshotHtmlParts.push(`
        <div style="border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; background: #ffffff;">
          <img src="cid:${contentId}" alt="Screenshot ${index + 1}" style="display: block; width: 100%; height: auto; max-width: 100%;" />
        </div>
      `);
    });

    const competitors = splitTags(mainCompetitors);
    const bestForChips = bestFor.slice(0, 8).map((item) => escapeHtml(item));

    const html = `
      <div style="margin: 0; padding: 24px; background: #f4f4f5; font-family: Arial, Helvetica, sans-serif; color: #18181b;">
        <div style="max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 20px; overflow: hidden;">
          <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background: #fafafa;">
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #71717a;">StackForge AI Tool Submission</p>
            <h2 style="margin: 0; font-size: 28px; line-height: 1.2; color: #18181b;">${escapeHtml(toolName)}</h2>
            <p style="margin: 10px 0 0 0; font-size: 15px; line-height: 1.7; color: #52525b;">A new submission has been sent for manual review.</p>
          </div>

          <div style="padding: 24px;">
            <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 20px;">
              <div style="border: 1px solid #e4e4e7; border-radius: 16px; padding: 16px; background: #fafafa;">
                <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">Core Details</p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b; width: 180px;">Tool Name</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(toolName)}</td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Official Website</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;"><a href="${escapeHtml(website)}" style="color: #0f172a; text-decoration: underline;">${escapeHtml(website)}</a></td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Category</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(category)}</td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">One-Line Description</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(oneLineDescription)}</td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Contact Email</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(contactEmail)}</td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Your Role</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(yourRole || "Not specified")}</td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Free Plan Available?</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(freePlanAvailable || "Not specified")}</td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Starting Price</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(startingPrice || "Not specified")}</td></tr>
                  <tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Affiliate Program</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;">${escapeHtml(affiliateProgramAvailable || "Not specified")}</td></tr>
                  ${
                    affiliatePartnerUrl
                      ? `<tr><td style="padding: 6px 0; font-size: 14px; color: #52525b;">Affiliate / Partner URL</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #18181b;"><a href="${escapeHtml(affiliatePartnerUrl)}" style="color: #0f172a; text-decoration: underline;">${escapeHtml(affiliatePartnerUrl)}</a></td></tr>`
                      : ""
                  }
                </table>
              </div>

              <div style="border: 1px solid #e4e4e7; border-radius: 16px; padding: 16px; background: #ffffff;">
                <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">Why Feature This Tool?</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #18181b; white-space: pre-wrap;">${escapeHtml(whyShouldWeFeature)}</p>
              </div>

              <div style="border: 1px solid #e4e4e7; border-radius: 16px; padding: 16px; background: #fafafa;">
                <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">Main Competitors</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #18181b;">${competitors.length ? competitors.map((item) => `• ${escapeHtml(item)}`).join("<br />") : "Not specified"}</p>
              </div>

              <div style="border: 1px solid #e4e4e7; border-radius: 16px; padding: 16px; background: #ffffff;">
                <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">Best For</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${
                    bestForChips.length
                      ? bestForChips
                          .map(
                            (item) =>
                              `<span style="display:inline-block; border:1px solid #e4e4e7; background:#f4f4f5; color:#3f3f46; border-radius:999px; padding:6px 10px; font-size:12px; font-weight:600;">${item}</span>`
                          )
                          .join("")
                      : '<span style="font-size: 14px; color: #52525b;">Not specified</span>'
                  }
                </div>
              </div>

              ${
                logoHtml
                  ? logoHtml
                  : '<div style="border:1px solid #e4e4e7; border-radius:16px; padding:16px; background:#fafafa;"><p style="margin:0; font-size:14px; color:#52525b;">No logo upload was included.</p></div>'
              }

              <div style="border: 1px solid #e4e4e7; border-radius: 16px; padding: 16px; background: #fafafa;">
                <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #71717a;">Product Screenshots</p>
                ${
                  screenshotHtmlParts.length
                    ? `<div style="display:grid; grid-template-columns: 1fr; gap: 12px;">${screenshotHtmlParts.join("")}</div>`
                    : '<p style="margin: 0; font-size: 14px; color: #52525b;">No screenshots were uploaded.</p>'
                }
              </div>
            </div>
          </div>

          <div style="padding: 18px 24px; border-top: 1px solid #e4e4e7; background: #fafafa;">
            <p style="margin: 0; font-size: 12px; color: #71717a;">This email was generated automatically from the StackForge AI submission form.</p>
          </div>
        </div>
      </div>
    `;

    const text = [
      `New Tool Submission: ${toolName}`,
      `Official Website: ${website}`,
      `Category: ${category}`,
      `One-Line Description: ${oneLineDescription}`,
      `Contact Email: ${contactEmail}`,
      `Your Role: ${yourRole || "Not specified"}`,
      `Free Plan Available?: ${freePlanAvailable || "Not specified"}`,
      `Starting Price: ${startingPrice || "Not specified"}`,
      `Affiliate Program Available?: ${affiliateProgramAvailable || "Not specified"}`,
      `Affiliate / Partner URL: ${affiliatePartnerUrl || "Not specified"}`,
      `Main Competitors: ${competitors.length ? competitors.join(", ") : "Not specified"}`,
      `Best For: ${bestFor.length ? bestFor.join(", ") : "Not specified"}`,
      `Why Should We Feature This Tool?: ${whyShouldWeFeature}`,
      `Logo Uploaded: ${logoUpload ? logoUpload.name : "No"}`,
      `Screenshots Uploaded: ${productScreenshots.length ? productScreenshots.map((item) => item.name).join(", ") : "No"}`,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: "StackForge AI Submissions <onboarding@resend.dev>",
      to: ["kg1338426@gmail.com"],
      subject: `New Tool Submission: ${toolName}`,
      html,
      text,
      attachments: attachments.length ? (attachments as any) : undefined,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to send submission email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
