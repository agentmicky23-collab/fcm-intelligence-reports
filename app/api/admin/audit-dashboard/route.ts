import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { detectGaps } from "@/lib/audit-constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/audit-dashboard
 * Returns all insurance audit data in one response for Mission Control
 * 
 * Response shape:
 * {
 *   headlineStats: { totalAudits, distinctBranches, avgCritical, last7Days, pdfRequests },
 *   coverTypeDistribution: [{ type, count, percentage }],
 *   gapSeverityOverTime: [{ date, critical, important, worth_reviewing }],
 *   renewalUrgency: [{ bucket, count, percentage }],
 *   topGapPatterns: [{ pattern, count }],
 *   recentSubmissions: [{ id, created_at, branch_name, fad_code, cover_type, critical_count, important_count, renewal_bucket, email }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify admin auth via x-api-key header
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.FCM_ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: HEADLINE STATS
    // ═══════════════════════════════════════════════════════════════════════════
    
    const { data: submissions, error: submissionsError } = await supabase
      .from("support_audit_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (submissionsError) throw submissionsError;

    const { data: pdfRequests, error: pdfError } = await supabase
      .from("support_audit_pdf_requests")
      .select("*");

    if (pdfError) throw pdfError;

    const totalAudits = submissions?.length || 0;
    
    const distinctBranches = new Set(
      submissions
        ?.filter((s) => s.fad_code)
        .map((s) => s.fad_code)
    ).size;

    const avgCritical = totalAudits > 0
      ? Math.round(
          (submissions?.reduce((sum, s) => sum + (s.critical_count || 0), 0) || 0) / totalAudits * 10
        ) / 10
      : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7Days = submissions?.filter(
      (s) => new Date(s.created_at) >= sevenDaysAgo
    ).length || 0;

    const pdfRequestsCount = pdfRequests?.length || 0;

    const headlineStats = {
      totalAudits,
      distinctBranches,
      avgCritical,
      last7Days,
      pdfRequests: pdfRequestsCount,
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: COVER TYPE DISTRIBUTION
    // ═══════════════════════════════════════════════════════════════════════════

    const coverTypeCounts: Record<string, number> = {};
    submissions?.forEach((s) => {
      const type = s.cover_type || "unknown";
      coverTypeCounts[type] = (coverTypeCounts[type] || 0) + 1;
    });

    const coverTypeDistribution = Object.entries(coverTypeCounts)
      .map(([type, count]) => ({
        type,
        count,
        percentage: totalAudits > 0 ? Math.round((count / totalAudits) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: GAP SEVERITY BREAKDOWN OVER TIME
    // ═══════════════════════════════════════════════════════════════════════════

    const gapsByDate: Record<string, { critical: number; important: number; worth_reviewing: number }> = {};

    submissions?.forEach((s) => {
      const date = new Date(s.created_at).toISOString().split("T")[0];
      if (!gapsByDate[date]) {
        gapsByDate[date] = { critical: 0, important: 0, worth_reviewing: 0 };
      }
      gapsByDate[date].critical += s.critical_count || 0;
      gapsByDate[date].important += s.important_count || 0;
      gapsByDate[date].worth_reviewing += s.worth_reviewing_count || 0;
    });

    const gapSeverityOverTime = Object.entries(gapsByDate)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: RENEWAL URGENCY DISTRIBUTION
    // ═══════════════════════════════════════════════════════════════════════════

    const renewalCounts: Record<string, number> = {};
    submissions?.forEach((s) => {
      const bucket = s.renewal_bucket || "unsure";
      renewalCounts[bucket] = (renewalCounts[bucket] || 0) + 1;
    });

    const bucketOrder = ["0_3m", "3_6m", "6_12m", "12m_plus", "unsure"];
    const renewalUrgency = bucketOrder
      .map((bucket) => ({
        bucket,
        count: renewalCounts[bucket] || 0,
        percentage: totalAudits > 0 ? Math.round(((renewalCounts[bucket] || 0) / totalAudits) * 100) : 0,
      }))
      .filter((r) => r.count > 0);

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: TOP GAP PATTERNS
    // ═══════════════════════════════════════════════════════════════════════════

    const gapPatternCounts: Record<string, number> = {};

    submissions?.forEach((s) => {
      if (!s.answers) return;
      const gaps = detectGaps(s.answers);
      gaps.forEach((gap) => {
        gapPatternCounts[gap.name] = (gapPatternCounts[gap.name] || 0) + 1;
      });
    });

    const topGapPatterns = Object.entries(gapPatternCounts)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 6: RECENT SUBMISSIONS (last 20)
    // ═══════════════════════════════════════════════════════════════════════════

    const recentSubmissions = submissions?.slice(0, 20).map((s) => ({
      id: s.id,
      created_at: s.created_at,
      branch_name: s.branch_name || "—",
      fad_code: s.fad_code || "—",
      cover_type: s.cover_type || "unknown",
      critical_count: s.critical_count || 0,
      important_count: s.important_count || 0,
      renewal_bucket: s.renewal_bucket,
      email: s.email,
      answers: s.answers, // Include full answers for modal
    })) || [];

    // ═══════════════════════════════════════════════════════════════════════════
    // RETURN COMPLETE DASHBOARD DATA
    // ═══════════════════════════════════════════════════════════════════════════

    return NextResponse.json({
      headlineStats,
      coverTypeDistribution,
      gapSeverityOverTime,
      renewalUrgency,
      topGapPatterns,
      recentSubmissions,
    });

  } catch (error: any) {
    console.error("[audit-dashboard] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
