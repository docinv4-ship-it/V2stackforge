import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_TO_EMAIL || "kg1338426@gmail.com";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: RESEND_API_KEY is missing." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    let body: ContactPayload;

    try {
      body = (await request.json()) as ContactPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill out all required fields before submitting." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    const html = `
      <div style="margin:0; padding:24px; background:#f4f4f5; font-family:Arial, Helvetica, sans-serif; color:#18181b;">
        <div style="max-width:720px; margin:0 auto; background:#ffffff; border:1px solid #e4e4e7; border-radius:20px; overflow:hidden;">
          <div style="padding:24px; border-bottom:1px solid #e4e4e7; background:#fafafa;">
            <p style="margin:0 0 8px 0; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#71717a;">StackForge AI Contact Message</p>
            <h2 style="margin:0; font-size:28px; line-height:1.2; color:#18181b;">${safeSubject}</h2>
            <p style="margin:10px 0 0 0; font-size:15px; line-height:1.7; color:#52525b;">A new contact request has been submitted from the website.</p>
          </div>

          <div style="padding:24px;">
            <div style="border:1px solid #e4e4e7; border-radius:16px; padding:16px; background:#fafafa; margin-bottom:16px;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#52525b; width:140px;">Name</td>
                  <td style="padding:6px 0; font-size:14px; font-weight:600; color:#18181b;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#52525b;">Email</td>
                  <td style="padding:6px 0; font-size:14px; font-weight:600; color:#18181b;"><a href="mailto:${safeEmail}" style="color:#0f172a; text-decoration:underline;">${safeEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#52525b;">Subject</td>
                  <td style="padding:6px 0; font-size:14px; font-weight:600; color:#18181b;">${safeSubject}</td>
                </tr>
              </table>
            </div>

            <div style="border:1px solid #e4e4e7; border-radius:16px; padding:16px; background:#ffffff;">
              <p style="margin:0 0 10px 0; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#71717a;">Message</p>
              <p style="margin:0; font-size:14px; line-height:1.8; color:#18181b; white-space:pre-wrap;">${safeMessage}</p>
            </div>
          </div>

          <div style="padding:18px 24px; border-top:1px solid #e4e4e7; background:#fafafa;">
            <p style="margin:0; font-size:12px; color:#71717a;">Reply directly to this message or contact the sender at ${safeEmail}.</p>
          </div>
        </div>
      </div>
    `;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      `Message:`,
      message,
    ].join("\n\n");

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [recipientEmail],
      subject: `Contact Form: ${subject}`,
      reply_to: email,
      html,
      text,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to send contact email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
