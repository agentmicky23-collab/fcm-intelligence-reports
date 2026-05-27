import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapInsiderPickToListing, type InsiderPickRow } from "@/lib/insider-picks-mapping";

// Always run server-side, never statically pre-render
export const dynamic = "force-dynamic";
// Cache CDN responses for 60s; stale-while-revalidate for 5m
export const revalidate = 60;

const MAX_LIMIT = 1000;
const DEFAULT_LIMIT = 1000;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Number(searchParams.get("limit")) || DEFAULT_LIMIT,
    MAX_LIMIT
  );
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

  const { data, error, count } = await supabase
    .from("insider_picks")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .order("added_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[/api/opportunities] supabase error:", error);
    return NextResponse.json(
      { listings: [], total: 0, error: "Failed to load opportunities" },
      { status: 500 }
    );
  }

  const listings = (data as InsiderPickRow[] | null)?.map(mapInsiderPickToListing) ?? [];

  return NextResponse.json(
    { listings, total: count ?? listings.length, limit, offset },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
