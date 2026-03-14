export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/magic-link";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    // Generate magic link token
    const token = await createMagicLinkToken(email.toLowerCase().trim());

    const baseUrl = process.env.NEXTAUTH_URL || "https://fcmreport.com";
    const magicLink = `${baseUrl}/auth/verify?token=${token}`;

    // Send via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "noreply@fcmreport.com",
        to: email.toLowerCase().trim(),
        subject: "Sign in to FCM Intelligence",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;padding:32px;background:#161b22;border-radius:12px;border:1px solid #30363d;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="color:#FF0000;font-size:24px;font-weight:bold;">FCM</span>
      <span style="color:#FFD700;font-size:24px;font-weight:bold;margin-left:8px;">Intelligence</span>
    </div>
    
    <h1 style="color:#fff;font-size:20px;text-align:center;margin-bottom:8px;">Sign in to your account</h1>
    <p style="color:#8b949e;font-size:14px;text-align:center;margin-bottom:24px;">Click the button below to access FCM Intelligence opportunities.</p>
    
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${magicLink}" style="display:inline-block;padding:12px 32px;background:#FFD700;color:#000;font-weight:600;font-size:16px;text-decoration:none;border-radius:8px;">
        Sign In →
      </a>
    </div>
    
    <p style="color:#8b949e;font-size:12px;text-align:center;">This link expires in 15 minutes.</p>
    <p style="color:#8b949e;font-size:12px;text-align:center;margin-top:16px;">If you didn't request this, you can safely ignore this email.</p>
    
    <hr style="border:none;border-top:1px solid #30363d;margin:24px 0;">
    <p style="color:#8b949e;font-size:11px;text-align:center;">
      Can't click the button? Copy this link:<br>
      <a href="${magicLink}" style="color:#FFD700;word-break:break-all;font-size:11px;">${magicLink}</a>
    </p>
  </div>
</body>
</html>
        `.trim(),
        text: `Sign in to FCM Intelligence\n\nClick this link to sign in:\n${magicLink}\n\nThis link expires in 15 minutes.\nIf you didn't request this, you can safely ignore this email.`,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error("Resend error:", errBody);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Magic link error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
