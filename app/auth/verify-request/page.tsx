"use client";

import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)" }}
    >
      <div className="w-full max-w-md text-center">
        <div
          className="rounded-xl p-8"
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="text-5xl mb-4">✉️</div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
          >
            Check your email
          </h1>
          <p className="mb-2" style={{ color: "#8b949e" }}>
            We sent you a magic link to sign in.
          </p>
          <p className="text-sm mb-6" style={{ color: "#8b949e" }}>
            Click the link in your email to access FCM Intelligence opportunities.
            Check your spam folder if you don&apos;t see it within a few minutes.
          </p>

          <div
            className="p-4 rounded-lg mb-6"
            style={{
              background: "rgba(255, 215, 0, 0.05)",
              border: "1px solid rgba(255, 215, 0, 0.2)",
            }}
          >
            <p className="text-sm" style={{ color: "#FFD700" }}>
              💡 The link expires in 24 hours. If it expires, just request a new one.
            </p>
          </div>

          <Link
            href="/auth/signin"
            className="inline-block px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#FFD700", color: "#000000" }}
          >
            Request New Link
          </Link>
        </div>

        <p className="mt-6 text-sm" style={{ color: "#8b949e" }}>
          <Link href="/" className="hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
