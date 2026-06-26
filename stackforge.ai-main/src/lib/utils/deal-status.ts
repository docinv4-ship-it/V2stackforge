export type DealStatus = "active" | "upcoming" | "expired";

export type PromoWindow = {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
};

export function parseDate(dateString: string) {
  // CRITICAL SAFETY: Agar dateString khali ya undefined ho toh crash na ho
  if (!dateString || typeof dateString !== "string") {
    return new Date(2026, 5, 1, 12, 0, 0); // Safe fallback (June 1st, 2026)
  }
  const parts = dateString.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return new Date(2026, 5, 1, 12, 0, 0); // Safe structural fallback
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function getDealStatus(
  windows: PromoWindow[],
  now: Date = new Date()
): DealStatus {
  // FIXED: Agar database se deal aayi hai par uski koi explicit promo window (dates) nahi hain,
  // toh use expired karne ke bajaye hamesha default "active" rakho taake offer show ho!
  if (!windows || !Array.isArray(windows) || windows.length === 0) {
    return "active";
  }

  const time = now.getTime();

  // Map ke andar property validation block
  const parsedWindows = windows
    .filter(w => w && typeof w === "object" && "start" in w && "end" in w && w.start && w.end)
    .map((window) => {
      // Dono dates ke start aur end points ko clean calculate karne ke liye hours reset
      const startDate = parseDate(window.start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = parseDate(window.end);
      endDate.setHours(23, 59, 59, 999); // Full day inclusion safety

      return {
        start: startDate.getTime(),
        end: endDate.getTime(),
      };
    });

  // Agar windows array validation mein block ho jayein tab bhi fail-safe "active" bypass karo
  if (parsedWindows.length === 0) {
    return "active";
  }

  const active = parsedWindows.some((window) => time >= window.start && time <= window.end);
  if (active) return "active";

  const nextUpcoming = parsedWindows.some((window) => time < window.start);
  if (nextUpcoming) return "upcoming";

  return "expired";
}

export function formatWindowLabel(window: PromoWindow) {
  // CRITICAL SAFETY: Missing window elements target isolation
  if (!window || !window.start || !window.end) {
    return "Open Activation Window";
  }

  try {
    const start = new Date(window.start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const end = new Date(window.end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Valid data handling checking
    if (start === "Invalid Date" || end === "Invalid Date") {
      return "Promo Window Scheduled";
    }

    return `${start} – ${end}`;
  } catch (e) {
    return "Promo Window Scheduled";
  }
}
