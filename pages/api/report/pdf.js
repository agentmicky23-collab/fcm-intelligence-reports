// ============================================================
// FCM INTELLIGENCE — FORGE PDF EXPORT API
// File: pages/api/report/pdf.js (Next.js API route)
//
// Usage: GET /api/report/pdf?orderId=2026-03-16-001
// Returns: PDF file (application/pdf)
//
// How it works:
// 1. Fetches report JSON from Supabase by orderId
// 2. Launches headless Chromium via Puppeteer
// 3. Navigates to the report page (/report/[orderId])
// 4. Waits for all content (charts, images) to render
// 5. Exports to PDF with A4 formatting
// 6. Returns the PDF buffer
//
// Version: 1.0 — 18 March 2026
// ============================================================

// NOTE: In production on Vercel, use @sparticuz/chromium for serverless Puppeteer.
// Local dev can use regular puppeteer.
//
// Install:
//   npm install puppeteer @sparticuz/chromium
//
// For Vercel deployment, add to next.config.js:
//   experimental: { serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"] }

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ error: "orderId query parameter required" });
  }

  let browser = null;

  try {
    // ========================================
    // 1. VALIDATE ORDER EXISTS
    // ========================================
    // In production, verify the order exists in Supabase before rendering.
    // This prevents arbitrary URL rendering.
    //
    // import { createClient } from "@supabase/supabase-js";
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    // const { data: order, error: orderError } = await supabase
    //   .from("reports")
    //   .select("order_ref, customer_email, tier")
    //   .eq("order_ref", orderId)
    //   .single();
    //
    // if (orderError || !order) {
    //   return res.status(404).json({ error: "Report not found" });
    // }

    // ========================================
    // 2. LAUNCH PUPPETEER
    // ========================================
    let puppeteer;
    let launchOptions;

    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      // Serverless environment (Vercel / AWS Lambda)
      const chromium = require("@sparticuz/chromium");
      puppeteer = require("puppeteer-core");

      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      };
    } else {
      // Local development
      puppeteer = require("puppeteer");
      launchOptions = {
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      };
    }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // ========================================
    // 3. NAVIGATE TO REPORT PAGE
    // ========================================
    // Use internal URL — Puppeteer renders the same Next.js page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const reportUrl = `${baseUrl}/report/${orderId}`;

    await page.goto(reportUrl, {
      waitUntil: "networkidle0", // Wait for all network requests to complete
      timeout: 60000, // 60 second timeout (reports can be large)
    });

    // ========================================
    // 4. WAIT FOR CONTENT TO RENDER
    // ========================================
    // Wait for Chart.js canvases to finish rendering
    await page.waitForFunction(() => {
      const canvases = document.querySelectorAll("canvas");
      if (canvases.length === 0) return true; // No charts = ready
      // Check all canvases have rendered (non-zero dimensions)
      return Array.from(canvases).every(c => c.width > 0 && c.height > 0);
    }, { timeout: 30000 });

    // Additional wait for any animations to complete
    await page.waitForTimeout(2000);

    // Hide browser-only elements (nav bar, download button)
    await page.evaluate(() => {
      document.querySelectorAll(".browser-only").forEach(el => {
        el.style.display = "none";
      });
      // Remove gaps between pages for PDF
      document.querySelectorAll(".report-page").forEach(el => {
        el.style.marginBottom = "0";
        el.style.boxShadow = "none";
      });
      // Set container to full width
      const container = document.querySelector(".report-container");
      if (container) {
        container.style.maxWidth = "none";
        container.style.background = "white";
      }
    });

    // ========================================
    // 5. GENERATE PDF
    // ========================================
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // CRITICAL: renders background colours
      preferCSSPageSize: false,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      // No header/footer — handled by components
      displayHeaderFooter: false,
    });

    // ========================================
    // 6. RETURN PDF
    // ========================================
    // Build filename: FCM-Intelligence-{BusinessName}-{Tier}-{Date}.pdf
    // Sanitise business name for filename
    const sanitisedName = (/* order.business_name || */ "Report")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    const filename = `FCM-Intelligence-${sanitisedName}-${orderId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");

    return res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF generation error:", error);
    return res.status(500).json({
      error: "PDF generation failed",
      detail: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// ============================================================
// CONFIG: Increase body size limit for PDF responses
// ============================================================
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "25mb",
  },
};
