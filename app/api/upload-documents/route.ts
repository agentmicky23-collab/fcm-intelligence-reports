import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total (Resend limit)

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

// Email recipient for document uploads
const NOTIFICATION_EMAIL = "mikeshparekh@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const tier = formData.get("tier") as string || "";
    const businessName = formData.get("business_name") as string || "";
    const postcode = formData.get("postcode") as string || "";
    const townCity = formData.get("town_city") as string || "";
    const companyName = formData.get("company_name") as string || "";
    const listingSource = formData.get("listing_source") as string || "";
    const listingUrl = formData.get("listing_url") as string || "";
    const customerEmail = formData.get("customer_email") as string || "";
    const customerPhone = formData.get("customer_phone") as string || "";
    
    // Extract files
    const files = formData.getAll("files") as File[];
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Validate files
    let totalSize = 0;
    const validatedFiles: { filename: string; content: Buffer }[] = [];
    
    for (const file of files) {
      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10MB limit` },
          { status: 400 }
        );
      }
      
      // Check mime type
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File ${file.name} has invalid type: ${file.type}` },
          { status: 400 }
        );
      }
      
      totalSize += file.size;
      
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      validatedFiles.push({
        filename: file.name,
        content: Buffer.from(arrayBuffer),
      });
    }

    // Check total size
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: "Total file size exceeds 25MB limit" },
        { status: 400 }
      );
    }

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      // Log the upload details for manual retrieval
      console.log("=== DOCUMENT UPLOAD (No Resend API key) ===");
      console.log("Business:", businessName);
      console.log("Postcode:", postcode);
      console.log("Town/City:", townCity);
      console.log("Company:", companyName);
      console.log("Source:", listingSource);
      console.log("Listing URL:", listingUrl);
      console.log("Customer Email:", customerEmail);
      console.log("Customer Phone:", customerPhone);
      console.log("Tier:", tier);
      console.log("Files:", validatedFiles.map(f => f.filename).join(", "));
      console.log("==========================================");
      
      return NextResponse.json({
        success: true,
        message: "Documents logged (email service not configured)",
        fileCount: validatedFiles.length,
      });
    }

    // Send email with attachments via Resend
    const resend = new Resend(resendApiKey);

    const tierNames: Record<string, string> = {
      location: "Location Report",
      basic: "Basic Report",
      professional: "Professional Report",
      premium: "Premium Report",
    };

    const { data, error } = await resend.emails.send({
      from: "FCM Reports <reports@fcmreport.com>",
      to: NOTIFICATION_EMAIL,
      subject: `📎 New Report Order Documents: ${businessName || "Unknown Business"}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #FFD700; margin-bottom: 20px;">📎 Supporting Documents Received</h1>
          
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 16px;">Order Details</h2>
            <table style="width: 100%; color: #ccc; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Report Type:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333; color: #FFD700;">${tierNames[tier] || tier}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Business Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;">${businessName || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Postcode:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;">${postcode || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Town/City:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;">${townCity || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Company Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;">${companyName || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Listing Source:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;">${listingSource || "Not provided"}</td>
              </tr>
              ${listingUrl ? `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Listing URL:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><a href="${listingUrl}" style="color: #FFD700;">${listingUrl}</a></td>
              </tr>
              ` : ""}
            </table>
          </div>

          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 16px;">Customer Details</h2>
            <table style="width: 100%; color: #ccc; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #333;"><a href="mailto:${customerEmail}" style="color: #FFD700;">${customerEmail || "Not provided"}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0;"><a href="tel:${customerPhone}" style="color: #FFD700;">${customerPhone || "Not provided"}</a></td>
              </tr>
            </table>
          </div>

          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 16px;">📎 Attached Files (${validatedFiles.length})</h2>
            <ul style="color: #ccc; font-size: 14px; padding-left: 20px;">
              ${validatedFiles.map(f => `<li style="padding: 4px 0;">${f.filename}</li>`).join("")}
            </ul>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
            FCM Intelligence Reports • ${new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      `,
      attachments: validatedFiles.map(f => ({
        filename: f.filename,
        content: f.content,
      })),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email with documents" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Documents sent successfully",
      emailId: data?.id,
      fileCount: validatedFiles.length,
    });
  } catch (err) {
    console.error("Upload documents error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Next.js App Router handles file uploads automatically
// For larger files, configure at platform level (Vercel: max 4.5MB on free, 100MB on Pro)
