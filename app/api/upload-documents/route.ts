import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const BUCKET = "report-documents";

const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/csv": ".csv",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip path components and dangerous characters from a filename */
function sanitiseFilename(raw: string): string {
  // Take only the basename (no directory traversal)
  const base = raw.replace(/^.*[\\/]/, "");
  // Remove any non-alphanumeric chars except dot, dash, underscore, space
  const clean = base.replace(/[^a-zA-Z0-9.\-_ ]/g, "_");
  // Collapse multiple underscores / spaces
  return clean.replace(/_{2,}/g, "_").replace(/\s+/g, " ").trim() || "file";
}

/** Supabase client using service role (server-side only) */
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// POST /api/upload-documents
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const formData = await request.formData();

    // --- orderId (required) ------------------------------------------------
    const orderId = (formData.get("orderId") as string | null)?.trim();
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 },
      );
    }

    // --- Files -------------------------------------------------------------
    const files = formData.getAll("files") as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 },
      );
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 },
      );
    }

    // --- Validate & upload each file to Supabase Storage -------------------
    const uploaded: {
      name: string;
      url: string;
      type: string;
      size: number;
      uploaded_at: string;
    }[] = [];

    for (const file of files) {
      // Size check
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 10 MB limit` },
          { status: 400 },
        );
      }

      // Type check
      if (!ACCEPTED_TYPES[file.type]) {
        return NextResponse.json(
          {
            error: `File "${file.name}" has unsupported type (${file.type}). Accepted: PDF, JPG, PNG, DOC(X), XLS(X), CSV.`,
          },
          { status: 400 },
        );
      }

      const safeName = sanitiseFilename(file.name);
      const storagePath = `${orderId}/${safeName}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: true, // overwrite if same name re-uploaded
        });

      if (uploadError) {
        console.error(
          `[upload-documents] Storage upload failed for ${safeName}:`,
          uploadError,
        );
        return NextResponse.json(
          { error: `Failed to upload "${safeName}": ${uploadError.message}` },
          { status: 500 },
        );
      }

      // Generate a signed URL (valid 7 days) — bucket is private
      const { data: signedData, error: signedError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days

      if (signedError) {
        console.error(
          `[upload-documents] Signed URL failed for ${safeName}:`,
          signedError,
        );
      }

      uploaded.push({
        name: safeName,
        url: signedData?.signedUrl || storagePath, // fallback to path
        type: file.type,
        size: file.size,
        uploaded_at: new Date().toISOString(),
      });
    }

    // --- Update orders table (best-effort — order may not exist yet) -------
    // Pre-checkout uploads use orderId like "pre-1711929600000"
    // Post-checkout uploads use the real Supabase order id
    const isPreCheckout = orderId.startsWith("pre-");

    if (!isPreCheckout) {
      try {
        // Fetch existing uploaded_files so we append, not overwrite
        const { data: existing } = await supabase
          .from("orders")
          .select("uploaded_files")
          .eq("id", orderId)
          .single();

        const prev = Array.isArray(existing?.uploaded_files)
          ? existing.uploaded_files
          : [];

        const { error: updateError } = await supabase
          .from("orders")
          .update({ uploaded_files: [...prev, ...uploaded] })
          .eq("id", orderId);

        if (updateError) {
          console.error(
            "[upload-documents] Failed to update orders table:",
            updateError,
          );
          // Non-fatal — files are already in storage
        }
      } catch (dbErr) {
        console.error("[upload-documents] DB update error:", dbErr);
      }
    } else {
      console.log(
        `[upload-documents] Pre-checkout upload (${orderId}): ${uploaded.length} file(s) stored in ${BUCKET}/${orderId}/`,
      );
    }

    // --- Also send email notification (best-effort) -----------------------
    try {
      await sendNotificationEmail(formData, uploaded, orderId);
    } catch (emailErr) {
      console.error("[upload-documents] Email notification failed:", emailErr);
      // Non-fatal
    }

    console.log(
      `[upload-documents] Success: ${uploaded.length} file(s) uploaded for ${orderId}`,
    );

    return NextResponse.json({
      success: true,
      fileCount: uploaded.length,
      files: uploaded,
    });
  } catch (err) {
    console.error("[upload-documents] Unhandled error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Email notification (best-effort, uses Resend if configured)
// ---------------------------------------------------------------------------
async function sendNotificationEmail(
  formData: FormData,
  uploaded: { name: string; size: number; type: string }[],
  orderId: string,
) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendApiKey);

  const businessName = (formData.get("business_name") as string) || "Unknown";
  const customerEmail = (formData.get("customer_email") as string) || "";
  const tier = (formData.get("tier") as string) || "";

  const fileList = uploaded
    .map(
      (f) =>
        `<li>${f.name} (${(f.size / 1024).toFixed(0)} KB, ${f.type})</li>`,
    )
    .join("");

  await resend.emails.send({
    from: "FCM Reports <reports@fcmreport.com>",
    to: "mikeshparekh@gmail.com",
    subject: `📎 Documents uploaded: ${businessName}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
        <h2 style="color:#C9A227;">📎 Customer Documents Uploaded</h2>
        <p><strong>Order:</strong> ${orderId}</p>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Tier:</strong> ${tier || "N/A"}</p>
        <p><strong>Customer:</strong> ${customerEmail || "N/A"}</p>
        <p><strong>Files (${uploaded.length}):</strong></p>
        <ul>${fileList}</ul>
        <p style="color:#888;font-size:12px;">Files stored in Supabase Storage bucket <code>${BUCKET}/${orderId}/</code></p>
      </div>
    `,
  });
}
