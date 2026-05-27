#!/usr/bin/env node
/**
 * Insider Picks Audit — Wed 27 May 2026
 * 1. Snapshots full table to backup JSON
 * 2. HEAD-checks every active source_url
 * 3. Flags dead (404 / redirect-to-homepage) and incomplete (missing source_url) rows
 * 4. Writes audit report
 *
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/audit-insider-picks.mjs [--apply]
 *   (without --apply, runs in dry-run mode — no DB writes)
 */

import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const APPLY = process.argv.includes("--apply");
const OUT_DIR = `${process.env.HOME}/subagent-outputs`;
const TODAY = new Date().toISOString().slice(0, 10); // 2026-05-27
const BACKUP_PATH = `${OUT_DIR}/${TODAY}-claudia-insider-picks-backup.json`;
const REPORT_PATH = `${OUT_DIR}/${TODAY}-2100-claudia-supabase-audit.md`;
const CONCURRENCY = 15;
const REQ_TIMEOUT_MS = 8000;

// Known "redirect-to-homepage" patterns: if the final URL after redirects looks
// like one of these, the listing has been removed and the site is showing a
// search/landing page instead.
const HOMEPAGE_PATHS = new Set(["/", ""]);
const HOMEPAGE_PATTERNS = [
  /^\/businesses-for-sale\/?$/i,
  /^\/post-office-for-sale\/?$/i,
  /^\/businesses-for-sale\/post-office\/?$/i,
  /^\/listings\/?$/i,
  /^\/search\/?$/i,
];

function isHomepagePath(pathname) {
  if (HOMEPAGE_PATHS.has(pathname)) return true;
  return HOMEPAGE_PATTERNS.some((re) => re.test(pathname));
}

async function headCheck(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQ_TIMEOUT_MS);
  try {
    let res;
    try {
      res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
      });
    } catch (e) {
      // Some servers refuse HEAD; retry GET with no body read
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
      });
    }
    const finalUrl = new URL(res.url);
    return {
      status: res.status,
      finalUrl: res.url,
      finalPath: finalUrl.pathname,
      redirectedToHomepage: isHomepagePath(finalUrl.pathname),
    };
  } catch (e) {
    return { status: 0, error: e.name === "AbortError" ? "timeout" : e.message };
  } finally {
    clearTimeout(timer);
  }
}

function classify(row, check) {
  if (!row.source_url) return { verdict: "incomplete", reason: "missing source_url" };

  if (check.status === 404) return { verdict: "dead", reason: "HTTP 404" };
  if (check.status === 410) return { verdict: "dead", reason: "HTTP 410 Gone" };
  if (check.redirectedToHomepage)
    return {
      verdict: "dead",
      reason: `redirected to ${check.finalPath || "/"}`,
    };

  // Cloudflare / WAF blocks — keep as active but flag for review
  if (check.status === 403 || check.status === 429)
    return { verdict: "review", reason: `HTTP ${check.status} (likely WAF)` };

  // Timeouts / network errors — keep as active, flag for review
  if (check.status === 0) return { verdict: "review", reason: check.error || "network error" };

  // 5xx — likely transient, flag for review
  if (check.status >= 500) return { verdict: "review", reason: `HTTP ${check.status}` };

  // 200-399 with non-homepage path → still alive
  if (check.status >= 200 && check.status < 400) return { verdict: "keep", reason: `HTTP ${check.status}` };

  return { verdict: "review", reason: `HTTP ${check.status}` };
}

async function poolMap(items, fn, concurrency) {
  const results = new Array(items.length);
  let i = 0;
  let done = 0;
  const total = items.length;
  const workers = Array.from({ length: concurrency }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx], idx);
      done++;
      if (done % 25 === 0 || done === total) {
        process.stdout.write(`  [${done}/${total}]\n`);
      }
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const sb = createClient(url, key);

  console.log(`Mode: ${APPLY ? "APPLY (will write to DB)" : "DRY-RUN (no DB writes)"}`);
  console.log("Fetching all insider_picks rows…");

  const all = [];
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await sb
      .from("insider_picks")
      .select("*")
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw error;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  console.log(`Fetched ${all.length} rows.`);

  await mkdir(dirname(BACKUP_PATH), { recursive: true });
  await writeFile(BACKUP_PATH, JSON.stringify(all, null, 2));
  console.log(`Snapshot → ${BACKUP_PATH}`);

  const activeRows = all.filter((r) => r.status === "active");
  console.log(`Active rows: ${activeRows.length}`);

  // Split: rows with URL get HEAD-checked, rows without get auto-marked incomplete
  const withUrl = activeRows.filter((r) => r.source_url && r.source_url.trim());
  const withoutUrl = activeRows.filter((r) => !r.source_url || !r.source_url.trim());
  console.log(`  With source_url: ${withUrl.length}`);
  console.log(`  Without source_url (auto-incomplete): ${withoutUrl.length}`);

  console.log(`HEAD-checking ${withUrl.length} URLs (concurrency ${CONCURRENCY})…`);
  const checks = await poolMap(withUrl, async (row) => {
    const check = await headCheck(row.source_url);
    return { row, check, verdict: classify(row, check) };
  }, CONCURRENCY);

  // Tally
  const tally = { keep: 0, dead: 0, review: 0, incomplete: withoutUrl.length };
  const byReason = {};
  for (const r of checks) {
    tally[r.verdict.verdict]++;
    const reason = r.verdict.reason;
    byReason[reason] = (byReason[reason] || 0) + 1;
  }

  console.log("\nTally:");
  console.log(`  keep:       ${tally.keep}`);
  console.log(`  dead:       ${tally.dead}`);
  console.log(`  review:     ${tally.review}`);
  console.log(`  incomplete: ${tally.incomplete}`);

  // Updates
  const deadIds = checks.filter((r) => r.verdict.verdict === "dead").map((r) => r.row.id);
  const reviewIds = checks.filter((r) => r.verdict.verdict === "review").map((r) => r.row.id);
  const incompleteIds = withoutUrl.map((r) => r.id);

  // Detailed rows for the report
  const deadDetail = checks
    .filter((r) => r.verdict.verdict === "dead")
    .map((r) => ({
      id: r.row.id,
      business_name: r.row.business_name?.slice(0, 80),
      source_url: r.row.source_url,
      reason: r.verdict.reason,
      final_url: r.check.finalUrl,
    }));
  const reviewDetail = checks
    .filter((r) => r.verdict.verdict === "review")
    .map((r) => ({
      id: r.row.id,
      business_name: r.row.business_name?.slice(0, 80),
      source_url: r.row.source_url,
      reason: r.verdict.reason,
    }));

  if (APPLY) {
    console.log("\nApplying updates to DB…");
    if (deadIds.length) {
      const { error } = await sb
        .from("insider_picks")
        .update({ status: "dead" })
        .in("id", deadIds);
      if (error) console.error("dead update error:", error);
      else console.log(`  marked dead: ${deadIds.length}`);
    }
    if (incompleteIds.length) {
      const { error } = await sb
        .from("insider_picks")
        .update({ status: "incomplete" })
        .in("id", incompleteIds);
      if (error) console.error("incomplete update error:", error);
      else console.log(`  marked incomplete: ${incompleteIds.length}`);
    }
    // 'review' rows: leave as active but log them — review is a separate workflow
    // (we don't want to hide them from the site until a human looks)
  }

  // Report
  const reasonList = Object.entries(byReason)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => `- ${reason}: ${count}`)
    .join("\n");

  const report = `# Insider Picks Audit — ${TODAY}

**Mode:** ${APPLY ? "APPLY (DB updated)" : "DRY-RUN"}
**Snapshot:** \`${BACKUP_PATH}\`
**Total rows:** ${all.length}
**Active before audit:** ${activeRows.length}

## Tally

| Verdict | Count |
|---------|-------|
| keep (verified live) | ${tally.keep} |
| dead (404/410/redirected to homepage) | ${tally.dead} |
| review (timeout / 403 / 5xx — needs manual look) | ${tally.review} |
| incomplete (no source_url) | ${tally.incomplete} |

**Active rows after marking:** ${tally.keep + tally.review} _(keep + review remain status='active' until manually verified)_
**Status writes:**
- ${deadIds.length} rows → \`status='dead'\`
- ${incompleteIds.length} rows → \`status='incomplete'\`

## Reason breakdown (URL checks)

${reasonList}

## Dead listings (sample of first 30)

${deadDetail.slice(0, 30).map((d) => `- **${d.id}** — ${d.business_name}\n  ${d.source_url}\n  → ${d.reason}${d.final_url && d.final_url !== d.source_url ? `\n  → final: ${d.final_url}` : ""}`).join("\n\n")}

${deadDetail.length > 30 ? `\n_(+ ${deadDetail.length - 30} more in snapshot)_` : ""}

## Review queue (needs Henry's eyes)

${reviewDetail.slice(0, 30).map((d) => `- **${d.id}** — ${d.business_name}\n  ${d.source_url}\n  → ${d.reason}`).join("\n\n")}

${reviewDetail.length > 30 ? `\n_(+ ${reviewDetail.length - 30} more in snapshot)_` : ""}

## Incomplete (active rows missing source_url)

These ${incompleteIds.length} rows had \`status='active'\` but no \`source_url\`. They cannot be verified by the site, so they were flagged as incomplete.

IDs: ${incompleteIds.join(", ")}

---

_Generated by \`scripts/audit-insider-picks.mjs\` on ${new Date().toISOString()}_
`;

  await writeFile(REPORT_PATH, report);
  console.log(`\nReport → ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
