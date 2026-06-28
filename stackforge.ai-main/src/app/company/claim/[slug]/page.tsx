import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug } from "@/lib/tools/get-tool";
import type { Tool } from "@/lib/types";
import { checkToolOwnership } from "@/lib/tool-owner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    submitted?: string;
    verified?: string;
    decision?: string;
    error?: string;
  }>;
}

async function getResolvedTool(slug: string): Promise<Tool | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const tool = await getToolBySlug(normalizedSlug);
  return tool ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getResolvedTool(slug);

  if (!tool) {
    return { title: "Tool Not Found | StackForge" };
  }

  return {
    title: `Claim ${tool.name} | StackForge`,
    description: `Verify and claim the official profile for ${tool.name}.`,
  };
}

export default async function CompanyClaimToolPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const tool = await getResolvedTool(slug);
  if (!tool) {
    notFound();
  }

  const ownership = await checkToolOwnership({ toolSlug: tool.slug });
  const isTaken = Boolean(ownership.approvedRow);

  const statusMessage =
    query.error
      ? query.error
      : query.submitted === "1"
        ? "Verification email sent."
        : query.verified === "1"
          ? "Email verified."
          : query.decision === "approve"
            ? "Claim approved."
            : query.decision === "reject"
              ? "Claim rejected."
              : "";

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Claim ownership
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                {tool.name}
              </h1>
            </div>

            <Link
              href={`/tool/${tool.slug}`}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
            >
              Back to profile
            </Link>
          </div>

          {statusMessage ? (
            <div className="mt-6 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
              {statusMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {isTaken ? (
          <div className="flex w-full items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-500">
            Ownership Taken
          </div>
        ) : (
          <form
            action="/api/tool-owner"
            method="post"
            className="grid gap-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <input type="hidden" name="toolSlug" value={tool.slug} />
            <input type="hidden" name="toolName" value={tool.name} />
            <input type="hidden" name="toolWebsite" value={tool.website || ""} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" name="fullName" required />
              <Field label="Job title" name="jobTitle" required />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Company email" name="companyEmail" type="email" required />
              <Field label="LinkedIn URL" name="linkedinUrl" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Notes
              </label>
              <textarea
                name="notes"
                rows={4}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Send verification email
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-zinc-400"
      />
    </div>
  );
}
