/**
 * Insider Picks → Listing mapping
 *
 * The public site renders the `Listing` type (lib/listings-data.ts shape) but the
 * spider writes a leaner `insider_picks` row schema. This module is the single
 * point where DB → UI translation happens.
 */

import type { Listing, BusinessType } from "@/types/listing";

// Subset of the insider_picks columns the site actually reads
export interface InsiderPickRow {
  id: number | string;
  business_name: string;
  location: string;
  region: string | null;
  postcode: string | null;
  price: number | null;
  price_label: string | null;
  pick_reason: string;
  pick_badge: string | null;
  source_platform: string | null;
  source_url: string | null;
  annual_turnover: string | null;
  net_profit: string | null;
  po_salary: string | null;
  status: string;
  added_at: string | null;
  verified_at: string | null;
  tenure: string | null;
  category: string | null;
  is_curated: boolean | null;
  accommodation: string | null;
  premises_size: string | null;
}

function mapCategory(category: string | null): BusinessType {
  switch (category) {
    case "post_office":
      return "post_office";
    case "convenience":
      return "convenience_store";
    case "forecourt":
      return "forecourt";
    default:
      // null/unknown → convenience_store is the catch-all bucket on the site
      return "convenience_store";
  }
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatTenureLabel(tenure: string | null): string {
  if (!tenure) return "Leasehold";
  if (tenure === "either") return "Freehold / Leasehold";
  return titleCase(tenure);
}

// Build the optional details[] block the card renders (po_salary, turnover, etc.)
function buildDetails(row: InsiderPickRow) {
  const details: { label: string; value: string }[] = [];
  if (row.annual_turnover) details.push({ label: "Turnover", value: row.annual_turnover });
  if (row.net_profit) details.push({ label: "Net Profit", value: row.net_profit });
  if (row.po_salary) details.push({ label: "PO Salary", value: row.po_salary });
  if (row.premises_size) details.push({ label: "Premises", value: row.premises_size });
  if (row.accommodation) details.push({ label: "Accommodation", value: row.accommodation });
  return details.length ? details : undefined;
}

// "United Kingdom" is the scraper's fallback when no city was parsed — surface
// something more useful if region/postcode are present.
function bestLocationString(row: InsiderPickRow): string {
  const raw = (row.location || "").trim();
  if (raw && raw.toLowerCase() !== "united kingdom") return raw;
  if (row.region) return row.region;
  if (row.postcode) return row.postcode;
  return "United Kingdom";
}

// price_label is sometimes contaminated by the daltons/rightbiz scrapers
// (they grabbed the title selector instead of the price one). Only trust it
// if it looks like an actual price string.
function cleanPriceLabel(raw: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (s.length === 0 || s.length > 30) return null;
  if (!/^(£|poa|offers|asking|from|sav|price)/i.test(s)) return null;
  return s;
}

export function mapInsiderPickToListing(row: InsiderPickRow): Listing {
  const businessType = mapCategory(row.category);
  const priceStr = row.price != null ? String(row.price) : null;
  const cleanedLabel = cleanPriceLabel(row.price_label);
  const priceDisplay =
    cleanedLabel ||
    (row.price != null ? `£${row.price.toLocaleString("en-GB")}` : undefined);

  return {
    id: String(row.id),
    businessName: row.business_name,
    businessType,
    location: bestLocationString(row),
    region: row.region || "",
    askingPrice: priceStr,
    weeklyTurnover: "",
    yearlyTurnover: row.annual_turnover || "",
    annualFees: "",
    sessionsPerMonth: 0,
    score: 0,
    confidence: "MODERATE",
    status: "new",
    source: row.source_platform || "",
    sourceUrl: row.source_url || "",
    notes: row.pick_reason || "",
    insiderVisible: row.is_curated === true,
    badge: row.pick_badge || undefined,
    priceLabel: formatTenureLabel(row.tenure),
    priceDisplay,
    summary: row.pick_reason || undefined,
    originalUrl: row.source_url || undefined,
    originalUrlLabel: row.source_url ? "View Listing" : "Listing",
    originalUrlDisabled: !row.source_url,
    details: buildDetails(row),
    listedDate: row.added_at || undefined,
    verifiedDate: row.verified_at || undefined,
  };
}
