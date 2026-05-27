import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const { count, error } = await supabase
    .from("insider_picks")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (error) {
    console.error("[/api/opportunities/count] supabase error:", error);
    return NextResponse.json(
      { count: null, error: "count unavailable" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { count: count ?? 0, asOf: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
