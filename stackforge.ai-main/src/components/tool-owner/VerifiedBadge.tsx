"use client";

type VerifiedBadgeProps = {
  status?: "pending" | "approved" | "rejected";
  verified?: boolean;
  className?: string;
};

function getBadgeMeta(status?: "pending" | "approved" | "rejected", verified?: boolean) {
  if (status === "approved") {
    return verified
      ? {
          label: "Verified Vendor",
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        }
      : {
          label: "Approved",
          className: "border-zinc-200 bg-zinc-100 text-zinc-700",
        };
  }

  if (status === "rejected") {
    return {
      label: "Rejected",
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (verified) {
    return {
      label: "Domain Verified",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  return {
    label: "Claim Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
}

export function VerifiedBadge({
  status = "pending",
  verified = false,
  className = "",
}: VerifiedBadgeProps) {
  const meta = getBadgeMeta(status, verified);

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide",
        meta.className,
        className,
      ].join(" ")}
    >
      {meta.label}
    </span>
  );
}