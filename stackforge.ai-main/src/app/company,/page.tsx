import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const sections = [
  {
    title: "Claim your profile",
    description: "Search the tool, verify your company email, and submit the ownership request.",
  },
  {
    title: "Get verified",
    description: "Approved claims unlock a verified vendor state and the future edit layer.",
  },
  {
    title: "Manage cleanly",
    description: "Keep the public review pages separate from the company ownership workspace.",
  },
];

const principles = [
  "No public clutter on tool detail pages.",
  "Company onboarding lives in a dedicated vendor area.",
  "Verified ownership stays separate from public reviews.",
  "The architecture stays small enough to scale later.",
];

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-zinc-400" />
              For Companies
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Claim your tool. Verify your brand. Manage the profile properly.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              StackForge keeps public discovery pages clean and gives companies a dedicated ownership flow for verified vendor access.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/company/claim"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Claim a tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/company/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                Open dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50">
                <CheckCircle2 className="h-5 w-5 text-zinc-700" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-zinc-950">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{section.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
              Why this layout
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-950">
              Professional vendors get a separate workspace.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Public pages stay focused on discovery and comparison. Company pages handle the claim flow, verification, and future owner tooling without mixing the two experiences.
            </p>

            <ul className="mt-6 space-y-3">
              {principles.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-700">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-950">Vendor flow</h3>
            <div className="mt-5 space-y-3">
              {[
                "Search your tool",
                "Open the profile",
                "Claim the profile",
                "Verify the company email",
                "Wait for approval",
                "Open the dashboard",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
