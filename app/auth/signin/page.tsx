"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send magic link");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold tracking-tight" style={{ color: "#FF0000", fontFamily: "Inter, sans-serif" }}>
              FCM
            </span>
            <span className="text-2xl font-bold tracking-tight ml-2" style={{ color: "#FFD700", fontFamily: "Inter, sans-serif" }}>
              Intelligence
            </span>
          </Link>
        </div>

        <div
          className="rounded-xl p-8"
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
                Sign in to view opportunities
              </h1>
              <p className="text-center mb-8" style={{ color: "#8b949e", fontSize: "0.95rem" }}>
                We&apos;ll send you a magic link — no password needed
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                    style={{ background: "#0d1117", border: "1px solid #30363d" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3 rounded-lg text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ background: "#FFD700", color: "#000000" }}
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: "#8b949e" }}>
                  New here?{" "}
                  <Link href="/insider" className="font-medium hover:underline" style={{ color: "#FFD700" }}>
                    Learn about FCM Insider →
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
                Check your email
              </h2>
              <p className="mb-4" style={{ color: "#8b949e" }}>
                We sent a magic link to <strong style={{ color: "#FFD700" }}>{email}</strong>
              </p>
              <p className="text-sm" style={{ color: "#8b949e" }}>
                Click the link in the email to sign in. Check your spam folder if you don&apos;t see it.
              </p>
              <button
                onClick={() => { setSent(false); setError(""); }}
                className="mt-6 text-sm font-medium hover:underline"
                style={{ color: "#FFD700" }}
              >
                Try a different email
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "#8b949e" }}>
          <Link href="/" className="hover:underline" style={{ color: "#8b949e" }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
