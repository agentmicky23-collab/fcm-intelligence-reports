/**
 * Live count of active insider_picks rows, used by site metadata + emails.
 * Cached for 5 minutes via unstable_cache so metadata generation is cheap.
 *
 * The number is intentionally rounded so meta tags age gracefully —
 * "600+" is still accurate at 613 or 645, but "613" would be wrong tomorrow.
 *
 * Fallback rule (per FCM canon): on error, return null and let callers render
 * "hundreds of verified live opportunities". NEVER hardcode a count.
 */

import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";

async function fetchActiveCount(): Promise<number | null> {
  try {
    const { count, error } = await supabase
      .from("insider_picks")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    if (error) {
      console.error("[live-count] supabase error:", error);
      return null;
    }
    return count ?? 0;
  } catch (e) {
    console.error("[live-count] fetch failed:", e);
    return null;
  }
}

export const getActiveOpportunityCount = unstable_cache(
  fetchActiveCount,
  ["insider-picks-active-count"],
  { revalidate: 300, tags: ["insider-picks-count"] }
);

/**
 * Round down to a sensible display number so the meta tag doesn't lie when
 * the live total drifts by a few.
 */
export function roundCountForDisplay(n: number): number {
  if (n < 25) return Math.max(10 * Math.floor(n / 10), 10);
  if (n < 100) return 25 * Math.floor(n / 25);
  if (n < 500) return 50 * Math.floor(n / 50);
  return 100 * Math.floor(n / 100);
}

/**
 * "600+" / "100+" / null on failure.
 * Callers should substitute "hundreds of" when this returns null.
 */
export function formatCountString(count: number | null): string | null {
  if (count == null || count <= 0) return null;
  return `${roundCountForDisplay(count)}+`;
}
